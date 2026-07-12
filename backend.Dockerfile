FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port for FastAPI
EXPOSE 8000

# Start the application, using AMD ROCm Gemma 4 runtime if configured
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
