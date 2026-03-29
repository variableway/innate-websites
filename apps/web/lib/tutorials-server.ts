// Server-side only functions for loading tutorials

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { Tutorial } from './tutorials'

const TUTORIALS_DIR = path.join(process.cwd(), 'content/tutorials')

export async function getAllTutorials(): Promise<Tutorial[]> {
  try {
    const files = await fs.readdir(TUTORIALS_DIR)
    const mdxFiles = files.filter(f => f.endsWith('.md'))
    
    const tutorials = await Promise.all(
      mdxFiles.map(async (filename) => {
        const slug = filename.replace(/\.md$/, '')
        const fullPath = path.join(TUTORIALS_DIR, filename)
        const fileContent = await fs.readFile(fullPath, 'utf-8')
        const { data, content } = matter(fileContent)
        
        return {
          slug,
          title: data.title || '',
          description: data.description || '',
          difficulty: data.difficulty || 'beginner',
          time: data.time || '5min',
          tool: data.tool || '',
          prerequisites: data.prerequisites || [],
          content,
        } as Tutorial
      })
    )
    
    return tutorials.sort((a, b) => {
      const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 }
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
    })
  } catch (error) {
    console.error('Error loading tutorials:', error)
    return []
  }
}

export async function getTutorialBySlug(slug: string): Promise<Tutorial | null> {
  try {
    const fullPath = path.join(TUTORIALS_DIR, `${slug}.md`)
    const fileContent = await fs.readFile(fullPath, 'utf-8')
    const { data, content } = matter(fileContent)
    
    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      difficulty: data.difficulty || 'beginner',
      time: data.time || '5min',
      tool: data.tool || '',
      prerequisites: data.prerequisites || [],
      content,
    } as Tutorial
  } catch (error) {
    return null
  }
}
