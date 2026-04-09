import requests
import re
from datetime import datetime, timedelta

def parse_github_username(link_or_username: str) -> str:
    """Parses GitHub username from a URL or raw string."""
    if not link_or_username:
        return ""
    if "github.com/" in link_or_username:
        match = re.search(r"github\.com/([^/?#\s]+)", link_or_username)
        if match:
            return match.group(1)
    return link_or_username.strip().strip('@')

def get_total_commits(username: str, headers: dict) -> int:
    try:
        search_url = f"https://api.github.com/search/commits?q=author:{username}"
        search_headers = headers.copy()
        search_headers["Accept"] = "application/vnd.github.cloak-preview"
        response = requests.get(search_url, headers=search_headers)
        if response.status_code == 200:
            return response.json().get("total_count", 0)
    except Exception:
        pass
    return 0

def analyze_github_profile(input_text: str, job_field: str = "General Software Engineering") -> dict:
    username = parse_github_username(input_text)
    if not username: return {"error": "Invalid GitHub link format."}

    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Solox-Placement-Copilot"
    }

    try:
        # 1. Profile Data
        user_response = requests.get(f"https://api.github.com/users/{username}", headers=headers)
        if user_response.status_code == 404: return {"error": f"Account '{username}' not found."}
        user_data = user_response.json()
        
        # 2. Repo Metadata
        repos_response = requests.get(f"https://api.github.com/users/{username}/repos?per_page=100&sort=updated", headers=headers)
        repos_data = repos_response.json() if repos_response.status_code == 200 else []

        # 3. Aggregation & Metrics
        total_commits = get_total_commits(username, headers)
        public_repos = user_data.get("public_repos", 0)
        followers = user_data.get("followers", 0)
        born_date = datetime.strptime(user_data.get("created_at", "2020-01-01T00:00:00Z"), "%Y-%m-%dT%H:%M:%SZ")
        account_age_days = max(1, (datetime.now() - born_date).days)
        
        velocity = (total_commits / (account_age_days / 30))
        
        original_repos = []
        fork_repos = []
        total_stars = 0
        languages_count = {}
        activity_index = 0
        six_months_ago = datetime.now() - timedelta(days=180)
        
        for repo in repos_data:
            if repo.get("fork"):
                fork_repos.append(repo)
            else:
                original_repos.append(repo)
                total_stars += repo.get("stargazers_count", 0)
                lang = repo.get("language")
                if lang: languages_count[lang] = languages_count.get(lang, 0) + 1
            
            updated_at = repo.get("updated_at")
            if updated_at and datetime.strptime(updated_at, "%Y-%m-%dT%H:%M:%SZ") > six_months_ago:
                activity_index += 1

        # 4. Field-Specific Project Mapping
        field_projects = {
            "Full Stack Development": ["E-commerce App", "SAAS Dashboard", "Real-time Chat", "Auth System"],
            "Data Science & AI": ["Predictive Model", "Data Scraper", "Neural Network Implementation", "Sentiment Analyzer"],
            "DevOps & Cloud": ["CI/CD Pipeline", "K8s Cluster Setup", "Infrastructure as Code", "Monitoring Tool"],
            "Backend Engineering": ["Distributed Caching", "REST API Framework", "Database Migrator", "Job Queue"],
            "Frontend Engineering": ["UI Component Library", "Animation Suite", "Portfolio Theme", "PWA Application"]
        }
        
        recommended_projects = field_projects.get(job_field, ["Open Source Contribution", "Personal Portfolio"])

        # 5. Integrity & Field Alignment
        authenticity_flags = []
        fork_ratio = len(fork_repos) / (public_repos if public_repos > 0 else 1)
        
        if fork_ratio > 0.85:
            authenticity_flags.append("High Fork Ratio: Large volume of work is inherited, reducing originality proof.")
        
        # 6. Scoring Logic
        raw_score = 0
        raw_score += min(30, (total_commits / 100) * 30)
        raw_score += min(30, (len(original_repos) / 5) * 30)
        raw_score += min(20, (activity_index / 3) * 20)
        raw_score += min(20, (total_stars * 1 + len(languages_count) * 2))
        
        # 7. Field-Specific Insights
        strengths = []
        if velocity > 15: strengths.append(f"Field Agility: High coding velocity indicates rapid adaptation to {job_field} tools.")
        if len(languages_count) >= 3: strengths.append(f"Domain Versatility: Multi-language profile supports cross-functional {job_field} tasks.")
        
        weak_points = []
        if len(original_repos) < 2: weak_points.append(f"Portfolio Thinness: Minimal original software for {job_field} validation.")
        if activity_index < 1: weak_points.append("Stagnant Profile: No active development in current tech cycle.")

        improvements = []
        for proj in recommended_projects:
            found = False
            for repo in original_repos:
                if proj.lower() in repo.get("name", "").lower() or proj.lower() in (repo.get("description") or "").lower():
                    found = True
                    break
            if not found:
                improvements.append(f"BUILD: A '{proj}' to strengthen your {job_field} portfolio.")

        return {
            "username": username,
            "job_field": job_field,
            "github_score": round(raw_score, 1),
            "velocity": round(velocity, 2),
            "persona": f"{job_field} Specialist" if raw_score > 70 else "Technical Explorer",
            "stats": {
                "commits": total_commits,
                "originals": len(original_repos),
                "stars": total_stars
            },
            "technical_stack": sorted(languages_count.items(), key=lambda x: x[1], reverse=True)[:5],
            "strengths": strengths if strengths else ["Profile ready for industry benchmark."],
            "weak_points": weak_points if weak_points else ["No major project gaps detected."],
            "recommended_projects": recommended_projects,
            "improvements": improvements[:3] if improvements else ["Contribute to notable open-source repositories."],
            "is_authentic": len(authenticity_flags) == 0,
            "screening_insights": authenticity_flags if authenticity_flags else ["Profile metadata suggests authentic professional growth."]
        }

    except Exception as e:
        return {"error": f"Deep analysis failure: {str(e)}"}



