from fastapi import APIRouter
import subprocess
import os

router = APIRouter()

@router.get("/stats")
async def get_repo_stats():
    try:
        # Total Commits
        commits = subprocess.check_output(["git", "rev-list", "--count", "HEAD"]).decode().strip()
        
        # Creation Date (PowerShell friendly approach or just git)
        # Using git log --reverse to get first commit date
        creation_date = subprocess.check_output(["git", "log", "--reverse", "--format=%as"]).decode().split('\n')[0].strip()
        
        # Contributors (Unique names)
        contributors_raw = subprocess.check_output(["git", "log", "--format=%aN"]).decode().strip().split('\n')
        # Clean up and get unique names
        raw_names = list(set([name.strip() for name in contributors_raw if name.strip()]))
        
        # Name Mapping (Replace 'Ulf' with 'Mr-Khuzaima')
        unique_contributors = sorted([
            "Mr-Khuzaima" if name == "Ulf" else name for name in raw_names
        ])
        
        # Repo Name (Current directory name)
        repo_name = os.path.basename(os.getcwd())
        if repo_name == "backend_fastapi": # Fallback if run from inside backend folder
            repo_name = os.path.basename(os.path.dirname(os.getcwd()))

        return {
            "repo_name": repo_name,
            "creation_date": creation_date,
            "total_commits": int(commits),
            "contributors_list": unique_contributors,
            "status": "stable"
        }
    except Exception as e:
        return {"error": str(e)}
