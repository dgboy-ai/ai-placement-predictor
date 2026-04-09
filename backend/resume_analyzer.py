import re
from io import BytesIO

try:
    from PyPDF2 import PdfReader
except ImportError:
    PdfReader = None

DEFAULT_SKILLS = [
    "python",
    "machine learning",
    "data science",
    "deep learning",
    "react",
    "sql",
    "communication",
    "projects",
    "internship",
    "problem solving",
    "teamwork",
    "data structures",
    "algorithms",
]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    if PdfReader is None:
        raise RuntimeError("PyPDF2 is required to parse PDF resumes.")

    reader = PdfReader(BytesIO(file_bytes))
    text = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text.append(page_text)

    return "\n".join(text)

def analyze_resume(file_bytes: bytes, job_field: str = "General Software Engineering") -> dict:
    try:
        text = extract_text_from_pdf(file_bytes)
        normalized = text.lower()
    except Exception as e:
        # If PDF parsing fails, return a basic response
        print(f"PDF parsing failed: {e}")
        return {
            "job_field": job_field,
            "resume_score": 30,
            "field_match_index": 0.0,
            "detected_skills": [],
            "product_match": 0.0,
            "weak_points": ["PDF parsing failed - unable to analyze content"],
            "improvements": ["Please ensure the PDF is not corrupted and try again"],
            "ats_status": "Error"
        }

    # Field-Specific Skill DNA Matrix
    field_benchmarks = {
        "Full Stack Development": ["React", "Node.js", "Express", "MongoDB", "SQL", "PostgreSQL", "Docker", "REST API", "GraphQL", "Redux", "Typescript"],
        "Data Science & AI": ["Python", "Pandas", "NumPy", "TensorFlow", "PyTorch", "Scikit-Learn", "Matplotlib", "Statistics", "Machine Learning", "NLP", "Deep Learning"],
        "DevOps & Cloud": ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Jenkins", "Terraform", "Ansible", "Linux", "CI/CD", "Prometheus"],
        "Backend Engineering": ["Java", "Go", "Redis", "Kafka", "Microservices", "System Design", "SQL", "Spring Boot", "Distributed Systems", "gRPC"],
        "Frontend Engineering": ["React", "Vue", "Next.js", "CSS3", "Tailwind", "Responsive Design", "Accessibility", "Figma", "Redux", "Sass"]
    }

    target_keywords = field_benchmarks.get(job_field, ["Python", "Java", "DSA", "SQL", "Git"])

    # Core Tech Detection
    detected_skills = []
    field_match_count = 0
    for sk in target_keywords:
        pattern = r'\b' + re.escape(sk.lower()) + r'\b'
        if re.search(pattern, normalized):
            detected_skills.append(sk)
            field_match_count += 1

    # Calculate scores
    skill_coverage = (field_match_count / len(target_keywords)) if target_keywords else 0
    resume_score = min(100, max(30, 30 + len(detected_skills) * 10))

    # Industry Match
    product_match = min(100, (field_match_count * 15) + (resume_score * 0.4))

    # Weak Points & Improvements
    weak_points = []
    if field_match_count < 4:
        weak_points.append(f"Insufficient {job_field} specific core stack identifiers.")
    if not any(word in normalized for word in ["project", "projects"]):
        weak_points.append(f"Lack of {job_field} relevant projects in the portfolio section.")
    if resume_score < 60:
        weak_points.append("Low quantitative impact evidence (missing percentages/metrics).")

    improvements = []
    if field_match_count < len(target_keywords):
        missing = [s for s in target_keywords if s not in detected_skills][:3]
        improvements.append(f"Upskill in: {', '.join(missing)} to align with modern JD requirements.")
    if not any(word in normalized for word in ["project", "projects"]):
        improvements.append(f"Architect a capstone project utilizing {target_keywords[0]} to demonstrate domain mastery.")
    if resume_score < 70:
        improvements.append("Refactor experience bullets using the Google XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.")

    return {
        "job_field": job_field,
        "resume_score": resume_score,
        "field_match_index": round(skill_coverage * 100, 1),
        "detected_skills": detected_skills,
        "product_match": round(product_match, 1),
        "weak_points": weak_points if weak_points else ["No major structural weaknesses detected."],
        "improvements": improvements if improvements else ["Resume is optimized for the selected field."],
        "ats_status": "Optimized" if resume_score > 70 else "Review Required"
    }



