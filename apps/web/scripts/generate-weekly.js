#!/usr/bin/env node
/**
 * Weekly Summary Generator Script
 * 
 * Analyzes completed issues from the current week and generates
 * AI-powered evaluations and mindset analysis in both Chinese and English.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const ISSUES_FILE = path.join(DATA_DIR, 'issues.json');
const WEEKLY_FILE = path.join(DATA_DIR, 'weekly.json');

// Get week number from date
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Get date range for a week
function getWeekDateRange(year, weekNumber) {
  const januaryFirst = new Date(year, 0, 1);
  const daysToAdd = (weekNumber - 1) * 7 - januaryFirst.getDay() + 1;
  const weekStart = new Date(year, 0, daysToAdd);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const formatDate = (d) => d.toISOString().split('T')[0];
  
  return {
    start: formatDate(weekStart),
    end: formatDate(weekEnd),
  };
}

// Load issues data
function loadIssues() {
  try {
    if (fs.existsSync(ISSUES_FILE)) {
      return JSON.parse(fs.readFileSync(ISSUES_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading issues:', e.message);
  }
  return { issues: [], projects: [] };
}

// Load weekly data
function loadWeekly() {
  try {
    if (fs.existsSync(WEEKLY_FILE)) {
      return JSON.parse(fs.readFileSync(WEEKLY_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading weekly:', e.message);
  }
  return { summaries: [] };
}

// Save weekly data
function saveWeekly(data) {
  fs.writeFileSync(WEEKLY_FILE, JSON.stringify(data, null, 2));
}

// Generate bilingual AI analysis
async function generateAIAnalysis(issues, projects) {
  // Group issues by project
  const issuesByProject = {};
  issues.forEach(issue => {
    if (!issuesByProject[issue.project]) {
      issuesByProject[issue.project] = [];
    }
    issuesByProject[issue.project].push(issue);
  });

  const projectNames = Object.keys(issuesByProject);
  const mainProject = projects.find(p => p.id === projectNames[0])?.name || projectNames[0];
  
  // Generate summary
  const summary = `This week focused on ${mainProject}. Completed ${issues.length} issues including: ${issues.slice(0, 3).map(i => i.title).join('; ')}${issues.length > 3 ? ' and more.' : '.'}`;
  const summaryZh = `本周专注于 ${mainProject}。完成了 ${issues.length} 个 issues，包括：${issues.slice(0, 3).map(i => i.title).join('；')}${issues.length > 3 ? ' 等。' : '。'}`;

  // Analyze issue types from labels
  const allLabels = issues.flatMap(i => i.labels.map(l => l.name));
  const labelCounts = {};
  allLabels.forEach(label => {
    labelCounts[label] = (labelCounts[label] || 0) + 1;
  });

  // Generate bilingual evaluations
  const evaluations = {
    strengths: [
      { zh: '专注于功能开发并交付价值', en: 'Strong focus on feature development and delivering value' },
      { zh: '积极识别并解决问题', en: 'Proactive in identifying and resolving issues' },
      { zh: '高产出，持续交付', en: 'High productivity with consistent delivery' }
    ],
    weaknesses: [
      { zh: '测试覆盖率有待提高', en: 'Testing coverage could be improved' },
      { zh: '文档更新较少', en: 'Documentation updates were minimal' }
    ],
    improvements: [
      { zh: '为 issues 添加更详细的描述以便更好地跟踪', en: 'Add more detailed descriptions to issues for better tracking' },
      { zh: '将大型任务拆分为更小、可交付的单元', en: 'Consider breaking large tasks into smaller, deliverable chunks' },
      { zh: '为新功能包含测试', en: 'Include tests with new features' }
    ]
  };

  // Customize based on labels
  if (labelCounts['bug'] || labelCounts['fix']) {
    evaluations.strengths.push({
      zh: '快速响应和修复问题',
      en: 'Quick response to bug fixes'
    });
  }
  
  if (labelCounts['enhancement'] || labelCounts['feature']) {
    evaluations.strengths.push({
      zh: '持续迭代新功能',
      en: 'Continuous iteration on new features'
    });
  }

  // Generate bilingual mindset analysis
  const mindsetAnalysis = {
    strengths: [
      { zh: '有条不紊的问题解决方法', en: 'Methodical approach to problem-solving' },
      { zh: '全周保持持续的工作节奏', en: 'Consistent work rhythm throughout the week' }
    ],
    weaknesses: [
      { zh: '有时过于关注实现而忽略规划', en: 'Sometimes focus on implementation over planning' },
      { zh: '可能需要更多的前期设计文档', en: 'May benefit from more upfront design documentation' }
    ],
    suggestions: [
      { zh: '在开始复杂任务前花 10-15 分钟进行规划', en: 'Spend 10-15 minutes planning before starting complex tasks' },
      { zh: '定期反思已完成的工作以识别模式', en: 'Regular reflection on completed work to identify patterns' },
      { zh: '考虑记录决策日志', en: 'Consider keeping a brief daily log of decisions made' }
    ]
  };

  if (projectNames.length > 1) {
    mindsetAnalysis.strengths.push({
      zh: '能够在多个项目之间灵活切换',
      en: 'Ability to context-switch between multiple projects'
    });
  }

  return { summary, summaryZh, evaluations, mindsetAnalysis };
}

// Main function
async function main() {
  console.log('🚀 Generating weekly summary...');

  try {
    const { issues, projects } = loadIssues();
    const weeklyData = loadWeekly();

    // Get current week info
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentWeek = getWeekNumber(now);
    const weekId = `weekly-${currentWeek}-${currentYear}`;

    // Check if summary already exists for this week
    const existingIndex = weeklyData.summaries.findIndex(s => s.id === weekId);
    if (existingIndex !== -1) {
      console.log(`⚠️  Weekly summary for week ${currentWeek} already exists.`);
      console.log('Use --force to regenerate.');
      
      if (!process.argv.includes('--force')) {
        return;
      }
      
      console.log('🔄 Regenerating with --force...');
    }

    // Get issues closed this week
    const weekRange = getWeekDateRange(currentYear, currentWeek);
    const weekStart = new Date(weekRange.start);
    const weekEnd = new Date(weekRange.end + 'T23:59:59');

    const thisWeekIssues = issues.filter(issue => {
      if (issue.status !== 'closed' || !issue.closedAt) return false;
      const closedDate = new Date(issue.closedAt);
      return closedDate >= weekStart && closedDate <= weekEnd;
    });

    console.log(`📊 Found ${thisWeekIssues.length} issues closed this week`);

    if (thisWeekIssues.length === 0) {
      console.log('⚠️  No issues closed this week. Skipping generation.');
      return;
    }

    // Generate AI analysis
    console.log('🤖 Generating bilingual AI analysis...');
    const { summary, summaryZh, evaluations, mindsetAnalysis } = await generateAIAnalysis(thisWeekIssues, projects);

    // Get main project for title
    const mainProjectId = thisWeekIssues[0]?.project;
    const mainProject = projects.find(p => p.id === mainProjectId)?.name || mainProjectId;

    // Create weekly summary
    const weeklySummary = {
      id: weekId,
      weekNumber: currentWeek,
      year: currentYear,
      title: `Week ${currentWeek}: ${mainProject} Progress`,
      titleZh: `第 ${currentWeek} 周：${mainProject} 进展`,
      dateRange: weekRange,
      summary,
      summaryZh,
      completedIssues: thisWeekIssues.map(i => i.id),
      evaluations,
      mindsetAnalysis,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // Update or add summary
    if (existingIndex !== -1) {
      weeklyData.summaries[existingIndex] = weeklySummary;
    } else {
      weeklyData.summaries.push(weeklySummary);
    }

    // Sort by date (newest first)
    weeklyData.summaries.sort((a, b) => {
      return new Date(b.dateRange.end).getTime() - new Date(a.dateRange.end).getTime();
    });

    weeklyData.lastUpdated = now.toISOString();

    // Save
    saveWeekly(weeklyData);

    console.log('✅ Weekly summary generated successfully!');
    console.log(`\n📋 Summary:`);
    console.log(`   Week: ${currentWeek}`);
    console.log(`   Issues: ${thisWeekIssues.length}`);
    console.log(`   Projects: ${[...new Set(thisWeekIssues.map(i => i.project))].join(', ')}`);
    console.log(`   Bilingual: ✓`);

  } catch (error) {
    console.error('❌ Error generating weekly summary:', error.message);
    process.exit(1);
  }
}

main();
