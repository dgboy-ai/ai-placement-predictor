def generate_explanation(input_data: dict, model, feature_names: list, probability: float) -> list:
    """
    Generate crisp, dashboard-ready AI explanations with tone adapted to probability.
    """
    reasons = []
    
    # 1. Global Reasoning based on model probability (Tone adapted)
    if probability < 40:
        reasons.append("CRITICAL: Multiple weak areas have a significant impact on your chances.")
    elif probability < 70:
        reasons.append("Moderate profile; key areas need improvement.")
    else:
        reasons.append("Well-positioned: Profile is strong with a clear placement advantage.")
        
    # Safely extract feature importances
    if not hasattr(model, 'feature_importances_'):
        return reasons
        
    importances = model.feature_importances_
    feature_importance_map = {feature_names[i]: importances[i] for i in range(len(feature_names))}
    
    # Sort for the top 3 critical predictors
    sorted_features = sorted(feature_importance_map.keys(), key=lambda f: feature_importance_map[f], reverse=True)
    top_features = sorted_features[:3]
    
    # 2. Contextual Feature Explanations (Short Dashboard Version & Tone Adjusted)
    for feature in top_features:
        value = input_data.get(feature, 0)
        importance = feature_importance_map.get(feature, 0)
        
        # Calculate impact level based on model weight
        if importance > 0.2:
            impact = "HIGH"
        elif importance > 0.1:
            impact = "MEDIUM"
        else:
            impact = "LOW"
            
        if feature == "cgpa":
            if value < 7:
                if probability < 40:
                    reasons.append(f"CGPA ({value}) is a critical weakness ({impact} impact); significantly improve academic consistency.")
                elif probability < 70:
                    reasons.append(f"CGPA ({value}) needs improvement ({impact} impact); focus on academic consistency.")
                else:
                    reasons.append(f"CGPA ({value}) is below optimal ({impact} impact) but profile remains well-positioned.")
            else:
                if probability > 70:
                    reasons.append(f"Strong CGPA ({value}) acts as a major advantage with {impact} positive impact.")
                else:
                    reasons.append(f"Strong CGPA ({value}) contributes with {impact} positive impact.")

        elif feature == "skills_score":
            if value < 6:
                if probability < 40:
                    reasons.append(f"Technical skills ({value}) are critically low ({impact} impact); urgently practice DSA and projects.")
                elif probability < 70:
                    reasons.append(f"Technical skills ({value}) need improvement ({impact} impact); practice DSA and projects.")
                else:
                    reasons.append(f"Technical skills ({value}) are low ({impact} impact) but overall profile is well-positioned.")
            else:
                if probability > 70:
                    reasons.append(f"Solid technical skills ({value}) give a strong advantage with {impact} positive impact.")
                else:
                    reasons.append(f"Solid technical skills ({value}) provide a {impact} positive boost.")
                    
        elif feature == "internships":
            if value < 2:
                if probability < 40:
                    reasons.append(f"Limited internships ({value}) are a critical gap ({impact} impact); urgently apply on LinkedIn.")
                elif probability < 70:
                    reasons.append(f"Limited internships ({value}) need improvement ({impact} impact); actively apply on LinkedIn.")
                else:
                    reasons.append(f"Limited internships ({value}) carry {impact} impact but profile remains well-positioned.")
            else:
                if probability > 70:
                    reasons.append(f"Internships ({value}) provide a well-positioned, strong advantage ({impact} impact).")
                else:
                    reasons.append(f"Internship experience ({value}) is a {impact} positive factor.")
                    
        elif feature == "communication_score":
            if value < 6:
                if probability < 40:
                    reasons.append(f"Communication ({value}) is a critical weakness ({impact} impact); urgently practice mock interviews.")
                elif probability < 70:
                    reasons.append(f"Communication ({value}) needs improvement ({impact} impact); practice mock interviews.")
                else:
                    reasons.append(f"Communication ({value}) is low ({impact} impact) but profile is well-positioned.")
            else:
                if probability > 70:
                    reasons.append(f"Good communication ({value}) is a major advantage ({impact} impact).")
                else:
                    reasons.append(f"Good communication ({value}) provides a {impact} positive impact.")
                    
        elif feature == "backlogs":
            if value > 2:
                if probability < 40:
                    reasons.append(f"High backlogs ({value}) have significant negative impact ({impact}); urgently clear them.")
                elif probability < 70:
                    reasons.append(f"High backlogs ({value}) need improvement ({impact} impact); focus on clearing them.")
                else:
                    reasons.append(f"High backlogs ({value}) are a weakness ({impact} impact), but you are well-positioned.")
            else:
                if probability > 70:
                    reasons.append(f"Low backlogs ({value}) represent a strong academic advantage ({impact} impact).")
                else:
                    reasons.append(f"Low backlogs ({value}) act as a {impact} positive signal.")

    # Max 4 lines (1 global summary + up to 3 feature analyses)
    return reasons[:4]

