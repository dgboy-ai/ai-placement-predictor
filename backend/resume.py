import io
import re
import PyPDF2

def clean_text(text: str) -> str:
    # Remove extra spaces and normalize case (we'll keep original text for some extractions but use lower for parsing)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_points(text: str) -> list:
    # Basic heuristic to split section into bullet points
    points = [p.strip() for p in re.split(r'(?:\n|•|\*|-)', text) if len(p.strip()) > 5]
    return points[:5]  # Limit to top 5 points to prevent huge payloads

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
    
    # -------------------------------------------------------------------------
    # 2. SECTION DETECTION
    # -------------------------------------------------------------------------
    section_patterns = {
        "education": r'\b(education|academic background|academics|qualifications)\b',
        "skills": r'\b(skills|technical skills|technologies|core competencies)\b',
        "projects": r'\b(projects|academic projects|personal projects)\b',
        "experience": r'\b(experience|work experience|employment history|internships|professional experience)\b',
        "certifications": r'\b(certifications|certificates|achievements|awards)\b'
    }
    
    positions = []
    for sec, pattern in section_patterns.items():
        for match in re.finditer(pattern, text_lower):
            positions.append((match.start(), sec))
            break  # Only take the first occurrence of each section heading
    
    positions.sort(key=lambda x: x[0])
    
    section_texts = {}
    for i in range(len(positions)):
        start_pos = positions[i][0]
        sec_name = positions[i][1]
        end_pos = positions[i+1][0] if i + 1 < len(positions) else len(text_lower)
        # Extract original case substring
        section_texts[sec_name] = text[start_pos:end_pos].strip()
        
    sections = {
        # Truncate education to 200 chars to avoid blob
        "education": section_texts.get("education", "")[:200] + ("..." if len(section_texts.get("education", "")) > 200 else ""),
        "skills": extract_points(section_texts.get("skills", "")),
        "projects": extract_points(section_texts.get("projects", "")),
        "experience": extract_points(section_texts.get("experience", "")),
        "certifications": extract_points(section_texts.get("certifications", ""))
    }

    # -------------------------------------------------------------------------
    # 3. SKILL EXTRACTION (IMPROVED)
    # -------------------------------------------------------------------------
    skills_dict = {
        "technical": ["Python", "Java", "C++", "SQL", "React", "Node", "ML", "DSA"],
        "core": ["DBMS", "OS", "CN", "OOP"],
        "soft": ["Communication", "Leadership", "Teamwork"]
    }
    
    detected_skills = []
    for cat, skl_list in skills_dict.items():
        for sk in skl_list:
            if sk.lower() == "c++":
                pattern = r'c\+\+'
            else:
                pattern = r'\b' + re.escape(sk.lower()) + r'\b'
            
            if re.search(pattern, text_lower):
                detected_skills.append(sk)
                
    # -------------------------------------------------------------------------
    # 4. SKILL GAP ANALYSIS (ADVANCED)
    # -------------------------------------------------------------------------
    ideal_profile = {
        "technical": ["DSA", "Projects", "Internships"],
        "core": ["DBMS", "OS"],
        "soft": ["Communication"]
    }
    
    missing_skills = []
    has_projects = bool(re.search(r'\b(project|projects|github)\b', text_lower)) or bool(sections["projects"])
    has_internships = bool(re.search(r'\b(intern|internship|internships|experience)\b', text_lower)) or bool(sections["experience"])
    
    for cat, reqs in ideal_profile.items():
        for req in reqs:
            if req == "Projects":
                if not has_projects:
                    missing_skills.append("Projects")
            elif req == "Internships":
                if not has_internships:
                    missing_skills.append("Internships")
            else:
                if req not in detected_skills:
                    missing_skills.append(req)

    strengths = []
    if "DSA" in detected_skills:
        strengths.append("Strong foundational knowledge in DSA.")
    if len(detected_skills) > 4:
        strengths.append(f"Diverse and well-rounded skill base ({len(detected_skills)} matches).")
    if has_projects:
        strengths.append("Demonstrated hands-on capabilities through projects.")
    if has_internships:
        strengths.append("Valuable real-world exposure (internships/experience).")
        
    # -------------------------------------------------------------------------
    # 5. SCORING SYSTEM
    # -------------------------------------------------------------------------
    score = 0
    # Skills -> 30%
    score += min(30, len(detected_skills) * 5)
    # Projects -> 20%
    if has_projects:
        score += 20
    # Experience -> 20%
    if has_internships:
        score += 20
    # Education -> 15%
    if sections["education"] or bool(re.search(r'\b(btech|bsc|degree|university|college|cgpa|gpa)\b', text_lower)):
        score += 15
    # Certifications -> 15%
    if sections["certifications"] or bool(re.search(r'\b(certified|certification|coursera|udemy)\b', text_lower)):
        score += 15
        
    resume_score = min(100, max(0, score))

    # -------------------------------------------------------------------------
    # 6. QUALITY CHECKS (VERY IMPRESSIVE)
    # -------------------------------------------------------------------------
    issues = []
    if not has_projects:
        issues.append("No strong projects mentioned")
    if not has_internships:
        issues.append("Lack of internship or employment experience")
        
    has_metrics = bool(re.search(r'(\d+%|\$\d+|\d+\s*k)', text_lower))
    if not has_metrics:
        issues.append("Lack of measurable achievements")
        
    if len(detected_skills) < 3:
        issues.append("Weak skill section or unrecognized skills")

    # -------------------------------------------------------------------------
    # 7. SUGGESTIONS ENGINE (SMART)
    # -------------------------------------------------------------------------
    suggestions = []
    if "No strong projects mentioned" in issues:
        suggestions.append("Add 1 full-stack project with deployment.")
    if "Lack of internship or employment experience" in issues:
        suggestions.append("Focus on securing an internship or contributing to open-source.")
    if "Lack of measurable achievements" in issues:
        suggestions.append("Include metrics (e.g., improved performance by 30%).")
    if "Weak skill section or unrecognized skills" in issues:
        suggestions.append("Highlight technical skills clearly using exact recognizable keywords.")
        
    for ms in missing_skills:
        if ms not in ["Projects", "Internships"]:
            suggestions.append(f"Consider learning and adding '{ms}' to boost core proficiency.")
            
    if not suggestions:
        suggestions.append("Your resume meets structural benchmarks well! Custom-tailor it for specific descriptions.")

    # -------------------------------------------------------------------------
    # 8. STRUCTURED OUTPUT
    # -------------------------------------------------------------------------
    return {
        "resume_score": resume_score,
        "sections": sections,
        "detected_skills": detected_skills,
        "missing_skills": missing_skills,
        "strengths": strengths,
        "issues": issues,
        "suggestions": suggestions
    }

