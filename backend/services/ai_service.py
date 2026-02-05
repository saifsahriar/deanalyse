from openai import OpenAI
import os
import json
import pandas as pd
import traceback
import io
import sys
from typing import Dict, Any, List, Optional

class AIService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("Warning: OPENAI_API_KEY not found. AI features will not work.")
            self.client = None
        else:
            self.client = OpenAI(api_key=api_key)
            self.model = "gpt-4o"

    def _sanitize_input(self, text: str) -> str:
        """
        Sanitize user input to prevent prompt injection attacks.
        """
        if not text:
            return ""
        
        # Remove potential injection patterns
        dangerous_patterns = [
            "ignore previous instructions",
            "ignore all previous",
            "disregard previous",
            "forget previous",
            "new instructions:",
            "system:",
            "assistant:",
            "you are now",
            "act as",
            "pretend you are",
            "roleplay as",
        ]
        
        text_lower = text.lower()
        for pattern in dangerous_patterns:
            if pattern in text_lower:
                # Replace with safe version
                text = text.replace(pattern, "[filtered]")
                text = text.replace(pattern.upper(), "[filtered]")
                text = text.replace(pattern.title(), "[filtered]")
        
        # Limit length to prevent context overflow attacks
        max_length = 500
        if len(text) > max_length:
            text = text[:max_length]
        
        # Remove excessive newlines/whitespace that could break prompt structure
        text = " ".join(text.split())
        
        return text.strip()
    
    def _sanitize_context(self, context: str) -> str:
        """
        Sanitize data context to prevent injection via uploaded data.
        """
        # Limit context size to prevent token overflow
        max_context_length = 5000
        if len(context) > max_context_length:
            context = context[:max_context_length] + "... [truncated for safety]"
        
        return context

    def _extract_python_code(self, text: str) -> str:
        """
        Extracts Python code from markdown blocks.
        """
        if "```python" in text:
            code = text.split("```python")[1].split("```")[0].strip()
            return code
        elif "```" in text:
            code = text.split("```")[1].split("```")[0].strip()
            return code
        return ""

    def _execute_analysis_code(self, code: str, df: pd.DataFrame) -> Any:
        """
        Executes generated Python code on the dataframe.
        """
        try:
            # Create a localized environment
            local_vars = {"df": df, "pd": pd, "result": None}
            
            # wrapper to capture print output
            old_stdout = sys.stdout
            redirected_output = io.StringIO()
            sys.stdout = redirected_output
            
            # Execute the code
            # We expect the code to define a function analyze_data(df) or set a variable 'result'
            exec(code, {}, local_vars)
            
            sys.stdout = old_stdout
            captured_output = redirected_output.getvalue()
            
            # Check if analyze_data function exists and call it
            if "analyze_data" in local_vars:
                result = local_vars["analyze_data"](df)
                return f"Analysis Result: {result}\nOutput: {captured_output}"
            elif "result" in local_vars and local_vars["result"] is not None:
                return f"Analysis Result: {local_vars['result']}\nOutput: {captured_output}"
            else:
                return f"Code executed but no result returned. Output: {captured_output}"
                
        except Exception as e:
            return f"Error executing code: {str(e)}\n{traceback.format_exc()}"

    async def generate_response(self, context: str, query: str, df: pd.DataFrame = None) -> str:
        """
        Generates a text response from OpenAI. If df is provided, it may generate and execute code.
        """
        if not self.client:
            return "AI Service is not configured (Missing API Key)."
        
        # SECURITY: Sanitize inputs
        safe_query = self._sanitize_input(query)
        safe_context = self._sanitize_context(context)
        
        # Strategy:
        # 1. If df is available, ask AI if it needs to run code.
        # 2. If yes, generate code, execute, and feed result back.
        # 3. If no (or no df), use standard text generation.
        
        if df is not None:
             # Phase 1: Planning / Code Generation
             plan_prompt = f"""You are a Python Data Analyst. 
User Question: {safe_query}
Data Schema: 
{safe_context}

Determine if you need to run Python code on the dataframe 'df' to answer this question.
Questions asking for "top products", "revenue calculations", "aggregations", "filtering", or "specific counts" usually requires code.
Questions about "general business advice" or "interpreting the visible summary" might not.

If YES (you need code):
Write a Python script.
- The script MUST define a function `def analyze_data(df):` that takes the dataframe and returns the answer/result.
- Use pandas for calculations. 
- Handle potential missing values or data type issues if obvious.
- Return the result as a string or a structured object (dict/list) that is easy to read.
- Wrap the code in ```python ... ```.

If NO (you don't need code):
Just answer the user question directly based on the summary provided.
"""
             try:
                 response1 = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": plan_prompt}],
                    temperature=0.1 # Lower temp for code
                 )
                 content1 = response1.choices[0].message.content
                 
                 code = self._extract_python_code(content1)
                 
                 if code:
                     # Phase 2: Execution
                     execution_result = self._execute_analysis_code(code, df)
                     
                     # Phase 3: Synthesis
                     final_prompt = f"""User Question: {safe_query}
                     
I ran the following analysis code:
```python
{code}
```

The execution result was:
{execution_result}

Please provide a natural language answer to the user based on this result. Be concise, professional, and helpful. 
Do not mention "I ran the code" or technical details unless asked. Just give the business insight/answer.
"""
                     response2 = self.client.chat.completions.create(
                        model=self.model,
                        messages=[{"role": "user", "content": final_prompt}],
                        temperature=0.7
                     )
                     return response2.choices[0].message.content
                     
                 else:
                     # No code generated, just use the first response if it looks like an answer
                     return content1
                     
             except Exception as e:
                 print(f"Error in AI analysis flow: {e}")
                 # Fallback to standard flow if code generation fails
                 pass

        # Standard flow (Fallback or no DF)
        system_prompt = """You are a business analyst helping a small business owner understand their data.
Use the provided data summary to answer questions.
If you don't have enough data to answer precisely, admit it but try to give general advice.
"""

        user_prompt = f"""Dataset Summary:
{safe_context}

User Question: {safe_query}"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error processing request: {str(e)}"

    async def suggest_kpis(self, data_summary: Dict[str, Any]) -> List[Dict[str, str]]:
        """
        Suggests relevant KPIs based on the dataset structure.
        Returns a JSON list of KPIs.
        """
        if not self.client:
            return []

        # Simplify summary for the prompt to save tokens/avoid clutter
        columns_desc = ", ".join([f"{col['name']} ({col['type']})" for col in data_summary['columns']])
        
        prompt = f"""Analyze this dataset structure:
Columns: {columns_desc}
Row Count: {data_summary['rowCount']}

Suggest 3 key performance indicators (KPIs) that would be valuable to track.
Return ONLY a JSON array of objects with 'title', 'value_type' (e.g. currency, percentage, count), and 'reason'.
Do not include markdown formatting or backticks. Just the raw JSON."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a data analyst. Return only valid JSON, no markdown."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=300
            )
            
            text = response.choices[0].message.content.strip()
            # Cleanup potential markdown code blocks if added
            if text.startswith("```"):
                text = text.split("\n", 1)[1]
            if text.endswith("```"):
                text = text.rsplit("\n", 1)[0]
            if text.startswith("json"):
                text = text[4:].strip()
                
            return json.loads(text)
        except Exception as e:
            print(f"Error generating KPIs: {e}")
            return []
