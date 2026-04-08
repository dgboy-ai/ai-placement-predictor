import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

def generate_dataset(n=1500):
    """Generates a synthetic student placement dataset."""

    np.random.seed(42)
    
    attendance = np.random.uniform(50, 100, n)
    cgpa = np.random.uniform(5, 10, n)
    projects = np.random.randint(0, 6, n)
    communication_score = np.random.uniform(3, 10, n)
    backlogs = np.random.randint(0, 6, n)
    
    raw_skills = cgpa + np.random.normal(0, 1.5, n)
    skills_score = np.clip(raw_skills, 3, 10)
    
    raw_interns = (cgpa - 5) / 5 * 3 + np.random.normal(0, 1, n) 
    internships = np.clip(np.round(raw_interns), 0, 5).astype(int)
    
    df = pd.DataFrame({
        'attendance': attendance,
        'cgpa': cgpa,
        'internships': internships,
        'projects': projects,
        'skills_score': skills_score,
        'communication_score': communication_score,
        'backlogs': backlogs
    })
    
    score = (
        (df['cgpa'] / 10) * 0.35 + 
        (df['skills_score'] / 10) * 0.25 + 
        (df['internships'] / 5) * 0.15 + 
        (df['projects'] / 5) * 0.10 + 
        (df['communication_score'] / 10) * 0.15 - 
        (df['backlogs'] / 5) * 0.25
    )
    
    noise = np.random.normal(0, 0.05, n)
    final_score = score + noise
    
    threshold = np.median(final_score)
    df['placed'] = (final_score >= threshold).astype(int)
    
    return df

def train_model():
    """Trains a Random Forest classifier on the generated dataset."""
    df = generate_dataset()
    
    feature_names = [
        'attendance', 
        'cgpa', 
        'internships', 
        'projects', 
        'skills_score', 
        'communication_score', 
        'backlogs'
    ]
    
    X = df[feature_names]
    y = df['placed']
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_scaled, y)
    
    return model, scaler, feature_names
