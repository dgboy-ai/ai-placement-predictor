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
    Generates a high-quality, ATS-friendly PDF using ReportLab.
    """
    doc = SimpleDocTemplate(output_stream, pagesize=letter, 
                            rightMargin=50, leftMargin=50, 
                            topMargin=50, bottomMargin=50)
    
    styles = getSampleStyleSheet()
    
    # Custom Styles
    name_style = ParagraphStyle(
        'NameStyle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=10,
        alignment=1 # Center
    )
    
    contact_style = ParagraphStyle(
        'ContactStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor("#475569"),
        alignment=1,
        spaceAfter=20
    )
    
    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor("#334155"),
        borderPadding=2,
        borderColor=colors.HexColor("#e2e8f0"),
        borderWidth=0,
        borderStyle=None,
        spaceBefore=15,
        spaceAfter=10,
        textTransform='uppercase'
    )
    
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        color=colors.HexColor("#334155"),
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletPoint',
        parent=styles['Normal'],
        fontSize=10,
        leading=12,
        leftIndent=20,
        bulletIndent=10,
        spaceAfter=5
    )

    story = []

    # Header
    story.append(Paragraph(data.get('name', 'Improved Resume'), name_style))
    story.append(Paragraph(data.get('contact', ''), contact_style))
    
    # Horizontal line replacement
    story.append(Spacer(1, 1))

    # Summary
    if 'summary' in data:
        story.append(Paragraph("Professional Summary", section_title_style))
        story.append(Paragraph(data['summary'], body_style))

    # Skills
    if 'skills' in data:
        story.append(Paragraph("Technical Skills", section_title_style))
        skills_text = ", ".join(data['skills'])
        story.append(Paragraph(skills_text, body_style))

    # Experience
    if 'experience' in data and data['experience']:
        story.append(Paragraph("Professional Experience", section_title_style))
        for exp in data['experience']:
            title_text = f"<b>{exp.get('title', '')}</b> | {exp.get('company', '')}"
            date_text = exp.get('date', '')
            story.append(Paragraph(f"{title_text} <font color='#64748b'>( {date_text} )</font>", body_style))
            
            for ach in exp.get('achievements', []):
                story.append(Paragraph(f"• {ach}", bullet_style))
            story.append(Spacer(1, 10))

    # Projects
    if 'projects' in data and data['projects']:
        story.append(Paragraph("Key Projects", section_title_style))
        for proj in data['projects']:
            story.append(Paragraph(f"<b>{proj.get('name', '')}</b>", body_style))
            for ach in proj.get('achievements', []):
                story.append(Paragraph(f"• {ach}", bullet_style))
            story.append(Spacer(1, 10))

    # Education
    if 'education' in data and data['education']:
        story.append(Paragraph("Education", section_title_style))
        if isinstance(data['education'], list):
            for edu in data['education']:
                edu_text = f"<b>{edu.get('degree', '')}</b> | {edu.get('institution', '')}"
                story.append(Paragraph(f"{edu_text} ({edu.get('date', '')})", body_style))
        else:
            story.append(Paragraph(str(data['education']), body_style))

    doc.build(story)
    return output_stream
