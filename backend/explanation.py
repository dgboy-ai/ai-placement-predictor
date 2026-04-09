def generate_explanation(input_data: dict, model, feature_names: list, probability: float) -> list:
    """
    Generate deep, surgically precise AI explanations using neural network weight proxies.
    """
    reasons = []
    
    # 1. Executive Summary Intelligence
    if probability < 40:
        reasons.append("SYSTEM ALERT: Critical profile gaps detected in high-weight decision nodes.")
    elif probability < 70:
        reasons.append("STRATEGIC ADVISORY: Profile demonstrates foundational competence but lacks competitive edge indicators.")
    else:
        reasons.append("OPTIMIZED STATE: Predictive signals indicate high correlation with successful placement cohorts.")
        
    # Check for feature importances (should be injected by model.py for MLP)
    if not hasattr(model, 'feature_importances_'):
        return reasons
        
    importances = model.feature_importances_
    feature_importance_map = {feature_names[i]: importances[i] for i in range(len(feature_names))}
    
    # Identify the top 3 drivers of this dynamic prediction
    sorted_features = sorted(feature_importance_map.keys(), key=lambda f: feature_importance_map[f], reverse=True)
    top_features = sorted_features[:3]
    
    # 2. Variable Impact Analysis
    for feature in top_features:
        value = input_data.get(feature, 0)
        importance = feature_importance_map.get(feature, 0)
        
        # Qualitative Impact Scaling
        impact_level = "Dominant" if importance > 0.25 else ("Significant" if importance > 0.15 else "Influential")
            
        if feature == "cgpa":
            if value < 7.5:
                reasons.append(f"Academic Integrity: Low CGPA ({value}) acts as a {impact_level} friction point in automated screening.")
            else:
                reasons.append(f"Academic Integrity: Consistent CGPA ({value}) provides a {impact_level} baseline of reliability.")

        elif feature == "skills_score":
            if value < 7:
                reasons.append(f"Technical Proficiency: Technical score ({value}) is below target benchmark ({impact_level} driver).")
            else:
                reasons.append(f"Technical Proficiency: Validated skills ({value}) strongly align with High-Tier industry requirements ({impact_level} positive).")
                    
        elif feature == "internships":
            if value < 2:
                reasons.append(f"Operational Experience: Lack of core internships ({value}) creates a {impact_level} gap in professional readiness.")
            else:
                reasons.append(f"Operational Experience: Strategic internship density ({value}) significantly de-risks the profile ({impact_level} factor).")
                    
        elif feature == "communication_score":
            if value < 7:
                reasons.append(f"Collaboration Index: Communication score ({value}) reduces interview conversion probability ({impact_level} factor).")
            else:
                reasons.append(f"Collaboration Index: Superior communication ({value}) acts as a major {impact_level} force multiplier.")
                    
        elif feature == "backlogs":
            if value > 1:
                reasons.append(f"Profile Stability: Active/Past backlogs ({value}) trigger {impact_level} risk flags in high-tier firm criteria.")
            else:
                reasons.append(f"Profile Stability: Clean academic record (backlogs: {value}) maintains {impact_level} profile integrity.")

    return reasons[:4]


