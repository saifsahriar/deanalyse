import pandas as pd
import io
from typing import Dict, Any, List

class DataService:
    @staticmethod
    def read_file(file_content: bytes, filename: str) -> pd.DataFrame:
        """
        Reads CSV or Excel file into a Pandas DataFrame.
        """
        if filename.lower().endswith('.csv'):
            return pd.read_csv(io.BytesIO(file_content))
        elif filename.lower().endswith(('.xls', '.xlsx')):
            return pd.read_excel(io.BytesIO(file_content))
        else:
            raise ValueError("Unsupported file format. Please upload CSV or Excel.")

    @staticmethod
    def get_summary(df: pd.DataFrame) -> Dict[str, Any]:
        """
        Generates a statistical summary of the dataframe.
        """
        summary = {
            "rowCount": len(df),
            "columnCount": len(df.columns),
            "columns": [],
            "preview": df.head(5).to_dict(orient='records')
        }

        for col in df.columns:
            col_data = df[col]
            col_info = {
                "name": col,
                "type": str(col_data.dtype),
                "missing": int(col_data.isnull().sum()),
                "unique": int(col_data.nunique()),
            }
            
            # Numeric stats
            if pd.api.types.is_numeric_dtype(col_data):
                col_info["stats"] = {
                    "min": float(col_data.min()) if not pd.isna(col_data.min()) else None,
                    "max": float(col_data.max()) if not pd.isna(col_data.max()) else None,
                    "mean": float(col_data.mean()) if not pd.isna(col_data.mean()) else None,
                }
            
            summary["columns"].append(col_info)
            
        return summary
    
    @staticmethod
    def detect_anomalies(df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Basic anomaly detection using Z-Score for numeric columns.
        Returns a list of potential anomalies.
        """
        anomalies = []
        numeric_cols = df.select_dtypes(include=['number']).columns
        
        for col in numeric_cols:
            col_data = df[col].dropna()
            if len(col_data) < 10:
                continue
                
            mean = col_data.mean()
            std = col_data.std()
            
            if std == 0:
                continue
                
            # Z-Score > 3
            outliers = col_data[abs((col_data - mean) / std) > 3]
            
            if not outliers.empty:
                anomalies.append({
                    "column": col,
                    "count": len(outliers),
                    "examples": outliers.head(3).tolist(),
                    "reason": "Z-Score > 3 (Statistical Outlier)"
                })
                
        return anomalies
