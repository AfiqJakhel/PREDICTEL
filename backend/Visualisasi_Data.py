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
            hue_column = data.get('hue_column', None)
            
            if not filename:
                return jsonify({"error": "Filename is required"}), 400
            
            df = get_dataframe(filename, app.config['UPLOAD_FOLDER'])
            
            # Set style
            sns.set_style("whitegrid")
            plt.rcParams['figure.figsize'] = (10, 6)
            
            if plot_type == 'histogram':
                if not columns:
                    columns = df.select_dtypes(include=[np.number]).columns.tolist()[:1]
                if columns:
                    fig, ax = plt.subplots(figsize=(10, 6))
                    df[columns[0]].hist(ax=ax, bins=30)
                    ax.set_title(f'Histogram of {columns[0]}')
                    ax.set_xlabel(columns[0])
                    ax.set_ylabel('Frequency')
            
            elif plot_type == 'boxplot':
                if not columns:
                    columns = df.select_dtypes(include=[np.number]).columns.tolist()[:1]
                if columns:
                    fig, ax = plt.subplots(figsize=(10, 6))
                    df.boxplot(column=columns[0], ax=ax)
                    ax.set_title(f'Boxplot of {columns[0]}')
            
            elif plot_type == 'correlation':
                numeric_df = df.select_dtypes(include=[np.number])
                if len(numeric_df.columns) > 0:
                    fig, ax = plt.subplots(figsize=(10, 8))
                    sns.heatmap(numeric_df.corr(), annot=True, fmt='.2f', ax=ax, cmap='coolwarm')
                    ax.set_title('Correlation Matrix')
            
            elif plot_type == 'scatter':
                if len(columns) >= 2:
                    fig, ax = plt.subplots(figsize=(10, 6))
                    x_col, y_col = columns[0], columns[1]
                    if hue_column and hue_column in df.columns:
                        sns.scatterplot(data=df, x=x_col, y=y_col, hue=hue_column, ax=ax, alpha=0.7)
                    else:
                        ax.scatter(df[x_col], df[y_col], alpha=0.7)
                    ax.set_xlabel(x_col)
                    ax.set_ylabel(y_col)
                    ax.set_title(f'Scatter Plot: {x_col} vs {y_col}')
                    if hue_column:
                        ax.legend(title=hue_column)
                else:
                    return jsonify({"error": "Scatter plot requires at least 2 columns"}), 400
            
            elif plot_type == 'bar':
                if len(columns) >= 2:
                    fig, ax = plt.subplots(figsize=(10, 6))
                    x_col, y_col = columns[0], columns[1]
                    
                    # Optimize: Aggregasi data langsung tanpa sampling untuk performa lebih cepat
                    # Bar chart selalu perlu aggregation untuk performa optimal
                    if hue_column and hue_column in df.columns:
                        # Group by x_col dan hue_column, hitung mean y_col
                        plot_df = df.groupby([x_col, hue_column])[y_col].mean().reset_index()
                        # Batasi jumlah unique values di x_col untuk performa (maksimal 20)
                        if plot_df[x_col].nunique() > 20:
                            # Ambil top 20 berdasarkan frekuensi
                            top_x = df[x_col].value_counts().head(20).index
                            plot_df = plot_df[plot_df[x_col].isin(top_x)]
                    else:
                        # Group by x_col saja, hitung mean y_col
                        plot_df = df.groupby(x_col)[y_col].mean().reset_index()
                        # Batasi jumlah unique values untuk performa (maksimal 30)
                        if len(plot_df) > 30:
                            # Ambil top 30 berdasarkan frekuensi
                            top_x = df[x_col].value_counts().head(30).index
                            plot_df = plot_df[plot_df[x_col].isin(top_x)]
                    
                    # Sort untuk visualisasi yang lebih rapi
                    if hue_column and hue_column in plot_df.columns:
                        plot_df = plot_df.sort_values([x_col, hue_column])
                    else:
                        plot_df = plot_df.sort_values(x_col)
                    
                    # Gunakan seaborn dengan data yang sudah di-aggregate (lebih cepat)
                    if hue_column and hue_column in plot_df.columns:
                        sns.barplot(data=plot_df, x=x_col, y=y_col, hue=hue_column, ax=ax, errorbar=None, palette='Set2')
                    else:
                        sns.barplot(data=plot_df, x=x_col, y=y_col, ax=ax, errorbar=None, color='steelblue')
                    
                    ax.set_xlabel(x_col, fontsize=10)
                    ax.set_ylabel(y_col, fontsize=10)
                    ax.set_title(f'Bar Chart: {y_col} vs {x_col}', fontsize=12, fontweight='bold')
                    if hue_column:
                        ax.legend(title=hue_column, fontsize=9)
                    # Rotate x-axis labels untuk readability
                    if plot_df[x_col].nunique() > 5:
                        plt.xticks(rotation=45, ha='right', fontsize=8)
                    else:
                        plt.xticks(rotation=0, fontsize=9)
                else:
                    return jsonify({"error": "Bar chart requires at least 2 columns"}), 400
            
            elif plot_type == 'line':
                if len(columns) >= 2:
                    fig, ax = plt.subplots(figsize=(10, 6))
                    x_col, y_col = columns[0], columns[1]
                    
                    # Optimize: Sample data if too large (>10000 rows)
                    plot_df = df.copy()
                    if len(plot_df) > 10000:
                        plot_df = plot_df.sample(n=10000, random_state=42).sort_values(by=x_col)
                    
                    # For line chart, if x_col has too many unique values, aggregate
                    if plot_df[x_col].nunique() > 100:
                        # Group by x_col and calculate mean of y_col
                        if hue_column and hue_column in plot_df.columns:
                            plot_df = plot_df.groupby([x_col, hue_column])[y_col].mean().reset_index()
                        else:
                            plot_df = plot_df.groupby(x_col)[y_col].mean().reset_index()
                        plot_df = plot_df.sort_values(by=x_col)
                    
                    if hue_column and hue_column in plot_df.columns:
                        sns.lineplot(data=plot_df, x=x_col, y=y_col, hue=hue_column, ax=ax, marker='o', markersize=3)
                    else:
                        sns.lineplot(data=plot_df, x=x_col, y=y_col, ax=ax, marker='o', markersize=3)
                    ax.set_xlabel(x_col)
                    ax.set_ylabel(y_col)
                    ax.set_title(f'Line Chart: {x_col} vs {y_col}')
                    if hue_column:
                        ax.legend(title=hue_column)
                    # Rotate x-axis labels if too many
                    if plot_df[x_col].nunique() > 20:
                        plt.xticks(rotation=45, ha='right')
                else:
                    return jsonify({"error": "Line chart requires at least 2 columns"}), 400
            
            elif plot_type == 'countplot':
                # For categorical visualization
                if not columns:
                    return jsonify({"error": "Countplot requires at least one categorical column"}), 400
                
                n_cols = min(2, len(columns))
                n_rows = (len(columns) + n_cols - 1) // n_cols
                fig, axes = plt.subplots(n_rows, n_cols, figsize=(15, 5*n_rows))
                
                if n_rows == 1 and n_cols == 1:
                    axes = [axes]
                elif n_rows == 1:
                    axes = list(axes)
                else:
                    axes = axes.ravel()
                
                # Detect target column for hue
                possible_targets = ['Churn', 'churn', 'HeartDisease', 'heart_disease', 'target', 'Target']
                target_col = None
                for t in possible_targets:
                    if t in df.columns:
                        target_col = t
                        break
                
                colors = ['#0343DF', '#75BB4F']
                
                for idx, col in enumerate(columns):
                    if col not in df.columns:
                        continue
                    
                    if target_col and target_col in df.columns:
                        # Map target values if needed
                        plot_df = df.copy()
                        if df[target_col].dtype == 'int64' or df[target_col].dtype == 'float64':
                            plot_df[target_col] = plot_df[target_col].map({0: 'No', 1: 'Yes'})
                        
                        sns.countplot(data=plot_df, x=col, hue=target_col, palette=colors, 
                                    edgecolor='black', ax=axes[idx])
                    else:
                        sns.countplot(data=df, x=col, edgecolor='black', ax=axes[idx])
                    
                    axes[idx].set_title(f'{col}')
                    axes[idx].tick_params(axis='x', rotation=45)
                    
                    # Add labels on bars
                    for container in axes[idx].containers:
                        axes[idx].bar_label(container)
                
                # Remove unused subplots
                for idx in range(len(columns), len(axes)):
                    fig.delaxes(axes[idx])
                
                plt.tight_layout()
            
            elif plot_type == 'boxplot_multi':
                # For numeric vs categorical
                if len(columns) < 2:
                    return jsonify({"error": "Boxplot requires categorical and numeric columns"}), 400
                
                cat_col = columns[0]
                num_cols = columns[1:]
                n_cols = len(num_cols)
                
                fig, axes = plt.subplots(nrows=1, ncols=n_cols, figsize=(5*n_cols, 5))
                if n_cols == 1:
                    axes = [axes]
                
                colors = ['#0343DF', '#75BB4F']
                
                for i, num_col in enumerate(num_cols):
                    if num_col not in df.columns or cat_col not in df.columns:
                        continue
                    
                    # Detect target for hue
                    possible_targets = ['Churn', 'churn', 'HeartDisease', 'heart_disease', 'target', 'Target']
                    target_col = None
                    for t in possible_targets:
                        if t in df.columns:
                            target_col = t
                            break
                    
                    if target_col and target_col in df.columns:
                        plot_df = df.copy()
                        if df[target_col].dtype == 'int64' or df[target_col].dtype == 'float64':
                            plot_df[target_col] = plot_df[target_col].map({0: 'No', 1: 'Yes'})
                        sns.stripplot(data=plot_df, x=cat_col, y=num_col, hue=target_col, 
                                     palette=colors, ax=axes[i])
                        axes[i].legend(title=target_col)
                    else:
                        sns.boxplot(data=df, x=cat_col, y=num_col, ax=axes[i])
                    
                    axes[i].set_title(f'{num_col} vs {cat_col}')
                    axes[i].tick_params(axis='x', rotation=45)
                
                plt.tight_layout()
            
            else:
                return jsonify({"error": f"Unknown plot type: {plot_type}"}), 400
            
            # Convert plot to base64 with optimized settings
            img_buffer = BytesIO()
            # Reduce DPI lebih agresif untuk bar chart dan line chart (60 untuk performa lebih cepat)
            dpi_value = 60 if plot_type in ['bar', 'line'] else 75
            plt.savefig(img_buffer, format='png', bbox_inches='tight', dpi=dpi_value, facecolor='white')
            img_buffer.seek(0)
            img_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
            plt.close('all')  # Close all figures untuk free memory
            # Clear figure to free memory
            plt.clf()
            # Force garbage collection untuk bar chart yang berat
            if plot_type in ['bar', 'line']:
                import gc
                gc.collect()
            
            return jsonify({
                "message": "Visualization generated successfully",
                "data": {
                    "image": f"data:image/png;base64,{img_base64}",
                    "plot_type": plot_type
                }
            })
            
        except Exception as e:
            import traceback
            return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500
    
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

