# DataFlow Studio

> **An end-to-end AI-powered Data Engineering pipeline. Upload any CSV — watch it flow through Bronze → Silver → Gold.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-dataflow--studio.vercel.app-blue?style=for-the-badge)](https://dataflow-studio-seven.vercel.app)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Claude AI](https://img.shields.io/badge/Claude%20AI-CC785C?style=for-the-badge)](https://anthropic.com)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)

---

## What is DataFlow Studio?

DataFlow Studio is a full-stack web application that runs any CSV file through a professional **medallion architecture pipeline** (Bronze → Silver → Gold), powered by **Claude AI** for intelligent data analysis and production-ready code generation.

It was built as a portfolio project to demonstrate end-to-end data engineering skills interactively — not just on a resume.

---

## Live Demo

🔗 **[dataflow-studio-seven.vercel.app](https://dataflow-studio-seven.vercel.app)**

Upload any CSV and watch the full pipeline run. Try it with:
- Sales data
- Financial records
- Survey responses
- Any messy real-world dataset

---

## Pipeline Overview

```
Upload CSV  →  Bronze Layer  →  Silver Layer  →  Gold Layer  →  Export
               Raw profiling    AI transforms    Analytics      Code + CSV
```

### 🥉 Bronze Layer
- Schema detection (column names + data types)
- Null value analysis (count + percentage per column)
- Duplicate row detection
- Data quality scoring
- Live terminal animation showing what's happening

### 🥈 Silver Layer — Powered by Claude AI
- Intelligent issue detection
- AI-generated data cleaning transformations
- **Real PySpark code** for every transformation
- **Equivalent SQL** for every transformation
- PySpark ↔ SQL tab switcher

### 🥇 Gold Layer — Powered by Claude AI
- Auto-generated KPIs with color coding
- Charts: Bar, Line, Pie (auto-selected by Claude based on data)
- Business insights — actionable observations from the data
- Production-ready PySpark Gold layer code

### 📦 Export
- **Cleaned CSV** — Silver-transformed data ready for analysis
- **Pipeline Code (.py)** — Complete Bronze→Silver→Gold PySpark file
- **Pipeline Report (.txt)** — Full summary of schema, insights, and transformations

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS v3, Recharts, React Dropzone |
| Backend | Python, FastAPI, Uvicorn, Pandas |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Deploy — Frontend | Vercel |
| Deploy — Backend | Render |
| Version Control | GitHub |

---

## Project Structure

```
dataflow-studio/
├── backend/
│   ├── main.py                 # FastAPI app, CORS, router setup
│   ├── requirements.txt        # Python dependencies
│   ├── Procfile                # Render start command
│   └── routes/
│       ├── bronze.py           # CSV upload + data profiling
│       ├── silver.py           # Claude AI transformations
│       └── gold.py             # Analytics + download endpoints
└── frontend/
    └── src/
        ├── App.js              # Stage machine (landing→upload→bronze→silver→gold)
        ├── components/
        │   └── Layout.jsx      # Shared navbar + background
        └── pages/
            ├── Landing.jsx     # Hero page with animated pipeline diagram
            ├── Upload.jsx      # CSV drag and drop
            ├── Bronze.jsx      # Data profile + live terminal
            ├── Silver.jsx      # AI transforms + code tabs
            └── Gold.jsx        # Dashboard + charts + exports
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/rohith-66/dataflow-studio.git
cd dataflow-studio/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "ANTHROPIC_API_KEY=your_key_here" > .env

# Start the backend
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the frontend
npm start
```

Frontend runs at: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bronze/upload` | Upload CSV, returns schema + quality profile |
| POST | `/silver/transform` | Claude AI analysis + transformations |
| POST | `/gold/analyze` | KPIs, charts, insights generation |
| POST | `/gold/download/csv` | Download cleaned CSV |
| POST | `/gold/download/code` | Download PySpark pipeline (.py) |
| POST | `/gold/download/report` | Download pipeline report (.txt) |

---

## Example — Generated PySpark Code

DataFlow Studio generates real, production-ready PySpark code like this:

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, to_date, when, regexp_extract

spark = SparkSession.builder \
    .appName("DataFlowStudio_sales_data") \
    .getOrCreate()

# Bronze — raw ingestion
df = spark.read.csv("s3://your-bucket/raw/sales_data.csv", header=True, inferSchema=True)

# Silver — AI-generated transformations
# Fix date columns
df = df.withColumn("Order Date", to_date(col("Order Date"), "dd/MM/yyyy"))

# Handle nulls
df = df.fillna({"Postal Code": "UNKNOWN"})

# Fix data types
df = df.withColumn("Revenue", col("Revenue").cast("double"))

df.write.mode("overwrite").parquet("s3://your-bucket/silver/")

# Gold — aggregations
df_gold = df.groupBy("Region").agg({"Revenue": "sum", "Order ID": "count"})
df_gold.write.mode("overwrite").parquet("s3://your-bucket/gold/")
```

---

## Key Design Decisions

**Why a stage machine instead of React Router?**
The pipeline is a strict linear flow. useState with a stage string is simpler, requires no URL configuration, and makes the data flow between stages explicit.

**Why FastAPI over Flask or Django?**
FastAPI's automatic request validation via Pydantic, async support, and auto-generated Swagger docs make it ideal for a data API. The `/docs` endpoint is great for testing during development.

**Why Claude API for code generation?**
Claude understands context — it reads the actual column names, data types, and quality issues before generating transformations. This produces dataset-specific PySpark code, not generic templates.

**Why max_tokens: 4000 for Silver?**
Early builds used 2000 tokens which caused JSON truncation on larger datasets. 4000 tokens ensures complete JSON responses. An auto-retry mechanism handles any remaining parse failures.

---

## What This Demonstrates

This project showcases the following data engineering skills:

- **Medallion Architecture** — Bronze/Silver/Gold lakehouse pattern
- **Data Quality** — Null detection, type inference, duplicate analysis
- **PySpark** — Transformations, type casting, date parsing, null handling
- **SQL** — Equivalent queries for every transformation
- **REST API Design** — FastAPI with Pydantic validation, streaming downloads
- **AI Integration** — Prompt engineering, structured JSON output, error handling
- **Full Stack** — React frontend, Python backend, deployed end to end

---

## Deployment

### Frontend (Vercel)
```
Root Directory: frontend
Framework: Create React App
Build Command: npm run build
```

### Backend (Render)
```
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Environment: ANTHROPIC_API_KEY=your_key
```

---

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `ANTHROPIC_API_KEY` | `backend/.env` | Your Anthropic API key |

Never commit `.env` to GitHub. It is gitignored by default.

---

## Built With

- [Anthropic Claude API](https://anthropic.com) — AI brain for transformations and analytics
- [FastAPI](https://fastapi.tiangolo.com) — Python backend framework
- [React](https://reactjs.org) — Frontend framework
- [Tailwind CSS](https://tailwindcss.com) — Utility-first styling
- [Recharts](https://recharts.org) — Chart components
- [Vercel](https://vercel.com) — Frontend hosting
- [Render](https://render.com) — Backend hosting

---

## Author

**Rohith Srinivasa**
MS Data Science — Arizona State University (May 2026)
2 years experience as IoT & Data Analyst at Software AG, Bangalore

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/rohithsrinivasa)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rohith-66)

---

## License

MIT License — feel free to use, modify, and build on this project.

---

*Built for the [Codex Creator Challenge](https://codex.anthropic.com) — April 2026*
