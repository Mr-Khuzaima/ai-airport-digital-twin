from fastapi import APIRouter
import subprocess
import os
import json

router = APIRouter()

STATS_FILE = "repo_stats_manifest.json"

def get_local_git_stats():
    """Extracts real stats from the local .git folder."""
    try:
        # Total Commits
        commits = subprocess.check_output(["git", "rev-list", "--count", "HEAD"]).decode().strip()
        
        # Creation Date
        creation_date = subprocess.check_output(["git", "log", "--reverse", "--format=%as"]).decode().split('\n')[0].strip()
        
        # Contributors
        contributors_raw = subprocess.check_output(["git", "log", "--format=%aN"]).decode().strip().split('\n')
        raw_names = list(set([name.strip() for name in contributors_raw if name.strip()]))
        unique_contributors = sorted([
            "Mr-Khuzaima" if name == "Ulf" else name for name in raw_names
        ])
        
        # Repo Name
        repo_name = os.path.basename(os.getcwd())
        if repo_name == "backend_fastapi":
            repo_name = os.path.basename(os.path.dirname(os.getcwd()))

        stats = {
            "repo_name": repo_name,
            "creation_date": creation_date,
            "total_commits": int(commits),
            "contributors_list": unique_contributors,
            "status": "stable"
        }
        
        # Save to manifest for production fallback
        with open(STATS_FILE, "w") as f:
            json.dump(stats, f)
            
        return stats
    except Exception as e:
        print(f"Git execution failed: {e}")
        return None

@router.get("/stats")
async def get_repo_stats():
    # 1. Try to get fresh stats from Git (works locally)
    stats = get_local_git_stats()
    
    if stats:
        return stats
    
    # 2. If Git fails (works in Production/Vercel/Render), use the Manifest
    if os.path.exists(STATS_FILE):
        try:
            with open(STATS_FILE, "r") as f:
                return json.load(f)
        except:
            pass
            
    # 3. Ultimate Fallback (Hardcoded last known good state)
    return {
        "repo_name": "ai-airport-digital-twin",
        "creation_date": "2026-06-06",
        "total_commits": 34,
        "contributors_list": ["Mr-Khuzaima", "Muhammad Abdullah Raja"],
        "status": "stable_fallback"
    }
