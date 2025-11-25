"""
Input Data - Upload dan membaca data CSV
Library yang digunakan:
- pandas: Untuk membaca dan memproses file CSV
- os: Untuk operasi file system
"""
from flask import request, jsonify
import pandas as pd
import os
from utils import get_dataframe, dataframes

def register_routes(app):
    """Register routes untuk input data"""
    
    @app.route('/api/upload', methods=['POST'])
    def upload_file():
        """Upload dan baca file CSV menggunakan pandas"""
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        if file and file.filename.endswith('.csv'):
            try:
                # Simpan file
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
                file.save(filepath)
                
                # Baca file CSV menggunakan pandas
                df = pd.read_csv(filepath)
                
                # Simpan ke memory
                dataframes[file.filename] = df
                
                # Konversi nilai NaN menjadi None (null) untuk JSON
                df = df.where(pd.notnull(df), None)
                
                # Buat summary data dengan preview 10 baris
                summary = {
                    "filename": file.filename,
                    "total_rows": len(df),
                    "columns": df.columns.tolist(),
                    "preview": df.head(10).to_dict(orient='records')
                }
                
                return jsonify({"message": "File processed successfully", "data": summary})
                
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        
        return jsonify({"error": "Invalid file type. Please upload a CSV file"}), 400

