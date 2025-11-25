"""
Preprocessing Data - Preprocessing data untuk machine learning
Library yang digunakan:
- pandas: Untuk manipulasi data
- numpy: Untuk operasi numerik
- scikit-learn: Untuk preprocessing (StandardScaler, LabelEncoder, MinMaxScaler)
"""
from flask import request, jsonify
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder, MinMaxScaler
from utils import get_dataframe, clean_dict

def register_routes(app):
    """Register routes untuk preprocessing data"""
    
    @app.route('/api/preprocess', methods=['POST'])
    def preprocess_data():
        """Preprocessing data: handle missing values, encoding, scaling"""
        try:
            data = request.get_json()
            filename = data.get('filename')
            options = data.get('options', {})
            
            if not filename:
                return jsonify({"error": "Filename is required"}), 400
            
            df = get_dataframe(filename, app.config['UPLOAD_FOLDER'])
            df_processed = df.copy()
            
            # Handle missing values
            if options.get('handle_missing') == 'drop':
                df_processed = df_processed.dropna()
            elif options.get('handle_missing') == 'mean':
                numeric_cols = df_processed.select_dtypes(include=[np.number]).columns
                df_processed[numeric_cols] = df_processed[numeric_cols].fillna(df_processed[numeric_cols].mean())
            elif options.get('handle_missing') == 'median':
                numeric_cols = df_processed.select_dtypes(include=[np.number]).columns
                df_processed[numeric_cols] = df_processed[numeric_cols].fillna(df_processed[numeric_cols].median())
            elif options.get('handle_missing') == 'mode':
                for col in df_processed.columns:
                    df_processed[col] = df_processed[col].fillna(df_processed[col].mode()[0] if not df_processed[col].mode().empty else None)
            
            # Label encoding untuk categorical
            if options.get('label_encode'):
                le = LabelEncoder()
                categorical_cols = df_processed.select_dtypes(include=['object']).columns
                for col in categorical_cols:
                    df_processed[col] = le.fit_transform(df_processed[col].astype(str))
            
            # Scaling
            if options.get('scale') == 'standard':
                scaler = StandardScaler()
                numeric_cols = df_processed.select_dtypes(include=[np.number]).columns
                df_processed[numeric_cols] = scaler.fit_transform(df_processed[numeric_cols])
            elif options.get('scale') == 'minmax':
                scaler = MinMaxScaler()
                numeric_cols = df_processed.select_dtypes(include=[np.number]).columns
                df_processed[numeric_cols] = scaler.fit_transform(df_processed[numeric_cols])
            
            # Convert NaN to None for JSON
            df_processed = df_processed.where(pd.notnull(df_processed), None)
            
            result = {
                "filename": filename,
                "original_shape": {"rows": int(df.shape[0]), "columns": int(df.shape[1])},
                "processed_shape": {"rows": int(df_processed.shape[0]), "columns": int(df_processed.shape[1])},
                "columns": df_processed.columns.tolist(),
                "preview": df_processed.head(10).to_dict(orient='records')
            }
            
            return jsonify({"message": "Data preprocessed successfully", "data": result})
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/api/detect-outliers', methods=['POST'])
    def detect_outliers():
        """Deteksi outliers menggunakan IQR method"""
        try:
            data = request.get_json()
            filename = data.get('filename')
            column = data.get('column')
            
            if not filename or not column:
                return jsonify({"error": "Filename and column are required"}), 400
            
            df = get_dataframe(filename, app.config['UPLOAD_FOLDER'])
            
            if column not in df.columns:
                return jsonify({"error": f"Column {column} not found"}), 400
            
            # Check if column is numeric
            if not pd.api.types.is_numeric_dtype(df[column]):
                return jsonify({"error": f"Column {column} must be numeric for outlier detection"}), 400
            
            # IQR method
            Q1 = df[column].quantile(0.25)
            Q3 = df[column].quantile(0.75)
            IQR = Q3 - Q1
            
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outliers_df = df[(df[column] < lower_bound) | (df[column] > upper_bound)]
            
            result = {
                "column": column,
                "outliers_count": int(len(outliers_df)),
                "total_rows": int(len(df)),
                "percentage": round((len(outliers_df) / len(df)) * 100, 2),
                "bounds": {
                    "lower": float(lower_bound),
                    "upper": float(upper_bound),
                    "Q1": float(Q1),
                    "Q3": float(Q3),
                    "IQR": float(IQR)
                },
                "outliers_preview": outliers_df.head(10).to_dict(orient='records') if len(outliers_df) > 0 else []
            }
            
            # Convert NaN to None
            result = clean_dict(result)
            
            return jsonify({"message": "Outliers detected successfully", "data": result})
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/api/drop-columns', methods=['POST'])
    def drop_columns():
        """Hapus kolom dari dataframe"""
        try:
            data = request.get_json()
            filename = data.get('filename')
            columns_to_drop = data.get('columns', [])
            
            if not filename:
                return jsonify({"error": "Filename is required"}), 400
            
            if not columns_to_drop:
                return jsonify({"error": "Columns to drop are required"}), 400
            
            df = get_dataframe(filename, app.config['UPLOAD_FOLDER'])
            
            # Check if all columns exist
            missing_cols = [col for col in columns_to_drop if col not in df.columns]
            if missing_cols:
                return jsonify({"error": f"Columns not found: {', '.join(missing_cols)}"}), 400
            
            # Drop columns
            df_dropped = df.drop(columns=columns_to_drop)
            
            # Update in memory
            from utils import dataframes
            dataframes[filename] = df_dropped
            
            # Convert NaN to None
            df_dropped = df_dropped.where(pd.notnull(df_dropped), None)
            
            result = {
                "filename": filename,
                "dropped_columns": columns_to_drop,
                "original_shape": {"rows": int(df.shape[0]), "columns": int(df.shape[1])},
                "new_shape": {"rows": int(df_dropped.shape[0]), "columns": int(df_dropped.shape[1])},
                "columns": df_dropped.columns.tolist(),
                "preview": df_dropped.head(10).to_dict(orient='records')
            }
            
            return jsonify({"message": "Columns dropped successfully", "data": result})
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/api/identify-features', methods=['POST'])
    def identify_features():
        """Identifikasi fitur numeric dan categorical berdasarkan unique values"""
        try:
            data = request.get_json()
            filename = data.get('filename')
            threshold = int(data.get('threshold', 6))  # Default threshold untuk membedakan numeric/categorical
            
            if not filename:
                return jsonify({"error": "Filename is required"}), 400
            
            df = get_dataframe(filename, app.config['UPLOAD_FOLDER'])
            
            numerical_features = []
            categorical_features = []
            
            for col in df.columns:
                unique_count = df[col].nunique()
                if unique_count > threshold:
                    numerical_features.append(col)
                else:
                    categorical_features.append(col)
            
            result = {
                "filename": filename,
                "threshold": threshold,
                "numerical_features": numerical_features,
                "categorical_features": categorical_features,
                "numerical_data": df[numerical_features].head(10).to_dict(orient='records') if numerical_features else [],
                "categorical_data": df[categorical_features].head(10).to_dict(orient='records') if categorical_features else []
            }
            
            # Convert NaN to None
            result = clean_dict(result)
            
            return jsonify({"message": "Features identified successfully", "data": result})
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

