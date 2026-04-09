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

def analyze_github_profile(input_text: str) -> dict:
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
        
        # Unique Logic: Coding Velocity
        velocity = (total_commits / (account_age_days / 30)) # commits per month average
        
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

        # 4. Integrity Heuristics
        authenticity_flags = []
        fork_ratio = len(fork_repos) / (public_repos if public_repos > 0 else 1)
        
        if fork_ratio > 0.85 and total_commits < 50:
            authenticity_flags.append("Warning: Heavily derivative profile content with minimal authorship.")
        if velocity < 0.5 and account_age_days > 365:
            authenticity_flags.append("Dormancy Alert: Profile demonstrates negligible long-term coding velocity.")

        # 5. Winning Scoring Logic (Surgical)
        raw_score = 0
        raw_score += min(30, (total_commits / 100) * 30) # Volume
        raw_score += min(30, (len(original_repos) / 5) * 30) # Ownership
        raw_score += min(20, (activity_index / 3) * 20) # Momentum
        raw_score += min(10, (total_stars * 1 + followers * 0.5)) # Validation
        raw_score += min(10, (len(languages_count) * 2.5)) # Diversity
        
        # 6. Deep Insights (Tone Shift)
        strengths = []
        if velocity > 10: strengths.append(f"High-Velocity Coder: Averaging {round(velocity, 1)} commits/month.")
        if total_stars > 5: strengths.append("Community Signal: Original work has validated external utility.")
        if len(languages_count) >= 3: strengths.append("Full-Stack Adaptability: Demonstrated cross-domain technical depth.")
        
        weaknesses = []
        if total_commits < 30: weaknesses.append("Evidence Gap: Insufficient commit volume to validate skill claims.")
        if activity_index < 1: weaknesses.append("Low Momentum: Limited Proof of Work in current technical cycle.")

        # 7. Professional Persona
        if raw_score > 85: persona = "Technical Lead"
        elif total_stars > 15: persona = "Innovator"
        elif velocity > 20: persona = "Power Contributor"
        elif len(original_repos) >= 3: persona = "Product Builder"
        else: persona = "Technical Explorer"

        return {
            "username": username,
            "verification_status": "Verified Elite" if raw_score > 80 else ("Stable Profile" if raw_score > 40 else "Provisional Profile"),
            "github_score": round(raw_score, 1),
            "persona": persona,
            "velocity": round(velocity, 2),
            "stats": {
                "commits": total_commits,
                "originals": len(original_repos),
                "stars": total_stars,
                "velocity_per_month": round(velocity, 1)
            },
            "technical_stack": sorted(languages_count.items(), key=lambda x: x[1], reverse=True)[:5],
            "strengths": strengths if strengths else ["Profile ready for review."],
            "weaknesses": weaknesses if weaknesses else ["High integrity profile."],
            "is_authentic": len(authenticity_flags) == 0,
            "screening_insights": authenticity_flags if authenticity_flags else ["Operational markers indicate valid professional intent."]
        }

    except Exception as e:
        return {"error": f"Deep analysis failure: {str(e)}"}



