import numpy as np
import pandas as pd
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score

def generate_dataset(n=7500):
    """Generates a highly realistic and complex student placement dataset with multi-modal distributions."""
    np.random.seed(42)
    
    # Advanced Feature Distributions
    attendance = np.random.beta(5, 2, n) * 100 
    cgpa = np.random.normal(7.8, 1.0, n).clip(4, 10)
    projects = np.random.poisson(2.5, n).clip(0, 10)
    # Binary/Categorical proxies
    internships = np.random.choice([0, 1, 2, 3, 4], n, p=[0.4, 0.3, 0.15, 0.1, 0.05])
    backlogs = np.random.choice([0, 1, 2, 3, 4, 5], n, p=[0.75, 0.12, 0.06, 0.04, 0.02, 0.01])
    
    # Skill Synergy (Interaction Logic)
    # High CGPA + Low Projects = "Academic Focus"
    # Low CGPA + High Projects = "Practical Specialist"
    skills_raw = (cgpa * 0.4) + (projects * 0.8) + (internships * 1.2) - (backlogs * 0.5) + np.random.normal(0, 1, n)
    skills_score = np.clip(skills_raw, 1, 10)
    
    comm_raw = (projects * 0.3) + (internships * 0.5) + np.random.normal(6, 1.5, n)
    communication_score = np.clip(comm_raw, 1, 10)
    
    df = pd.DataFrame({
        'attendance': attendance,
        'cgpa': cgpa,
        'internships': internships,
        'projects': projects,
        'skills_score': skills_score,
        'communication_score': communication_score,
        'backlogs': backlogs
    })
    
    # Multi-path Placement Logic (Non-linear)
    # Path A: Super Academic (High CGPA, Zero Backlogs, High Skills)
    score_a = (df['cgpa'] > 8.5).astype(int) * (df['backlogs'] == 0).astype(int) * 0.8
    
    # Path B: Practical Beast (High Projects, High Skills, 2+ Internships)
    score_b = (df['projects'] > 4).astype(int) * (df['skills_score'] > 8).astype(int) * (df['internships'] >= 2).astype(int) * 0.7
    
    # Path C: The Balanced Candidate (Standard weighted sum)
    score_c = (
        (df['cgpa'] / 10)**2 * 0.2 + 
        (df['skills_score'] / 10) * 0.2 + 
        (df['internships'] / 4) * 0.15 + 
        (df['projects'] / 10) * 0.15 + 
        (df['communication_score'] / 10) * 0.1 + 
        (df['attendance'] / 100) * 0.1 - 
        (df['backlogs'] * 0.2)
    )
    
    final_score = score_a + score_b + score_c
    threshold = np.percentile(final_score, 50) 
    df['placed'] = (final_score + np.random.normal(0, 0.05, n) >= threshold).astype(int)
    
    return df

def get_mlp_feature_importance(model, feature_names):
    """Calculates feature importance proxy for MLP using the sum of absolute weights from the first hidden layer."""
    weights = np.abs(model.coefs_[0])
    importance = np.sum(weights, axis=1)
    importance = importance / np.sum(importance)
    return importance

def train_model():
    """Trains a state-of-the-art Deep Learning MLP and validates accuracy."""
    df = generate_dataset()
    
    feature_names = [
        'attendance', 'cgpa', 'internships', 
        'projects', 'skills_score', 'communication_score', 'backlogs'
    ]
    
    X = df[feature_names]
    y = df['placed']
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Optimized Neural Network Architecture
    model = MLPClassifier(
        hidden_layer_sizes=(128, 64, 32),
        activation='relu',
        solver='adam',
        max_iter=1500,
        random_state=42,
        early_stopping=True,
        validation_fraction=0.15,
        alpha=1e-5
    )
    
    cv_scores = cross_val_score(model, X_scaled, y, cv=5)
    print(f"DL Model Cross-Validation Certainty: {np.mean(cv_scores):.4f} (+/- {np.std(cv_scores):.4f})")
    
    model.fit(X_scaled, y)
    model.feature_importances_ = get_mlp_feature_importance(model, feature_names)
    
    return model, scaler, feature_names


