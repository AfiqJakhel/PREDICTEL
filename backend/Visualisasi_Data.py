"""
Visualisasi Data - Generate visualizations
Library yang digunakan:
- pandas: Untuk manipulasi data
- numpy: Untuk operasi numerik
- matplotlib: Untuk static visualizations
- seaborn: Untuk statistical visualizations
- plotly: Untuk interactive visualizations
- base64: Untuk encode image
- io: Untuk BytesIO
- json: Untuk JSON serialization
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
import plotly.graph_objects as go
import plotly.express as px
from utils import get_dataframe

def register_routes(app):
    """Register routes untuk visualisasi data"""
    
    @app.route('/api/analyze', methods=['POST'])
    def analyze_data():
        """Analisis data dengan berbagai statistik menggunakan pandas dan numpy"""
        try:
            data = request.get_json()
            filename = data.get('filename')
            
            if not filename:
                return jsonify({"error": "Filename is required"}), 400
            
            df = get_dataframe(filename, app.config['UPLOAD_FOLDER'])
            
            # Basic statistics
            stats = {
                "shape": {
                    "rows": int(df.shape[0]),
                    "columns": int(df.shape[1])
                },
                "columns": df.columns.tolist(),
                "dtypes": df.dtypes.astype(str).to_dict(),
                "missing_values": df.isnull().sum().to_dict(),
                "missing_percentage": (df.isnull().sum() / len(df) * 100).round(2).to_dict(),
                "numeric_summary": {},
                "categorical_summary": {}
            }
            
            # Numeric columns statistics
            numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            if numeric_cols:
                stats["numeric_summary"] = df[numeric_cols].describe().to_dict()
            
            # Categorical columns summary
            categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
            if categorical_cols:
                for col in categorical_cols:
                    stats["categorical_summary"][col] = {
                        "unique_count": int(df[col].nunique()),
                        "top_values": df[col].value_counts().head(5).to_dict()
                    }
            
            # Preview processed data
            df_processed = df.where(pd.notnull(df), None)
            stats["preview"] = df_processed.head(10).to_dict(orient='records')
            
            return jsonify({"message": "Data analyzed successfully", "data": stats})
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/api/visualize', methods=['POST'])
    def visualize_data():
        """Generate visualizations menggunakan matplotlib dan seaborn"""
        try:
            data = request.get_json()
            filename = data.get('filename')
            plot_type = data.get('plot_type', 'histogram')
            columns = data.get('columns', [])
            
            if not filename:
                return jsonify({"error": "Filename is required"}), 400
            
            df = get_dataframe(filename, app.config['UPLOAD_FOLDER'])
            
            # Set style
            plt.style.use('seaborn-v0_8')
            fig, ax = plt.subplots(figsize=(10, 6))
            
            if plot_type == 'histogram':
                if not columns:
                    columns = df.select_dtypes(include=[np.number]).columns.tolist()[:1]
                if columns:
                    df[columns[0]].hist(ax=ax, bins=30)
                    ax.set_title(f'Histogram of {columns[0]}')
                    ax.set_xlabel(columns[0])
                    ax.set_ylabel('Frequency')
            
            elif plot_type == 'boxplot':
                if not columns:
                    columns = df.select_dtypes(include=[np.number]).columns.tolist()[:1]
                if columns:
                    df.boxplot(column=columns[0], ax=ax)
                    ax.set_title(f'Boxplot of {columns[0]}')
            
            elif plot_type == 'correlation':
                numeric_df = df.select_dtypes(include=[np.number])
                if len(numeric_df.columns) > 0:
                    sns.heatmap(numeric_df.corr(), annot=True, fmt='.2f', ax=ax, cmap='coolwarm')
                    ax.set_title('Correlation Matrix')
            
            elif plot_type == 'scatter':
                numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
                if len(numeric_cols) >= 2:
                    ax.scatter(df[numeric_cols[0]], df[numeric_cols[1]])
                    ax.set_xlabel(numeric_cols[0])
                    ax.set_ylabel(numeric_cols[1])
                    ax.set_title(f'Scatter Plot: {numeric_cols[0]} vs {numeric_cols[1]}')
            
            # Convert plot to base64
            img_buffer = BytesIO()
            plt.savefig(img_buffer, format='png', bbox_inches='tight', dpi=100)
            img_buffer.seek(0)
            img_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
            plt.close()
            
            return jsonify({
                "message": "Visualization generated successfully",
                "data": {
                    "image": f"data:image/png;base64,{img_base64}",
                    "plot_type": plot_type
                }
            })
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/api/plotly', methods=['POST'])
    def plotly_visualize():
        """Generate interactive visualizations menggunakan Plotly"""
        try:
            data = request.get_json()
            filename = data.get('filename')
            plot_type = data.get('plot_type', 'scatter')
            columns = data.get('columns', [])
            
            if not filename:
                return jsonify({"error": "Filename is required"}), 400
            
            df = get_dataframe(filename, app.config['UPLOAD_FOLDER'])
            
            numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            
            if plot_type == 'scatter' and len(numeric_cols) >= 2:
                fig = px.scatter(df, x=numeric_cols[0], y=numeric_cols[1])
            elif plot_type == 'histogram' and numeric_cols:
                fig = px.histogram(df, x=numeric_cols[0])
            elif plot_type == 'box' and numeric_cols:
                fig = px.box(df, y=numeric_cols[0])
            elif plot_type == 'correlation' and len(numeric_cols) > 1:
                corr_matrix = df[numeric_cols].corr()
                fig = px.imshow(corr_matrix, text_auto=True, aspect="auto")
            else:
                return jsonify({"error": "Invalid plot type or insufficient columns"}), 400
            
            # Convert to JSON
            fig_json = fig.to_json()
            
            return jsonify({
                "message": "Plotly visualization generated successfully",
                "data": {
                    "plot": json.loads(fig_json),
                    "plot_type": plot_type
                }
            })
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

