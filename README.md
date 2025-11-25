# PREDICTEL - Customer Churn Prediction Application

Aplikasi web untuk analisis dan prediksi customer churn menggunakan React (Frontend) dan Python Flask dengan Pandas (Backend).

## Teknologi yang Digunakan

### Frontend
- React + Vite
- Tailwind CSS
- React Icons

### Backend
- **Python Flask** - Web framework
- **Pandas** - Data manipulation dan analisis
- **NumPy** - Numerical computing
- **Scikit-learn** - Machine learning (preprocessing, train-test split)
- **Matplotlib** - Static visualizations
- **Seaborn** - Statistical visualizations
- **Plotly** - Interactive visualizations
- **Flask-CORS** - Cross-origin resource sharing

## Cara Menjalankan Aplikasi

### 1. Install Dependencies Frontend

```bash
npm install
```

### 2. Install Dependencies Backend

```bash
cd backend
pip install -r requirements.txt
```

### 3. Jalankan Backend Python (Flask)

```bash
cd backend
python app.py
```

Backend akan berjalan di `http://localhost:5000`

### 4. Jalankan Frontend (React)

Di terminal baru:

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` (atau port yang tersedia)

## Konfigurasi

Aplikasi menggunakan **backend Python dengan Pandas** untuk membaca dan memproses file CSV. Konfigurasi ini sudah diatur di `src/hooks/useCsvUpload.js`:

```javascript
const USE_FRONTEND_ONLY = false; // Menggunakan backend Python (pandas)
```

## Fitur

### Data Management
- ✅ Upload file CSV
- ✅ Preview data dengan tabel
- ✅ Data persistence menggunakan Context API

### Data Analysis
- ✅ **Analisis Data** - Statistik deskriptif, missing values, data types
- ✅ **Preprocessing** - Handle missing values, label encoding, scaling (standard/minmax)
- ✅ **Split Data** - Train-test split dengan scikit-learn
- ✅ **Visualisasi** - Histogram, boxplot, scatter plot, correlation matrix
- ✅ **Plotly** - Interactive visualizations

### UI/UX
- ✅ Responsive design dengan Tailwind CSS
- ✅ Modern glassmorphism design

## Struktur Project

```
tb_akdat/
├── backend/
│   ├── app.py              # Flask backend dengan Pandas
│   └── requirements.txt    # Dependencies Python
├── src/
│   ├── components/         # Komponen React
│   ├── contexts/           # Context API
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Halaman aplikasi
│   └── services/           # API services
└── README.md
```

## API Endpoints

Backend menyediakan endpoint-endpoint berikut:

- `POST /api/upload` - Upload dan baca file CSV
- `POST /api/analyze` - Analisis data dengan statistik lengkap
- `POST /api/preprocess` - Preprocessing data (missing values, encoding, scaling)
- `POST /api/split` - Split data menjadi train dan test set
- `POST /api/visualize` - Generate static visualizations (matplotlib/seaborn)
- `POST /api/plotly` - Generate interactive visualizations (plotly)

## Contoh Penggunaan API

### Analisis Data
```javascript
import { analyzeData } from './services/api';

const result = await analyzeData('dataset.csv');
// Returns: statistics, missing values, data types, etc.
```

### Preprocessing
```javascript
import { preprocessData } from './services/api';

const result = await preprocessData('dataset.csv', {
  handle_missing: 'mean', // 'drop', 'mean', 'median', 'mode'
  label_encode: true,
  scale: 'standard' // 'standard', 'minmax', null
});
```

### Split Data
```javascript
import { splitData } from './services/api';

const result = await splitData('dataset.csv', {
  test_size: 0.2,
  random_state: 42,
  target_column: 'churn' // optional
});
```

### Visualisasi
```javascript
import { visualizeData, plotlyVisualize } from './services/api';

// Static plot (matplotlib)
const img = await visualizeData('dataset.csv', 'histogram', ['age']);

// Interactive plot (plotly)
const plot = await plotlyVisualize('dataset.csv', 'scatter', ['age', 'income']);
```

## Catatan

- Pastikan backend Python sudah berjalan sebelum mengupload file CSV
- Install semua dependencies dengan: `pip install -r requirements.txt`
- File yang diupload akan disimpan di folder `backend/uploads/`
- Backend menggunakan berbagai library Python untuk analisis dan visualisasi data
