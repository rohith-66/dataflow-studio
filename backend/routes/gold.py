import io
import os
import json
import pandas as pd
from fastapi import APIRouter
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

router = APIRouter()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class GoldRequest(BaseModel):
    preview: list
    schema: list
    summary: str
    transformations: list

@router.post("/analyze")
async def analyze(req: GoldRequest):

    schema_text = "\n".join([f"- {s['column']} ({s['dtype']})" for s in req.schema])
    preview_text = json.dumps(req.preview[:5], indent=2)

    prompt = f"""You are a senior Data Engineer building the Gold layer of a data pipeline.

Dataset summary: {req.summary}

Schema:
{schema_text}

Sample data:
{preview_text}

Return ONLY a valid JSON object with exactly this structure:
{{
  "kpis": [
    {{"label": "KPI name", "value": "computed value as string", "color": "green|blue|amber|red"}}
  ],
  "charts": [
    {{
      "title": "chart title",
      "type": "bar|line|pie",
      "description": "what insight this shows",
      "x_key": "column name for x axis",
      "y_key": "column name for y axis",
      "data": [
        {{"name": "label", "value": number}}
      ]
    }}
  ],
  "business_insights": ["list of 3-4 actionable business insights from the data"],
  "pipeline_code": "complete PySpark Gold layer code that would produce this aggregation in production"
}}

Generate realistic KPI values and chart data based on the actual dataset. Make the charts meaningful and insightful."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=3000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    result = json.loads(raw)
    return JSONResponse(result)

import io
from fastapi.responses import StreamingResponse

class DownloadRequest(BaseModel):
    preview: list
    schema: list
    summary: str
    transformations: list
    insights: list
    kpis: list
    filename: str

@router.post("/download/csv")
async def download_csv(req: DownloadRequest):
    df = pd.DataFrame(req.preview)
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    stream.seek(0)
    return StreamingResponse(
        io.BytesIO(stream.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=cleaned_{req.filename}"}
    )

@router.post("/download/code")
async def download_code(req: DownloadRequest):
    transforms = "\n".join([
        f"# {t['name']}\n# {t['description']}\n{t['pyspark_code']}\n"
        for t in req.transformations
    ])
    kpis = "\n".join([f"# {k['label']}: {k['value']}" for k in req.kpis])
    insights = "\n".join([f"# - {i}" for i in req.insights])

    code = f"""# ============================================
# DataFlow Studio — Generated Pipeline
# Dataset: {req.filename}
# Generated: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M')}
# ============================================

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, to_date, when, avg, count, sum
from pyspark.sql.types import StringType

spark = SparkSession.builder \\
    .appName("DataFlowStudio_{req.filename.replace('.csv', '')}") \\
    .getOrCreate()

# ── BRONZE LAYER ─────────────────────────────
# Raw ingestion
df = spark.read.csv(
    "s3://your-bucket/raw/{req.filename}",
    header=True,
    inferSchema=True
)

print(f"Bronze: {{df.count()}} rows, {{len(df.columns)}} columns")
df.printSchema()

# ── SILVER LAYER ─────────────────────────────
# AI-generated transformations

{transforms}

df.write.mode("overwrite").parquet("s3://your-bucket/silver/")
print("Silver layer written.")

# ── GOLD LAYER ───────────────────────────────
# Analytics-ready aggregations

{kpis}

df_gold = df  # Add your aggregations here based on insights:
{insights}

df_gold.write.mode("overwrite").parquet("s3://your-bucket/gold/")
print("Gold layer written. Pipeline complete.")
"""

    return StreamingResponse(
        io.BytesIO(code.encode()),
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename=pipeline_{req.filename.replace('.csv', '.py')}"}
    )

@router.post("/download/report")
async def download_report(req: DownloadRequest):
    report = f"""DataFlow Studio — Pipeline Report
=====================================
Dataset: {req.filename}
Generated: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M')}

DATASET SUMMARY
---------------
{req.summary}

SCHEMA
------
{chr(10).join([f"- {s['column']} ({s['dtype']})" for s in req.schema])}

SILVER TRANSFORMATIONS
----------------------
{chr(10).join([f"[{i+1}] {t['name']}: {t['description']}" for i, t in enumerate(req.transformations)])}

GOLD KPIs
---------
{chr(10).join([f"- {k['label']}: {k['value']}" for k in req.kpis])}

BUSINESS INSIGHTS
-----------------
{chr(10).join([f"- {ins}" for ins in req.insights])}

=====================================
Generated by DataFlow Studio
Built by Ro — MS Data Science @ ASU
=====================================
"""
    return StreamingResponse(
        io.BytesIO(report.encode()),
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename=report_{req.filename.replace('.csv', '.txt')}"}
    )