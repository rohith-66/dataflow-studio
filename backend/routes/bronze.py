import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    
    # Read the uploaded CSV into a pandas DataFrame
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

    # Basic shape info
    rows, cols = df.shape

    # Schema — column name + data type
    schema = [
        {"column": col, "dtype": str(df[col].dtype)}
        for col in df.columns
    ]

    # Data quality checks per column
    quality = []
    for col in df.columns:
        quality.append({
            "column": col,
            "null_count": int(df[col].isnull().sum()),
            "null_pct": round(df[col].isnull().mean() * 100, 2),
            "unique_values": int(df[col].nunique()),
            "duplicate_rows": int(df.duplicated().sum())
        })

    # First 10 rows as preview
    preview = df.head(10).fillna("NULL").to_dict(orient="records")

    return JSONResponse({
        "filename": file.filename,
        "rows": rows,
        "cols": cols,
        "schema": schema,
        "quality": quality,
        "preview": preview
    })