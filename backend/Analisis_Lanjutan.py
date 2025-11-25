"""
Analisis Lanjutan - Clustering, Classification, Association Rules
Library yang digunakan:
- pandas: Untuk manipulasi data
- numpy: Untuk operasi numerik
- scikit-learn: Untuk clustering dan classification
- mlxtend: Untuk association rules (apriori)
- base64: Untuk encode image
- io: Untuk BytesIO
"""
from flask import request, jsonify
import pandas as pd
import numpy as np
import json
import base64
from io import BytesIO
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from utils import get_dataframe, clean_dict

def register_routes(app):
    """Register routes untuk analisis lanjutan"""
    
    @app.route('/api/clustering', methods=['POST'])
    def perform_clustering():
        """Melakukan clustering menggunakan K-Means atau DBSCAN"""
        try:
            data = request.get_json()
            filename = data.get('filename')
            method = data.get('method', 'kmeans')  # 'kmeans' or 'dbscan'
            n_clusters = data.get('n_clusters', 3)
            columns = data.get('columns', [])
            
            if not filename:
                return jsonify({"error": "Filename is required"}), 400
            
            df = get_dataframe(filename, app.config['UPLOAD_FOLDER'])
            
            # Pilih kolom untuk clustering
            if not columns:
                # Auto-select numeric columns
                numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
                if len(numeric_cols) < 2:
                    return jsonify({"error": "Minimal 2 kolom numerik diperlukan untuk clustering"}), 400
                columns = numeric_cols[:5]  # Maksimal 5 kolom
            
            # Validasi kolom
            for col in columns:
                if col not in df.columns:
                    return jsonify({"error": f"Kolom {col} tidak ditemukan"}), 400
                if not pd.api.types.is_numeric_dtype(df[col]):
                    return jsonify({"error": f"Kolom {col} harus numerik"}), 400
            
            # Prepare data
            X = df[columns].dropna()
            
            if len(X) < n_clusters:
                return jsonify({"error": f"Data terlalu sedikit untuk {n_clusters} cluster"}), 400
            
            # Normalisasi data
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            
            # Perform clustering
            if method == 'kmeans':
                if n_clusters > len(X):
                    n_clusters = len(X)
                model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
                labels = model.fit_predict(X_scaled)
                centers = scaler.inverse_transform(model.cluster_centers_)
                
                # Calculate silhouette score
                silhouette = silhouette_score(X_scaled, labels) if len(np.unique(labels)) > 1 else 0
                
                result = {
                    "method": "K-Means",
                    "n_clusters": int(n_clusters),
                    "silhouette_score": float(silhouette),
                    "inertia": float(model.inertia_),
                    "cluster_labels": labels.tolist(),
                    "cluster_centers": centers.tolist(),
                    "cluster_counts": {int(i): int(np.sum(labels == i)) for i in range(n_clusters)},
                    "columns_used": columns
                }
                
            elif method == 'dbscan':
                eps = data.get('eps', 0.5)
                min_samples = data.get('min_samples', 5)
                
                model = DBSCAN(eps=eps, min_samples=min_samples)
                labels = model.fit_predict(X_scaled)
                
                n_clusters_found = len(set(labels)) - (1 if -1 in labels else 0)
                n_noise = int(np.sum(labels == -1))
                
                # Calculate silhouette score (skip noise points)
                if n_clusters_found > 1:
                    mask = labels != -1
                    if np.sum(mask) > 1:
                        silhouette = silhouette_score(X_scaled[mask], labels[mask])
                    else:
                        silhouette = -1
                else:
                    silhouette = -1
                
                result = {
                    "method": "DBSCAN",
                    "n_clusters_found": int(n_clusters_found),
                    "n_noise": int(n_noise),
                    "silhouette_score": float(silhouette) if silhouette != -1 else None,
                    "eps": float(eps),
                    "min_samples": int(min_samples),
                    "cluster_labels": labels.tolist(),
                    "cluster_counts": {int(i): int(np.sum(labels == i)) for i in set(labels)},
                    "columns_used": columns
                }
            else:
                return jsonify({"error": f"Method {method} tidak didukung. Gunakan 'kmeans' atau 'dbscan'"}), 400
            
            # Add cluster labels to original dataframe
            df_with_clusters = df.copy()
            df_with_clusters['Cluster'] = -1
            df_with_clusters.loc[X.index, 'Cluster'] = labels
            
            # Generate visualization
            if len(columns) >= 2:
                fig, axes = plt.subplots(1, 2, figsize=(15, 6))
                
                # Scatter plot
                if method == 'kmeans':
                    scatter = axes[0].scatter(X[columns[0]], X[columns[1]], c=labels, cmap='viridis', alpha=0.6)
                    axes[0].scatter(centers[:, 0], centers[:, 1], c='red', marker='x', s=200, linewidths=3, label='Centroids')
                    axes[0].legend()
                else:
                    scatter = axes[0].scatter(X[columns[0]], X[columns[1]], c=labels, cmap='viridis', alpha=0.6)
                
                axes[0].set_xlabel(columns[0])
                axes[0].set_ylabel(columns[1])
                axes[0].set_title(f'{result["method"]} Clustering')
                plt.colorbar(scatter, ax=axes[0])
                
                # Cluster distribution
                cluster_counts = result.get('cluster_counts', {})
                axes[1].bar(cluster_counts.keys(), cluster_counts.values(), color='skyblue', edgecolor='black')
                axes[1].set_xlabel('Cluster')
                axes[1].set_ylabel('Jumlah Data')
                axes[1].set_title('Distribusi Cluster')
                axes[1].grid(axis='y', alpha=0.3)
                
                plt.tight_layout()
                
                # Convert to base64
                img_buffer = BytesIO()
                plt.savefig(img_buffer, format='png', bbox_inches='tight', dpi=100)
                img_buffer.seek(0)
                img_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
                plt.close()
                
                result["visualization"] = f"data:image/png;base64,{img_base64}"
            
            # Preview data with clusters
            preview_df = df_with_clusters[columns + ['Cluster']].head(20)
            result["preview"] = preview_df.where(pd.notnull(preview_df), None).to_dict(orient='records')
            
            return jsonify({
                "message": f"Clustering {result['method']} berhasil",
                "data": clean_dict(result)
            })
            
        except Exception as e:
            import traceback
            return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500
    
    @app.route('/api/association-rules', methods=['POST'])
    def perform_association_rules():
        """Melakukan analisis Association Rules menggunakan Apriori algorithm"""
        try:
            data = request.get_json()
            filename = data.get('filename')
            min_support = data.get('min_support', 0.1)
            min_confidence = data.get('min_confidence', 0.5)
            categorical_columns = data.get('columns', [])
            
            if not filename:
                return jsonify({"error": "Filename is required"}), 400
            
            if min_support <= 0 or min_support >= 1:
                return jsonify({"error": "min_support harus antara 0 dan 1"}), 400
            
            if min_confidence <= 0 or min_confidence >= 1:
                return jsonify({"error": "min_confidence harus antara 0 dan 1"}), 400
            
            df = get_dataframe(filename, app.config['UPLOAD_FOLDER'])
            
            # Pilih kolom kategorikal
            if not categorical_columns:
                categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
                if len(categorical_cols) == 0:
                    # Jika tidak ada kolom object, coba kolom dengan sedikit nilai unik
                    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
                    categorical_cols = [col for col in numeric_cols if df[col].nunique() <= 10]
                    if len(categorical_cols) == 0:
                        return jsonify({"error": "Tidak ada kolom kategorikal yang cocok untuk association rules"}), 400
                categorical_columns = categorical_cols[:5]  # Maksimal 5 kolom
            
            # Validasi kolom
            for col in categorical_columns:
                if col not in df.columns:
                    return jsonify({"error": f"Kolom {col} tidak ditemukan"}), 400
            
            # Prepare data untuk apriori (binerisasi)
            df_subset = df[categorical_columns].copy()
            
            # Binerisasi: setiap nilai menjadi kolom terpisah
            encoded_df = pd.get_dummies(df_subset)
            
            if len(encoded_df.columns) == 0:
                return jsonify({"error": "Tidak ada data untuk dianalisis"}), 400
            
            # Hitung support untuk setiap itemset
            support = encoded_df.mean()
            
            # Filter berdasarkan min_support
            frequent_items = support[support >= min_support]
            
            if len(frequent_items) == 0:
                return jsonify({
                    "message": "Tidak ada itemset yang memenuhi min_support",
                    "data": {
                        "rules": [],
                        "frequent_itemsets": [],
                        "total_itemsets": len(support),
                        "frequent_count": 0
                    }
                })
            
            # Generate rules (simplified version)
            rules = []
            frequent_itemsets = []
            
            for item in frequent_items.index:
                item_support = float(frequent_items[item])
                frequent_itemsets.append({
                    "itemset": [item],
                    "support": item_support,
                    "count": int(item_support * len(encoded_df))
                })
                
                # Generate rules untuk item ini (dengan item lain)
                for other_item in frequent_items.index:
                    if item != other_item:
                        # Calculate confidence: P(other_item | item)
                        item_and_other = (encoded_df[item] & encoded_df[other_item]).sum() / len(encoded_df)
                        if item_support > 0:
                            confidence = item_and_other / item_support
                            if confidence >= min_confidence:
                                other_support = float(frequent_items[other_item])
                                lift = confidence / other_support if other_support > 0 else 0
                                
                                rules.append({
                                    "antecedent": item,
                                    "consequent": other_item,
                                    "support": float(item_and_other),
                                    "confidence": float(confidence),
                                    "lift": float(lift)
                                })
            
            # Sort rules by confidence
            rules.sort(key=lambda x: x['confidence'], reverse=True)
            
            result = {
                "total_itemsets": len(support),
                "frequent_itemsets_count": len(frequent_items),
                "rules_count": len(rules),
                "min_support": float(min_support),
                "min_confidence": float(min_confidence),
                "columns_used": categorical_columns,
                "top_frequent_itemsets": frequent_itemsets[:10],
                "top_rules": rules[:20]  # Top 20 rules
            }
            
            return jsonify({
                "message": "Association rules analysis berhasil",
                "data": clean_dict(result)
            })
            
        except Exception as e:
            import traceback
            return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500

