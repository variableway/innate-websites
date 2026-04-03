/**
 * Server-side data loader for making module
 * 
 * This module loads data from JSON files at build time.
 * It's designed to work with Next.js static export.
 */

import { Issue, Project, WeeklySummary } from './types'

// Type for the issues data file
interface IssuesData {
  projects: Project[]
  issues: Issue[]
  lastUpdated: string
}

// Type for the weekly data file  
interface WeeklyData {
  summaries: WeeklySummary[]
  lastUpdated: string
}

// Load issues data from JSON file (build-time only)
export function loadIssuesData(): IssuesData {
  try {
    // Dynamic import to avoid bundling fs in client
    if (typeof window === 'undefined') {
      const fs = require('fs')
      const path = require('path')
      
      const dataPath = path.join(process.cwd(), 'data', 'issues.json')
      
      if (fs.existsSync(dataPath)) {
        const content = fs.readFileSync(dataPath, 'utf-8')
        return JSON.parse(content)
      }
    }
  } catch (error) {
    console.error('Error loading issues data:', error)
  }
  
  // Return empty data if file doesn't exist or error occurs
  return {
    projects: [],
    issues: [],
    lastUpdated: new Date().toISOString(),
  }
}

// Load weekly summaries from JSON file (build-time only)
export function loadWeeklyData(): WeeklyData {
  try {
    if (typeof window === 'undefined') {
      const fs = require('fs')
      const path = require('path')
      
      const dataPath = path.join(process.cwd(), 'data', 'weekly.json')
      
      if (fs.existsSync(dataPath)) {
        const content = fs.readFileSync(dataPath, 'utf-8')
        return JSON.parse(content)
      }
    }
  } catch (error) {
    console.error('Error loading weekly data:', error)
  }
  
  return {
    summaries: [],
    lastUpdated: new Date().toISOString(),
  }
}

// For static export, we need to re-export the data
// This will be populated at build time
let cachedIssuesData: IssuesData | null = null
let cachedWeeklyData: WeeklyData | null = null

export function getIssuesData(): IssuesData {
  if (!cachedIssuesData) {
    cachedIssuesData = loadIssuesData()
  }
  return cachedIssuesData
}

export function getWeeklyData(): WeeklyData {
  if (!cachedWeeklyData) {
    cachedWeeklyData = loadWeeklyData()
  }
  return cachedWeeklyData
}
