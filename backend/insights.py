def generate_insights(input_data: dict, probability: float) -> list:
    insights = []

    if probability < 40:
        insights.append("Focus on core academic metrics and internship experience immediately.")
        insights.append("Technical and communication readiness needs urgent improvement.")
    elif probability < 70:
        insights.append("You have a solid base; strengthen internships and project depth.")
        insights.append("Improve communication and interview readiness for better offers.")
    else:
        insights.append("Your profile is strong; focus on polishing deployment and interview performance.")
        insights.append("Maintain momentum by targeting higher-quality internships and projects.")

    if input_data.get("internships", 0) < 2:
        insights.append("Internship experience is below expectations; apply to more role-specific opportunities.")

    if input_data.get("skills_score", 0) < 6:
        insights.append("Skills score indicates more hands-on projects and practice are needed.")

    if input_data.get("communication_score", 0) < 6:
        insights.append("Communication score suggests mock interviews and presentation practice would help.")

    if input_data.get("backlogs", 0) > 2:
        insights.append("Reducing backlogs will improve your placement profile significantly.")

    if not insights:
        insights.append("Your profile is balanced; keep up the consistent preparation.")

    return insights[:4]
