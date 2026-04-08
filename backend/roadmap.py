def generate_roadmap(input_data: dict, probability: float) -> list:
    """
    Generate an execution-grade intelligent planning system.
    Provides targeted KPIs, effort metrics, and executable checkpoints.
    """
    is_weak_skills = input_data.get('skills_score', 10) < 6
    is_weak_projects = input_data.get('projects', 5) < 2
    is_weak_internships = input_data.get('internships', 5) < 2
    is_weak_communication = input_data.get('communication_score', 10) < 6
    has_backlogs = input_data.get('backlogs', 0) > 2
    is_weak_cgpa = input_data.get('cgpa', 10) < 7

    # Determine effort intensity and time block
    if probability < 40:
        weekly_hours = "20-25 hrs/week"
        effort_tag = "High intensity execution required"
    elif probability < 70:
        weekly_hours = "12-15 hrs/week"
        effort_tag = "Consistent effort required"
    else:
        weekly_hours = "6-8 hrs/week"
        effort_tag = "Refinement phase"

    m1_tasks = []
    m1_kpi = []
    
    m3_tasks = []
    m3_kpi = []
    
    m5_tasks = []
    m5_kpi = []

    # ======== Centralized KPI Allocations ========
    if is_weak_skills:
        m1_kpi.append("Solve 60 DSA problems in 2 months")
    if is_weak_projects:
        m3_kpi.append("Complete 2 major projects")
    if is_weak_internships:
        m3_kpi.append("Apply to 50 internships")
        m3_kpi.append("Get at least 3 interview calls")
    if is_weak_communication:
        m5_kpi.append("Complete 10 mock interviews")
    if has_backlogs:
        m1_kpi.append("Clear all pending subjects")

    # ======== Month 1-2 Execution Check ========
    if has_backlogs:
        m1_tasks.append("Clear all backlogs as top priority (form strict study blocks and consult professors directly).")
        
    if is_weak_cgpa:
        m1_tasks.append("Improve academic consistency (attend classes without fail and do weekly revision sprints).")
        
    if is_weak_skills:
        if is_weak_projects:
            m1_tasks.append("Build projects while learning DSA (apply algorithms inside project).")
        else:
            m1_tasks.append("Solve 2 LeetCode problems daily + revise weekly.")

    if not m1_tasks:
        m1_tasks.append("Maintain high academic standards (review core subjects like OS/DBMS/Networks weekly).")
        
    if not m1_kpi:
        m1_kpi.append("Establish a 100% consistent foundational learning schedule")
        
    m1_checkpoint = "Can you solve medium DSA problems independently?" if is_weak_skills else "Are all pending backlogs and academic hurdles cleared securely?" if has_backlogs else "Are you maintaining a solid fundamental grasp on core CS subjects?"

    # ======== Month 3-4 Execution Check ========
    if is_weak_internships:
        if is_weak_communication:
            m3_tasks.append("Apply daily + give mock interviews twice a week.")
        else:
           m3_tasks.append("Apply proactively to internships (target 10 tailored applications/week on platforms like Internshala).")
            
    if is_weak_projects and not is_weak_skills:
        m3_tasks.append("Develop 2 real-world projects with full deployment (focus on backend scaling and user metrics).")
        
    if not m3_tasks:
        m3_tasks.append("Expand the complexity of your current projects (add a scalable backend or live user-base feature).")
        m3_tasks.append("Ensure your GitHub profile holds a strong, consistent activity graph highlighting ongoing execution.")
    elif len(m3_tasks) < 2:
        m3_tasks.append("Ensure your GitHub profile holds a strong, consistent activity graph highlighting ongoing execution.")
        
    if not m3_kpi:
        m3_kpi.append("Execute consistent development commits efficiently mapped across target skills")

    m3_checkpoint = "Do you have 2 deployed projects?" if is_weak_projects else "Have you sourced at least 3 interview opportunities via cold outreach?" if is_weak_internships else "Is your open-source impact visible on GitHub?"

    # ======== Month 5-6 Execution Check ========
    if is_weak_communication and not is_weak_internships:
        m5_tasks.append("Practice mock interviews and speaking exercises (use peer-to-peer interviews to build verbal confidence).")
        
    m5_tasks.append("Optimize your resume for ATS tracking (quantify project impact metrics and tighten formatting layout).")
    m5_tasks.append("Conduct final aggressive placement preparation (solve company-specific assessments and source alumni referrals).")
    
    if not m5_kpi:
        m5_kpi.append("Secure at least 1 favorable final placement evaluation")

    m5_checkpoint = "Are you consistently clearing mock interviews?"

    # ======== Final Application Dictionary ========
    roadmap = [
        {
            "month": "Month 1-2",
            "focus": f"Core Fixes & Foundation [{effort_tag}]",
            "weekly_hours": weekly_hours,
            "tasks": m1_tasks,
            "kpi": m1_kpi,
            "checkpoint": m1_checkpoint
        },
        {
            "month": "Month 3-4",
            "focus": f"Practical Exposure & Experience [{effort_tag}]",
            "weekly_hours": weekly_hours,
            "tasks": m3_tasks,
            "kpi": m3_kpi,
            "checkpoint": m3_checkpoint
        },
        {
            "month": "Month 5-6",
            "focus": f"Final Optimization & Placements [{effort_tag}]",
            "weekly_hours": weekly_hours,
            "tasks": m5_tasks,
            "kpi": m5_kpi,
            "checkpoint": m5_checkpoint
        }
    ]

    return roadmap
