"""
Test Data - Split data menjadi train dan test set
Library yang digunakan:
- pandas: Untuk manipulasi data
- scikit-learn: Untuk train_test_split
"""
from flask import request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from utils import get_dataframe, clean_dict

def register_routes(app):
    """Register routes untuk split data"""
    
    @app.route('/api/split', methods=['POST'])
    def split_data():
        """Split data menjadi train dan test set menggunakan scikit-learn"""
        try:
            data = request.get_json()
            filename = data.get('filename')
            test_size = float(data.get('test_size', 0.2))
            random_state = int(data.get('random_state', 42))
            target_column = data.get('target_column')
            
            if not filename:
                return jsonify({"error": "Filename is required"}), 400
            
            df = get_dataframe(filename, app.config['UPLOAD_FOLDER'])
            
            # Jika ada target column, split dengan target
            if target_column and target_column in df.columns:
                X = df.drop(columns=[target_column])
                y = df[target_column]
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y, test_size=test_size, random_state=random_state
                )
                
                result = {
                    "train": {
                        "X_shape": {"rows": int(X_train.shape[0]), "columns": int(X_train.shape[1])},
                        "y_shape": {"rows": int(y_train.shape[0])},
                        "X_preview": X_train.head(5).to_dict(orient='records'),
                        "y_preview": y_train.head(5).tolist()
                    },
                    "test": {
                        "X_shape": {"rows": int(X_test.shape[0]), "columns": int(X_test.shape[1])},
                        "y_shape": {"rows": int(y_test.shape[0])},
                        "X_preview": X_test.head(5).to_dict(orient='records'),
                        "y_preview": y_test.head(5).tolist()
                    },
                    "split_ratio": {
                        "train": round(1 - test_size, 2),
                        "test": round(test_size, 2)
                    }
                }
            else:
                # Split tanpa target (hanya X)
                train_df, test_df = train_test_split(
                    df, test_size=test_size, random_state=random_state
                )
                
                result = {
                    "train": {
                        "shape": {"rows": int(train_df.shape[0]), "columns": int(train_df.shape[1])},
                        "preview": train_df.head(5).to_dict(orient='records')
                    },
                    "test": {
                        "shape": {"rows": int(test_df.shape[0]), "columns": int(test_df.shape[1])},
                        "preview": test_df.head(5).to_dict(orient='records')
                    },
                    "split_ratio": {
                        "train": round(1 - test_size, 2),
                        "test": round(test_size, 2)
                    }
                }
            
            # Convert NaN to None
            result = clean_dict(result)
            
            return jsonify({"message": "Data split successfully", "data": result})
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

