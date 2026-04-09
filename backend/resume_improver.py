import io
import os
import json
import google.generativeai as genai
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.units import inch
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def improve_resume_content(raw_text, job_field, detected_skills, weak_points):
    """
    Uses Gemini to transform raw resume text into an ATS-optimized version.
    """
    fallback_data = {
        "name": "Improved Resume (Fallback)",
        "contact": "Contact Details from Original Resume",
        "summary": f"Targeting {job_field} role with focus on {', '.join(detected_skills[:3]) if detected_skills else 'core skills'}.",
        "skills": detected_skills + ["Strategic Problem Solving", "Analytical Thinking"] if detected_skills else ["Strategic Problem Solving", "Analytical Thinking"],
        "experience": [
            {
                "title": "Project Lead / Developer",
                "company": "Tech Corp",
                "date": "2023 - Present",
                "achievements": [
                    "Optimized system performance by 25% and implemented scalable architectures.",
                    "Improved deployment time by refactoring legacy codebase."
                ]
            }
        ],
        "education": "Relevant Degree from Original Resume"
    }

    if not api_key:
        return fallback_data

    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    You are an expert technical recruiter and ATS (Applicant Tracking System) specialist.
    I will provide you with the raw text of a resume, a target job field, detected skills, and weak points identified by our analysis.
    
    Your task:
    1. Re-write the resume content to be highly professional and ATS-optimized for the target job field: {job_field}.
    2. Incorporate the detected skills: {', '.join(detected_skills)}.
    3. Specifically address and fix these weak points: {', '.join(weak_points)}.
    4. Use strong action verbs and include quantitative metrics (e.g., %, $, ms, numbers) even if you have to reasonably estimate them based on typical industry achievements.
    
    RAW RESUME TEXT:
    {raw_text}
    
    Return the result in a STRICT JSON format with the following keys:
    - name: User's full name
    - contact: Email, phone, LinkedIn, Location
    - summary: A 3-4 sentence professional summary
    - skills: An array of technical and soft skills
    - experience: An array of objects with 'title', 'company', 'date', and 'achievements' (array of strings)
    - projects: An array of objects with 'name' and 'achievements' (array of strings)
    - education: An array of objects with 'degree', 'institution', and 'date'
    
    DO NOT include any markdown formatting or extra text outside the JSON.
    """

    try:
        response = model.generate_content(prompt)
        # Clean response text in case of markdown blocks
        clean_text = response.text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text[7:-3].strip()
        elif clean_text.startswith("```"):
            clean_text = clean_text[3:-3].strip()
            
        return json.loads(clean_text)
    except Exception as e:
        print(f"Error improving resume with AI: {e}")
        return fallback_data

def generate_resume_pdf(data, output_stream):
    """
    Generates a high-quality, ATS-friendly PDF using ReportLab in the style of Amazon/FAANG resumes.
    Extremely robust against unexpected data types from LLM generation.
    """
    doc = SimpleDocTemplate(output_stream, pagesize=letter, 
                            rightMargin=45, leftMargin=45, 
                            topMargin=40, bottomMargin=40)
    
    styles = getSampleStyleSheet()
    
    # Custom Amazon/FAANG ATS Styles
    name_style = ParagraphStyle(
        'NameStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.black,
        spaceAfter=5,
        alignment=1 # Center
    )
    
    contact_style = ParagraphStyle(
        'ContactStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.black,
        alignment=1,
        spaceAfter=8
    )
    
    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.black,
        spaceBefore=10,
        spaceAfter=4,
        textTransform='uppercase'
    )
    
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        color=colors.black,
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'BulletPoint',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=13,
        leftIndent=15,
        bulletIndent=8,
        spaceAfter=3,
        bulletFontName='Helvetica'
    )

    story = []

    # Safe extraction helpers
    def safe_str(val, default=""):
        return str(val) if val else default

    def safe_list(val):
        if isinstance(val, list): return val
        if isinstance(val, str): return [val]
        return []

    def safe_dict(val):
        return val if isinstance(val, dict) else {}

    # Header
    name = safe_str(data.get('name'), 'Professional Software Engineer')
    contact = safe_str(data.get('contact'), 'contact@email.com | linkedin.com/in/profile | GitHub: /profile')
    
    story.append(Paragraph(name, name_style))
    story.append(Paragraph(contact, contact_style))
    
    # Divider substitute (simple text line since HRFlowable can be tricky with imports)
    story.append(Paragraph("____________________________________________________________________________________", contact_style))
    story.append(Spacer(1, 10))

    # Summary
    summary = safe_str(data.get('summary'))
    if summary:
        story.append(Paragraph("<b>PROFESSIONAL SUMMARY</b>", section_title_style))
        story.append(Paragraph(summary, body_style))
        story.append(Spacer(1, 5))

    # Skills (Amazon style usually groups them compactly)
    skills = data.get('skills')
    if skills:
        story.append(Paragraph("<b>TECHNICAL SKILLS</b>", section_title_style))
        if isinstance(skills, list):
            skills_text = ", ".join([str(s) for s in skills])
        else:
            skills_text = str(skills)
        story.append(Paragraph(skills_text, body_style))
        story.append(Spacer(1, 5))

    # Experience
    experience = safe_list(data.get('experience'))
    if experience:
        story.append(Paragraph("<b>WORK EXPERIENCE</b>", section_title_style))
        for exp in experience:
            exp_dict = safe_dict(exp)
            if not exp_dict:
                story.append(Paragraph(str(exp), body_style))
                continue
                
            title = safe_str(exp_dict.get('title', 'Software Engineer'))
            company = safe_str(exp_dict.get('company', 'Tech Company'))
            date = safe_str(exp_dict.get('date', '2020 - Present'))
            
            # Amazon style: Company Name (bold), Date (right aligned) - achieved via tables or simple text
            # We'll use simple text for robust PDF generation
            header_text = f"<b>{company}</b> | <i>{title}</i>"
            story.append(Paragraph(f"{header_text} <font color='gray'>({date})</font>", body_style))
            
            achievements = safe_list(exp_dict.get('achievements'))
            if not achievements and 'description' in exp_dict:
                 achievements = safe_list(exp_dict.get('description'))
                 
            for ach in achievements:
                story.append(Paragraph(f"<bullet>•</bullet>{safe_str(ach)}", bullet_style))
            story.append(Spacer(1, 5))

    # Projects
    projects = safe_list(data.get('projects'))
    if projects:
        story.append(Paragraph("<b>PROJECTS</b>", section_title_style))
        for proj in projects:
            proj_dict = safe_dict(proj)
            if not proj_dict:
                 story.append(Paragraph(f"<bullet>•</bullet>{str(proj)}", bullet_style))
                 continue
                 
            name = safe_str(proj_dict.get('name', 'Technical Project'))
            story.append(Paragraph(f"<b>{name}</b>", body_style))
            
            achievements = safe_list(proj_dict.get('achievements'))
            if not achievements and 'description' in proj_dict:
                 achievements = safe_list(proj_dict.get('description'))
                 
            for ach in achievements:
                story.append(Paragraph(f"<bullet>•</bullet>{safe_str(ach)}", bullet_style))
            story.append(Spacer(1, 5))

    # Education
    education = data.get('education')
    if education:
        story.append(Paragraph("<b>EDUCATION</b>", section_title_style))
        for edu in safe_list(education):
            edu_dict = safe_dict(edu)
            if not edu_dict:
                story.append(Paragraph(str(edu), body_style))
                continue
                
            degree = safe_str(edu_dict.get('degree', 'Degree'))
            inst = safe_str(edu_dict.get('institution', 'University'))
            date = safe_str(edu_dict.get('date', 'Graduation Date'))
            story.append(Paragraph(f"<b>{inst}</b> | {degree} <font color='gray'>({date})</font>", body_style))

    doc.build(story)
    return output_stream
