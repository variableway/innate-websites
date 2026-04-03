#!/usr/bin/env node
/**
 * GitHub Issues Fetcher Script
 * 
 * Fetches issues from GitHub org repositories and saves them locally.
 * Compares with existing data to only update when there are changes.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const ISSUES_FILE = path.join(DATA_DIR, 'issues.json');
const SYNC_STATE_FILE = path.join(DATA_DIR, 'sync-state.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = process.env.GITHUB_ORG || 'variableway';

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load existing sync state
function loadSyncState() {
  try {
    if (fs.existsSync(SYNC_STATE_FILE)) {
      return JSON.parse(fs.readFileSync(SYNC_STATE_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading sync state:', e.message);
  }
  return { lastSync: null, issueIds: [] };
}

// Save sync state
function saveSyncState(state) {
  fs.writeFileSync(SYNC_STATE_FILE, JSON.stringify(state, null, 2));
}

// Load existing issues
function loadExistingIssues() {
  try {
    if (fs.existsSync(ISSUES_FILE)) {
      return JSON.parse(fs.readFileSync(ISSUES_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading existing issues:', e.message);
  }
  return { issues: [], projects: [] };
}

// Save issues data
function saveIssues(data) {
  fs.writeFileSync(ISSUES_FILE, JSON.stringify(data, null, 2));
}

// GitHub API helper
async function githubFetch(url) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'innate-issue-fetcher',
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Fetch all repositories for an organization
async function fetchRepos(org) {
  const repos = [];
  let page = 1;
  
  while (true) {
    const url = `https://api.github.com/orgs/${org}/repos?per_page=100&page=${page}`;
    const data = await githubFetch(url);
    
    if (data.length === 0) break;
    
    repos.push(...data);
    page++;
    
    // Safety limit
    if (page > 10) break;
  }
  
  // Exclude .github repo and archived repos
  return repos.filter(repo => 
    repo.name !== '.github' && 
    !repo.archived &&
    !repo.disabled
  );
}

// Fetch issues for a repository
async function fetchIssues(org, repo) {
  const issues = [];
  let page = 1;
  
  while (true) {
    // Fetch both open and closed issues
    const url = `https://api.github.com/repos/${org}/${repo}/issues?state=all&per_page=100&page=${page}`;
    const data = await githubFetch(url);
    
    if (data.length === 0) break;
    
    // Filter out pull requests (GitHub API returns PRs as issues)
    const filteredIssues = data.filter(item => !item.pull_request);
    issues.push(...filteredIssues);
    page++;
    
    // Safety limit
    if (page > 10) break;
  }
  
  return issues;
}

// Transform GitHub issue to our format
function transformIssue(issue, projectId, projectColor) {
  return {
    id: `issue-${issue.id}`,
    number: issue.number,
    title: issue.title,
    description: issue.body || '',
    status: issue.state === 'open' ? 'open' : 'closed',
    project: projectId,
    labels: issue.labels.map(label => ({
      id: typeof label === 'string' ? label : `${label.name}`,
      name: typeof label === 'string' ? label : label.name,
      color: typeof label === 'string' ? '#888888' : label.color || '#888888',
      description: typeof label === 'string' ? '' : label.description || '',
    })),
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    closedAt: issue.closed_at,
    url: issue.html_url,
    author: issue.user?.login || 'Unknown',
  };
}

// Main function
async function main() {
  console.log(`🚀 Fetching issues from ${GITHUB_ORG}...`);
  
  try {
    // Load existing data
    const existingData = loadExistingIssues();
    const syncState = loadSyncState();
    
    // Fetch all repos
    console.log('📦 Fetching repositories...');
    const repos = await fetchRepos(GITHUB_ORG);
    console.log(`Found ${repos.length} repositories`);
    
    // Build projects list
    const projects = repos.map(repo => ({
      id: repo.name,
      name: repo.name,
      description: repo.description || '',
      color: '#8FA68E', // Default color, can be customized
      repoUrl: repo.html_url,
    }));
    
    // Fetch issues from all repos
    const allIssues = [];
    const existingIssueIds = new Set(existingData.issues.map(i => i.id));
    let hasNewIssues = false;
    
    for (const repo of repos) {
      console.log(`🔍 Fetching issues from ${repo.name}...`);
      
      try {
        const repoIssues = await fetchIssues(GITHUB_ORG, repo.name);
        console.log(`  Found ${repoIssues.length} issues`);
        
        const project = projects.find(p => p.id === repo.name);
        
        for (const issue of repoIssues) {
          const transformed = transformIssue(issue, repo.name, project?.color);
          allIssues.push(transformed);
          
          // Check if this is a new issue
          if (!existingIssueIds.has(transformed.id)) {
            hasNewIssues = true;
            console.log(`  🆕 New issue: #${issue.number} - ${issue.title.substring(0, 50)}`);
          }
        }
      } catch (error) {
        console.error(`  ❌ Error fetching issues from ${repo.name}:`, error.message);
      }
    }
    
    console.log(`\n📊 Total issues: ${allIssues.length}`);
    console.log(`🆕 New issues: ${hasNewIssues ? 'Yes' : 'No'}`);
    
    // Save data
    const data = {
      projects,
      issues: allIssues,
      lastUpdated: new Date().toISOString(),
    };
    
    saveIssues(data);
    
    // Update sync state
    syncState.lastSync = new Date().toISOString();
    syncState.issueIds = allIssues.map(i => i.id);
    saveSyncState(syncState);
    
    console.log('✅ Issues data saved successfully!');
    
  } catch (error) {
    console.error('❌ Error fetching issues:', error.message);
    process.exit(1);
  }
}

main();
