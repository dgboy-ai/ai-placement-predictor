import io
import re
import PyPDF2

def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_points(text: str) -> list:
    points = [p.strip() for p in re.split(r'(?:\n|•|\*|-)', text) if len(p.strip()) > 5]
    return points[:5]

def analyze_resume(file_bytes: bytes) -> dict:
    raw_text = ""
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                raw_text += extracted + " \n "
    except Exception as e:
        print(f"Error reading PDF: {e}")
        
    text = clean_text(raw_text)
    text_lower = text.lower()
    
    # 1. Advanced Section Detection (Surgical)
    section_patterns = {
        "education": r'\b(education|academic background|academics|qualifications)\b',
        "skills": r'\b(skills|technical skills|technologies|core competencies|stack)\b',
        "projects": r'\b(projects|academic projects|personal projects|technical projects)\b',
        "experience": r'\b(experience|work experience|employment history|internships|professional experience)\b',
        "awards": r'\b(certifications|certificates|achievements|awards|honors)\b'
    }
    
    positions = []
    for sec, pattern in section_patterns.items():
        match = re.search(pattern, text_lower)
        if match:
            positions.append((match.start(), sec))
    
    positions.sort(key=lambda x: x[0])
    
    section_texts = {}
    for i in range(len(positions)):
        start_pos = positions[i][0]
        sec_name = positions[i][1]
        end_pos = positions[i+1][0] if i + 1 < len(positions) else len(text_lower)
        section_texts[sec_name] = text[start_pos:end_pos].strip()
        
    sections = {
        "education": section_texts.get("education", "")[:250],
        "skills": extract_points(section_texts.get("skills", "")),
        "projects": extract_points(section_texts.get("projects", "")),
        "experience": extract_points(section_texts.get("experience", "")),
        "awards": extract_points(section_texts.get("awards", ""))
    }

    # 2. Skill DNA Matrix
    skills_library = {
        "product_tier": ["System Design", "Scalability", "Microservices", "Go", "Docker", "Kubernetes", "Redis", "Kafka", "AWS"],
        "technical": ["Python", "Java", "C++", "SQL", "React", "Node", "ML", "DSA", "Django", "Spring"],
        "core": ["DBMS", "OS", "CN", "OOP", "Data Structures", "Algorithms"]
    }
    
    detected_skills = []
    tier_1_matches = 0
    for cat, skl_list in skills_library.items():
        for sk in skl_list:
            pattern = r'\b' + re.escape(sk.lower()) + r'\b'
            if re.search(pattern, text_lower):
                detected_skills.append(sk)
                if cat == "product_tier": tier_1_matches += 1

    # 3. Winning Metric: Achievement Impact Analysis
    # Analyzes action verbs + quantitative metrics
    action_verbs = r'\b(led|built|developed|optimized|scalable|achieved|improved|deployed|reduced|managed)\b'
    metrics_pattern = r'(\d+%|\$\d+|\d+\+ |users|customers|performance|seconds|ms)'
    
    v_matches = len(re.findall(action_verbs, text_lower))
    m_matches = len(re.findall(metrics_pattern, text_lower))
    impact_score = min(20, (v_matches * 2) + (m_matches * 4))

    # 4. ATS Readiness Screening
    ats_issues = []
    if len(text) < 500: ats_issues.append("Resume content too brief for ATS parsing.")
    if not section_texts.get("education"): ats_issues.append("Education section not clearly identified.")
    if not section_texts.get("skills"): ats_issues.append("Missing explicit Skills/Stack section.")
    
    # 5. Winning Score Multi-Tiered
    base_score = 0
    base_score += min(30, len(detected_skills) * 4) # Skills weight
    base_score += impact_score                      # Impact weight
    base_score += 15 if sections["projects"] else 0
    base_score += 15 if sections["experience"] else 0
    base_score += 10 if sections["education"] else 0
    base_score += 10 if sections["awards"] else 0
    
    final_score = min(100, base_score)

    # 6. Tier Analytics (Unique Feature)
    product_match = min(100, (tier_1_matches * 25) + (final_score * 0.5))
    service_match = min(100, (final_score * 0.9) + (10 if len(detected_skills) > 5 else 0))

    # 7. Suggestions (Strategic only)
    suggestions = []
    if m_matches < 3: suggestions.append("QUANTIFY: Add 3+ specific metrics (%, $, time) to your achievement lines.")
    if tier_1_matches < 2: suggestions.append("TIER-1 GAP: Add cloud/scale keywords (Docker, AWS, System Design) for Product roles.")
    if not re.search(r'\b(github|linkedin)\b', text_lower): suggestions.append("LINKS: Missing professional profile links (GitHub/LinkedIn).")

    return {
        "resume_score": final_score,
        "sections": sections,
        "detected_skills": detected_skills,
        "strengths": [
            f"Strong Achievement Density ({v_matches} action verbs found)." if v_matches > 5 else "Foundational action-oriented language.",
            "High Product-Tier compatibility." if product_match > 75 else "Balanced technical profile."
        ],
        "ats_status": "Ready" if not ats_issues else "Risk Detected",
        "ats_issues": ats_issues,
        "match_analytics": {
            "product_firm": round(product_match, 1),
            "service_firm": round(service_match, 1)
        },
        "suggestions": suggestions[:3]
    }


