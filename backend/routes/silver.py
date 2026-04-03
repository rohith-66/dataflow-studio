import io
import os
import json
import pandas as pd
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

router = APIRouter()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class SilverRequest(BaseModel):
    preview: list
    schema: list
    quality: list
    filename: str

@router.post("/transform")
async def transform(req: SilverRequest):

    schema_text = "\n".join([f"- {s['column']} ({s['dtype']})" for s in req.schema])
    quality_text = "\n".join([
        f"- {q['column']}: {q['null_count']} nulls ({q['null_pct']}%), {q['unique_values']} unique values"
        for q in req.quality
    ])
    preview_text = json.dumps(req.preview[:5], indent=2)

    prompt = f"""You are a senior Data Engineer. Analyze this dataset and return a JSON response.

Dataset: {req.filename}

Schema:
{schema_text}

Data Quality:
{quality_text}

Sample rows:
{preview_text}

Return ONLY a valid JSON object. Keep all text values SHORT (under 20 words each). Use this exact structure:
{{
  "summary": "1-2 sentence description",
  "issues": ["issue 1", "issue 2"],
  "transformations": [
    {{
      "name": "short name",
      "description": "one sentence",
      "pyspark_code": "df = df.withColumn(...)",
      "sql_code": "SELECT ... FROM ..."
    }}
  ],
  "cleaned_preview": []
}}

Maximum 3 transformations. No markdown. No explanation. Just JSON."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()

    # Strip markdown code blocks
    if "```" in raw:
        parts = raw.split("```")
        for part in parts:
            if part.startswith("json"):
                raw = part[4:].strip()
                break
            elif "{" in part:
                raw = part.strip()
                break

    # Extract just the JSON object
    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start != -1 and end != 0:
        raw = raw[start:end]

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        retry = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[
                {"role": "user", "content": prompt},
                {"role": "assistant", "content": message.content[0].text},
                {"role": "user", "content": "Invalid JSON. Return ONLY the JSON object, nothing else. Keep all strings under 20 words."}
            ]
        )
        raw2 = retry.content[0].text.strip()
        start = raw2.find("{")
        end = raw2.rfind("}") + 1
        raw2 = raw2[start:end]
        result = json.loads(raw2)

    return JSONResponse(result)