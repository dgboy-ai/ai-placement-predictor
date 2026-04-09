import requests
import re
from datetime import datetime, timedelta

def parse_github_username(link_or_username: str) -> str:
    """Parses GitHub username from a URL or raw string."""
    if not link_or_username:
        return ""
    # If it's a link like https://github.com/username
    if "github.com/" in link_or_username:
        # Handle trailing slashes and subpages
        match = re.search(r"github\.com/([^/?#\s]+)", link_or_username)
        if match:
            return match.group(1)
    # If it's just the username
    return link_or_username.strip().strip('@')

def get_total_commits(username: str, headers: dict) -> int:
    """
    Estimates total commits using the Search API. 
    Note: Search API might be slightly delayed or indexed, but it's faster than iterating all repos.
    """
    try:
        search_url = f"https://api.github.com/search/commits?q=author:{username}"
        # Some versions of GitHub API require a specific preview header for commit search
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
    
    if not username:
        return {"error": "Invalid GitHub link or username format."}

    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Solox-Placement-Copilot"
    }

    try:
        # 1. Fetch User Profile
        user_response = requests.get(f"https://api.github.com/users/{username}", headers=headers)
        if user_response.status_code == 404:
            return {"error": f"GitHub account '{username}' not found. Please verify the link or create an account at github.com/join"}
        elif user_response.status_code != 200:
            return {"error": f"GitHub API error: {user_response.status_code}. Rate limit might be reached."}
        
        user_data = user_response.json()
        
        # 2. Fetch Repositories (Up to 100)
        repos_response = requests.get(f"https://api.github.com/users/{username}/repos?per_page=100&sort=updated", headers=headers)
        repos_data = repos_response.json() if repos_response.status_code == 200 else []

        # 3. Fetch Commit Count (Estimation)
        total_commits = get_total_commits(username, headers)

        # Metrics for Screening
        public_repos = user_data.get("public_repos", 0)
        followers = user_data.get("followers", 0)
        account_age_years = (datetime.now() - datetime.strptime(user_data.get("created_at", "2020-01-01T00:00:00Z"), "%Y-%m-%dT%H:%M:%SZ")).days / 365
        
        original_repos = []
        fork_repos = []
        total_stars = 0
        languages_count = {}
        recent_activity_count = 0
        six_months_ago = datetime.now() - timedelta(days=180)
        
        for repo in repos_data:
            if repo.get("fork"):
                fork_repos.append(repo)
            else:
                original_repos.append(repo)
                total_stars += repo.get("stargazers_count", 0)
                lang = repo.get("language")
                if lang:
                    languages_count[lang] = languages_count.get(lang, 0) + 1
            
            updated_at = repo.get("updated_at")
            if updated_at:
                update_date = datetime.strptime(updated_at, "%Y-%m-%dT%H:%M:%SZ")
                if update_date > six_months_ago:
                    recent_activity_count += 1

        # Accuracy/Authentisity Logic
        orig_count = len(original_repos)
        fork_ratio = len(fork_repos) / (public_repos if public_repos > 0 else 1)
        authenticity_flags = []
        
        if orig_count == 0 and public_repos > 0:
            authenticity_flags.append("Warning: All public repositories are forks. Low evidence of original work.")
        elif fork_ratio > 0.8:
            authenticity_flags.append("High fork ratio detected. Majority of work is inherited rather than authored.")
            
        if total_commits < 10 and account_age_years > 0.5:
             authenticity_flags.append("Very low commit history relative to account age.")

        # Scoring Algorithm (Total 100)
        # 30 pts: Commits (Active coding indicator)
        # 30 pts: Original Projects (Evidence of creation)
        # 20 pts: Consistency/Activity (Recent updates)
        # 10 pts: Community Impact (Stars/Followers)
        # 10 pts: Technical Diversity (Languages)
        
        score = 0
        score += min((total_commits / 50) * 30, 30) # 50+ commits for full points
        score += min((orig_count / 5) * 30, 30)     # 5+ original projects for full points
        score += min((recent_activity_count / 3) * 20, 20) # 3+ active repos in 6 months
        score += min(total_stars * 2 + followers * 1, 10)
        score += min(len(languages_count) * 3, 10)

        # Activity Label
        if recent_activity_count >= 5 or total_commits > 100:
            activity_level = "High"
        elif recent_activity_count >= 2 or total_commits > 30:
            activity_level = "Medium"
        else:
            activity_level = "Low"

        # Verification Status
        if score > 70 and not authenticity_flags:
            verification_status = "Verified Expert"
        elif score > 40:
            verification_status = "Authentic Developer"
        else:
            verification_status = "Requires Verification"

        insights = []
        if orig_count > 0:
            top_lang = max(languages_count, key=languages_count.get) if languages_count else "Unknown"
            insights.append(f"Primary expertise detected in {top_lang} with {orig_count} original projects.")
        
        if total_commits > 200:
            insights.append("Highly prolific contributor with extensive commit history.")
        
        if not authenticity_flags:
            insights.append("Work verified as original and authentic.")
        else:
            insights.extend(authenticity_flags)

        return {
            "username": username,
            "profile_url": user_data.get("html_url"),
            "avatar_url": user_data.get("avatar_url"),
            "verification_status": verification_status,
            "github_score": round(score, 1),
            "stats": {
                "total_commits": total_commits,
                "original_projects": orig_count,
                "forked_projects": len(fork_repos),
                "total_stars": total_stars,
                "followers": followers,
                "active_last_6_months": recent_activity_count
            },
            "technical_stack": sorted(languages_count.items(), key=lambda x: x[1], reverse=True)[:5],
            "activity_level": activity_level,
            "screening_insights": insights,
            "is_authentic": len(authenticity_flags) == 0
        }

    except Exception as e:
        return {"error": f"Analysis failed: {str(e)}"}

