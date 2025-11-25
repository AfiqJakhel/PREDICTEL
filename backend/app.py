"""
Main Application - Menggabungkan semua modul
"""
from Home import app
from Input_Data import register_routes as register_input_routes
from Preprocessing_Data import register_routes as register_preprocessing_routes
from Test_Data import register_routes as register_test_routes
from Visualisasi_Data import register_routes as register_visualization_routes
import os

# Register semua routes
register_input_routes(app)
register_preprocessing_routes(app)
register_test_routes(app)
register_visualization_routes(app)

if __name__ == '__main__':
    UPLOAD_FOLDER = 'uploads'
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True, port=5000)
