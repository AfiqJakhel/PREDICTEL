"""
Test Data - Split data menjadi train dan test set, training model, dan prediction
Library yang digunakan:
- pandas: Untuk manipulasi data
- scikit-learn: Untuk train_test_split, LogisticRegression, metrics
- numpy: Untuk operasi numerik
"""
from flask import request, jsonify
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, roc_auc_score
from sklearn.preprocessing import StandardScaler
from utils import get_dataframe, clean_dict
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import base64
from io import BytesIO

# Store trained models and split data in memory
trained_models = {}
split_data_store = {}

def register_routes(app):
    """Register routes untuk split data, training, dan prediction"""
    
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
                
                # Simpan split data untuk training nanti
                split_data_store[filename] = {
                    'X_train': X_train,
                    'X_test': X_test,
                    'y_train': y_train,
                    'y_test': y_test,
                    'target_column': target_column,
                    'feature_columns': X_train.columns.tolist()
                }
                
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
    
    @app.route('/api/train-model', methods=['POST'])
    def train_model():
        """Train Logistic Regression model"""
        try:
            data = request.get_json()
            filename = data.get('filename')
            target_column = data.get('target_column')  # Optional: bisa override dari frontend
            
            if not filename:
                return jsonify({"error": "Filename is required"}), 400
            
            # Cek apakah split data sudah ada
            if filename not in split_data_store:
                # Jika belum ada split data, coba load langsung dari file dan split otomatis
                try:
                    df = get_dataframe(filename, app.config['UPLOAD_FOLDER'])
                    
                    # Coba cari target column (kolom terakhir atau yang bernama 'Churn' atau 'churn')
                    if not target_column:
                        if 'Churn' in df.columns:
                            target_column = 'Churn'
                        elif 'churn' in df.columns:
                            target_column = 'churn'
                        else:
                            # Ambil kolom terakhir sebagai target
                            target_column = df.columns[-1]
                    
                    if target_column not in df.columns:
                        return jsonify({
                            "error": f"Target column '{target_column}' tidak ditemukan. Kolom yang tersedia: {', '.join(df.columns.tolist())}"
                        }), 400
                    
                    # Split data otomatis
                    X = df.drop(columns=[target_column])
                    y = df[target_column]
                    X_train, X_test, y_train, y_test = train_test_split(
                        X, y, test_size=0.2, random_state=42
                    )
                    
                    # Simpan split data
                    split_data_store[filename] = {
                        'X_train': X_train,
                        'X_test': X_test,
                        'y_train': y_train,
                        'y_test': y_test,
                        'target_column': target_column,
                        'feature_columns': X_train.columns.tolist()
                    }
                except Exception as e:
                    return jsonify({
                        "error": f"Data belum di-split dan tidak bisa melakukan split otomatis. Silakan lakukan split data terlebih dahulu di halaman Processing Data. Error: {str(e)}"
                    }), 400
            
            split_data = split_data_store[filename]
            X_train = split_data['X_train']
            X_test = split_data['X_test']
            y_train = split_data['y_train']
            y_test = split_data['y_test']
            
            # Validasi data
            if X_train.empty or y_train.empty:
                return jsonify({"error": "Training data kosong. Silakan pastikan data sudah di-preprocessing dengan benar."}), 400
            
            # Validasi target column untuk classification
            # Logistic Regression memerlukan target yang discrete (kategorikal), bukan continuous
            unique_values = y_train.nunique()
            total_values = len(y_train)
            unique_ratio = unique_values / total_values if total_values > 0 else 0
            
            # Cek apakah target memiliki nilai continuous (desimal)
            if pd.api.types.is_numeric_dtype(y_train):
                # Cek apakah ada nilai desimal (bukan integer)
                has_decimal = (y_train % 1 != 0).any()
                if has_decimal:
                    sample_values = y_train.head(10).tolist()
                    return jsonify({
                        "error": f"Target column '{split_data['target_column']}' memiliki nilai desimal/kontinyu (contoh: {sample_values[:3]}). Ini menunjukkan target column mungkin ikut di-scale.\n\n"
                        f"Solusi:\n"
                        f"1. Target column TIDAK boleh di-scale. Hanya feature columns yang di-scale.\n"
                        f"2. Kembali ke Preprocessing dan pastikan target column tidak ikut di-scale\n"
                        f"3. Atau pilih target column yang berbeda yang bersifat kategorikal/discrete\n"
                        f"4. Target harus berupa integer (0, 1, 2, ...) bukan desimal (0.5, 1.2, ...)"
                    }), 400
            
            # Jika unique values terlalu banyak (lebih dari 10 atau ratio > 0.5), kemungkinan continuous
            if unique_values > 10 or unique_ratio > 0.5:
                # Cek apakah semua nilai adalah numerik dan terdistribusi continuous
                if pd.api.types.is_numeric_dtype(y_train):
                    sample_values = y_train.head(20).tolist()
                    return jsonify({
                        "error": f"Target column '{split_data['target_column']}' memiliki terlalu banyak nilai unik ({unique_values} dari {total_values} data). Logistic Regression hanya untuk classification (prediksi kelas/kategori), bukan untuk regression (prediksi nilai kontinyu).\n\n"
                        f"Solusi:\n"
                        f"1. Pilih kolom target yang bersifat kategorikal dengan sedikit kategori (maksimal 10)\n"
                        f"2. Contoh: kolom dengan nilai Yes/No, 0/1, atau beberapa kategori terbatas\n"
                        f"3. JANGAN pilih kolom numerik kontinyu seperti TotalCharges, MonthlyCharges\n"
                        f"4. Jika perlu, buat kolom baru dengan binning/grouping"
                    }), 400
            
            # Pastikan target sudah numerik atau bisa di-convert
            # Jika target masih object/string, coba convert
            if not pd.api.types.is_numeric_dtype(y_train):
                try:
                    # Coba convert ke numerik
                    y_train = pd.to_numeric(y_train, errors='coerce')
                    y_test = pd.to_numeric(y_test, errors='coerce')
                    # Jika masih ada NaN setelah convert, berarti ada masalah
                    if y_train.isna().any() or y_test.isna().any():
                        return jsonify({
                            "error": f"Target column '{split_data['target_column']}' tidak bisa diubah menjadi numerik. Pastikan kolom target sudah di-label encode atau berisi nilai numerik."
                        }), 400
                except:
                    return jsonify({
                        "error": f"Target column '{split_data['target_column']}' harus berupa numerik untuk Logistic Regression. Pastikan sudah melakukan Label Encoding pada kolom target."
                    }), 400
            
            # Pastikan target adalah integer/discrete (bukan continuous)
            # Jika target memiliki nilai desimal, kemungkinan ikut di-scale
            # Convert kembali ke integer dengan mapping ke unique values
            if pd.api.types.is_numeric_dtype(y_train):
                # Cek apakah ada nilai desimal
                has_decimal = (y_train % 1 != 0).any()
                if has_decimal:
                    # Target kemungkinan ikut di-scale, perlu di-convert kembali ke discrete
                    # Gunakan unique values dan mapping ke integer 0, 1, 2, ...
                    unique_vals = sorted(y_train.unique())
                    mapping = {val: idx for idx, val in enumerate(unique_vals)}
                    y_train = y_train.map(mapping).astype(int)
                    y_test = y_test.map(mapping).astype(int)
            
            # Pastikan target adalah integer
            y_train = y_train.astype(int)
            y_test = y_test.astype(int)
            
            # Validasi ulang setelah conversion
            unique_values_after = y_train.nunique()
            if unique_values_after > 10:
                unique_list = sorted(y_train.unique())[:20]
                return jsonify({
                    "error": f"Target column '{split_data['target_column']}' masih memiliki terlalu banyak nilai unik ({unique_values_after} nilai berbeda).\n\n"
                    f"Contoh nilai yang ditemukan: {unique_list}\n\n"
                    f"Logistic Regression memerlukan target dengan maksimal 10 kategori.\n\n"
                    f"Solusi:\n"
                    f"1. Pilih kolom target yang benar-benar kategorikal dengan sedikit kategori (2-10 kategori)\n"
                    f"2. Contoh kolom yang cocok: Churn (Yes/No), Status (Aktif/Non-Aktif), dll\n"
                    f"3. JANGAN pilih kolom numerik kontinyu atau kolom dengan banyak nilai berbeda"
                }), 400
            
            # Update split data dengan y yang sudah di-convert
            split_data['y_train'] = y_train
            split_data['y_test'] = y_test
            
            # Scale data untuk membantu konvergensi
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Simpan scaler untuk prediction nanti
            split_data['scaler'] = scaler
            
            # Training model dengan max_iter yang lebih tinggi dan solver yang lebih robust
            try:
                # Gunakan solver 'liblinear' untuk dataset kecil/medium, atau 'lbfgs' dengan max_iter lebih tinggi
                # 'liblinear' lebih cepat dan robust untuk binary classification
                solver = 'liblinear' if len(X_train) < 10000 else 'lbfgs'
                max_iterations = 5000 if solver == 'lbfgs' else 1000
                
                model = LogisticRegression(
                    max_iter=max_iterations, 
                    random_state=42,
                    solver=solver,
                    n_jobs=-1 if solver == 'lbfgs' else 1  # Parallel processing untuk lbfgs
                )
                model.fit(X_train_scaled, y_train)
            except ValueError as ve:
                # Tangkap error dari scikit-learn tentang continuous target
                if "continuous" in str(ve).lower() or "Unknown label type" in str(ve):
                    return jsonify({
                        "error": f"Target column '{split_data['target_column']}' tidak cocok untuk classification.\n\n"
                        f"Error: {str(ve)}\n\n"
                        f"Solusi:\n"
                        f"1. Pastikan target column adalah kategorikal dengan 2-10 kategori\n"
                        f"2. Nilai target harus discrete (integer), bukan continuous (desimal)\n"
                        f"3. Pilih kolom seperti: Churn, Status, atau kolom Yes/No\n"
                        f"4. JANGAN pilih kolom numerik kontinyu seperti TotalCharges, MonthlyCharges"
                    }), 400
                else:
                    raise
            
            # Prediksi data test (gunakan scaled data)
            y_pred = model.predict(X_test_scaled)
            y_prob = None
            try:
                y_prob = model.predict_proba(X_test_scaled)[:, 1] if len(model.classes_) > 1 else None
            except:
                pass
            
            # Hitung metrics
            accuracy = float(accuracy_score(y_test, y_pred))
            
            # Confusion matrix
            cm = confusion_matrix(y_test, y_pred).tolist()
            
            # ROC AUC Score (jika binary classification)
            roc_auc = None
            if y_prob is not None and len(model.classes_) == 2:
                try:
                    roc_auc = float(roc_auc_score(y_test, y_prob))
                except:
                    pass
            
            # Classification report
            report = classification_report(y_test, y_pred, output_dict=True)
            
            # Simpan model dan scaler
            trained_models[filename] = {
                'model': model,
                'scaler': scaler,
                'feature_columns': split_data['feature_columns'],
                'target_column': split_data['target_column']
            }
            
            # Generate confusion matrix visualization
            cm_image = None
            try:
                fig, ax = plt.subplots(figsize=(8, 6))
                sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax, 
                           cbar_kws={'label': 'Count'}, linewidths=0.5, linecolor='gray')
                ax.set_xlabel('Predicted', fontsize=12, fontweight='bold')
                ax.set_ylabel('Actual', fontsize=12, fontweight='bold')
                ax.set_title('Confusion Matrix', fontsize=14, fontweight='bold', pad=20)
                
                # Set labels for classes
                class_labels = [str(int(c)) for c in model.classes_]
                ax.set_xticklabels(class_labels, rotation=0)
                ax.set_yticklabels(class_labels, rotation=0)
                
                plt.tight_layout()
                
                # Convert to base64
                img_buffer = BytesIO()
                plt.savefig(img_buffer, format='png', bbox_inches='tight', dpi=100, facecolor='white')
                img_buffer.seek(0)
                img_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
                cm_image = f"data:image/png;base64,{img_base64}"
                plt.close()
                plt.clf()
            except Exception as e:
                print(f"Error generating confusion matrix visualization: {e}")
                # Continue without visualization
            
            result = {
                "accuracy": accuracy,
                "roc_auc": roc_auc,
                "confusion_matrix": cm,
                "confusion_matrix_image": cm_image,
                "classification_report": clean_dict(report),
                "algorithm": "Logistic Regression"
            }
            
            return jsonify({"message": "Model trained successfully", "data": result})
            
        except Exception as e:
            import traceback
            error_msg = str(e)
            # Jangan tampilkan traceback penuh ke user, hanya error message utama
            return jsonify({
                "error": f"Error training model: {error_msg}. Pastikan data sudah di-preprocessing dan di-split dengan benar."
            }), 500
    
    @app.route('/api/predict', methods=['POST'])
    def predict():
        """Predict menggunakan model yang sudah dilatih"""
        try:
            data = request.get_json()
            filename = data.get('filename')
            input_data = data.get('input_data')  # Dictionary dengan key-value pairs
            
            if not filename:
                return jsonify({"error": "Filename is required"}), 400
            
            if filename not in trained_models:
                return jsonify({"error": "Model belum dilatih. Silakan latih model terlebih dahulu."}), 400
            
            model_info = trained_models[filename]
            model = model_info['model']
            scaler = model_info.get('scaler', None)
            feature_columns = model_info['feature_columns']
            
            # Buat DataFrame dari input data
            input_df = pd.DataFrame([input_data])
            
            # Pastikan semua kolom ada
            for col in feature_columns:
                if col not in input_df.columns:
                    input_df[col] = 0  # Default value untuk kolom yang tidak ada
            
            # Urutkan kolom sesuai dengan training data
            input_df = input_df[feature_columns]
            
            # Scale data jika scaler tersedia (untuk konsistensi dengan training)
            if scaler:
                input_scaled = scaler.transform(input_df)
            else:
                input_scaled = input_df.values
            
            # Prediksi
            prediction = model.predict(input_scaled)[0]
            probabilities = model.predict_proba(input_scaled)[0]
            
            # Konversi ke native Python types
            prediction = int(prediction) if isinstance(prediction, (np.integer, np.floating)) else prediction
            probabilities = [float(p) for p in probabilities]
            
            result = {
                "prediction": prediction,
                "probabilities": probabilities,
                "classes": [int(c) if isinstance(c, (np.integer, np.floating)) else c for c in model.classes_.tolist()]
            }
            
            return jsonify({"message": "Prediction successful", "data": result})
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

