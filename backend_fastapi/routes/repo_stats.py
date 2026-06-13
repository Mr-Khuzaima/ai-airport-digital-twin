from fastapi import APIRouter
import subprocess
import os
import json

router = APIRouter()

STATS_FILE = "repo_stats_manifest.json"

import httpx

GITHUB_REPO_URL = "https://api.github.com/repos/Mr-Khuzaima/ai-airport-digital-twin"

async def get_github_stats():
    """Fetches real-time stats from GitHub API."""
    try:
        async with httpx.AsyncClient() as client:
            # 1. Fetch General Repo Info (for creation date)
            repo_res = await client.get(GITHUB_REPO_URL)
            # 2. Fetch Contributors
            contrib_res = await client.get(f"{GITHUB_REPO_URL}/contributors")
            # 3. Fetch Commits (using per_page=1 and looking at headers for total count)
            # Note: GitHub doesn't give a simple 'total_commits' field, 
            # so we use a trick: request 1 item per page and check the last page link
            commit_res = await client.get(f"{GITHUB_REPO_URL}/commits?per_page=1")
            
            if repo_res.status_code == 200 and contrib_res.status_code == 200:
                repo_data = repo_res.json()
                contrib_data = contrib_res.json()
                
                # Get total commits from Link header if available, else count contributors' contributions
                # A common university project trick is to sum contributor contributions
                total_commits = sum(c.get('contributions', 0) for c in contrib_data)
                
                contributors = [c['login'] for c in contrib_data]
                # Map specific names as requested before
                unique_contributors = sorted([
                    "Mr-Khuzaima" if name == "Ulf" else name for name in contributors
                ])

                return {
                    "repo_name": repo_data.get("name", "ai-airport-digital-twin"),
                    "creation_date": repo_data.get("created_at", "").split("T")[0],
                    "total_commits": total_commits,
                    "contributors_list": unique_contributors,
                    "status": "live_github"
                }
    except Exception as e:
        print(f"GitHub API failed: {e}")
    return None

@router.get("/stats")
async def get_repo_stats():
    # 1. Try Live GitHub API
    stats = await get_github_stats()
    if stats:
        return stats
    
    # 2. Fallback to Manifest
    if os.path.exists(STATS_FILE):
        try:
            with open(STATS_FILE, "r") as f:
                data = json.load(f)
                data["status"] = "manifest_fallback"
                return data
        except:
            pass
            
    # 3. Ultimate Fallback
    return {
        "repo_name": "ai-airport-digital-twin",
        "creation_date": "2026-06-06",
        "total_commits": 46,
        "contributors_list": ["Mr-Khuzaima", "Muhammad Abdullah Raja"],
        "status": "hardcoded_fallback"
    }
