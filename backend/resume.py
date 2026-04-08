import io
import re
try:
    import PyPDF2
except ImportError:
    pass # Should be installed

def analyze_resume(file_bytes: bytes) -> dict:
    text = ""
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + " "
    except Exception as e:
        print(f"Error reading PDF: {e}")
        
    text_lower = text.lower()
    
    # Required skills list as per requirements
    required_skills = ["DSA", "Projects", "Internships", "Communication", "Core Subjects"]
    
    # Mapping to find skills based on keywords
    skill_mapping = {
        "DSA": ["dsa", "data structures", "algorithms"],
        "Projects": ["project", "projects", "github"],
        "Internships": ["intern", "internship", "experience"],
        "Communication": ["communication", "presentation", "leadership"],
        "Core Subjects": ["os", "operating system", "dbms", "database", "cn", "computer networks", "core subjects"],
        "Python": ["python"],
        "Java": ["java"],
        "ML": ["ml", "machine learning"],
        "SQL": ["sql", "mysql", "postgresql"],
        "React": ["react", "reactjs", "react.js"]
    }
    
    detected_skills_set = set()
    
    for main_skill, keywords in skill_mapping.items():
        for kw in keywords:
            # Word boundary matching
            if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
                detected_skills_set.add(main_skill)
                break # Move to next main_skill once found
                
    detected_skills = list(detected_skills_set)
    missing_skills = [sk for sk in required_skills if sk not in detected_skills]
    
    strength = []
    if "DSA" in detected_skills:
        strength.append("Good foundational knowledge in Data Structures and Algorithms.")
    if len(detected_skills) >= 4:
        strength.append(f"Diverse skill set detected ({len(detected_skills)} key skills matched).")
    if "Projects" in detected_skills:
        strength.append("Practical experience showcased through projects.")
    if len(strength) == 0:
        strength.append("Found basic information in resume.")
        
    suggestions = []
    if "Projects" in missing_skills:
        suggestions.append("Add 1 strong project to showcase practical experience")
    if "DSA" in missing_skills:
        suggestions.append("Improve DSA practice and mention related skills")
    if "Internships" in missing_skills:
        suggestions.append("Include internship experience or meaningful open source contribution")
    if "Communication" in missing_skills:
        suggestions.append("Highlight soft skills, teamwork, and communication explicitly")
    if "Core Subjects" in missing_skills:
        suggestions.append("Include core subjects like OS, DBMS, or Computer Networks")
        
    if not suggestions:
        suggestions.append("Your resume meets all the key requirements. Continue refining details!")
        
    return {
        "detected_skills": detected_skills,
        "missing_skills": missing_skills,
        "strength": strength,
        "suggestions": suggestions
    }
