from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import numpy as np

# 1. Import: from backend.model import train_model
try:
    from backend.model import train_model
except ImportError:
    # Fallback in case main.py is executed directly within the same directory
    from model import train_model 

# Global variables to store the loaded model, scaler, and features list
model = None
scaler = None
feature_names = None

def init_db():
    conn = sqlite3.connect("predictions.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            attendance REAL,
            cgpa REAL,
            internships INTEGER,
            projects INTEGER,
            skills_score REAL,
            communication_score REAL,
            backlogs INTEGER,
            probability REAL,
            risk TEXT,
            explanation TEXT,
            roadmap TEXT,
            created_at TEXT
        )
    ''')
    conn.commit()
    conn.close()

# 2. At startup: Call train_model(); Store model, scaler, feature_names as global variables
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, scaler, feature_names
    init_db()
    model, scaler, feature_names = train_model()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# 3. Create Pydantic schema
class StudentInput(BaseModel):
    attendance: float
    cgpa: float
    internships: int
    projects: int
    skills_score: float
    communication_score: float
    backlogs: int

@app.get("/")
async def root():
    return {"status": "API running"}

# 4. Create POST /predict endpoint
@app.post("/predict")
async def predict(student: StudentInput):
    # Convert input into correct order using feature_names
    ordered_features = [getattr(student, feature) for feature in feature_names]
    
    # Prepare as 2D array for scaling
    features_array = np.array([ordered_features])
    
    # Scale input using scaler
    scaled_features = scaler.transform(features_array)
    
    # Predict probability using model.predict_proba()
    # predict_proba returns an array of shape (n_samples, n_classes). Index 1 is probability of class 1 ('Placed')
    proba = model.predict_proba(scaled_features)[0][1]
    
    # 5. Return JSON probability (0-100) and prediction string
    probability_value = float(proba * 100)
    prediction_label = "Placed" if probability_value >= 50.0 else "Not Placed"
    
    return {
        "probability": round(probability_value, 2),
        "prediction": prediction_label
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
