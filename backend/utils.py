"""
Utility functions untuk semua modul
"""
import pandas as pd
import os

# Store loaded dataframes in memory (simple approach)
dataframes = {}

def get_dataframe(filename, upload_folder):
    """Get or load dataframe from memory"""
    if filename not in dataframes:
        filepath = os.path.join(upload_folder, filename)
        if os.path.exists(filepath):
            dataframes[filename] = pd.read_csv(filepath)
        else:
            raise FileNotFoundError(f"File {filename} not found")
    return dataframes[filename].copy()

def clean_dict(d):
    """Convert pandas NaN to None for JSON serialization"""
    if isinstance(d, dict):
        return {k: clean_dict(v) for k, v in d.items()}
    elif isinstance(d, list):
        return [clean_dict(item) for item in d]
    elif pd.isna(d):
        return None
    return d

