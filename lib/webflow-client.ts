import { logger } from '@/lib/logger'
/**
 * Webflow CMS API Client
 * Fetches portfolio content for the gallery experience
 */

export interface WebflowImage {
  fileId: string
  url: string
  alt: string | null
}

export interface WebflowProject {
  id: string
  slug: string
  name: string
  description: string
  category: string
  tags: string
  'seo-keywords': string
  'meta-description': string
  'main-image': WebflowImage
  'gallery-images': WebflowImage[]
  createdOn: string
  lastUpdated: string
}

interface WebflowAPIItem {
  id: string
  fieldData: {
    name: string
    slug: string
    description: string
    category: string
    tags: string
    'seo-keywords': string
    'meta-description': string
    'main-image': WebflowImage
    'gallery-images'?: WebflowImage[]
  }
  createdOn: string
  lastUpdated: string
}

interface WebflowAPIResponse {
  items: WebflowAPIItem[]
}

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN
const WEBFLOW_COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID

/**
 * Fetch all published projects from Webflow CMS
 */
export async function fetchProjects(): Promise<WebflowProject[]> {
  if (!WEBFLOW_API_TOKEN || !WEBFLOW_COLLECTION_ID) {
    logger.warn('Missing Webflow credentials - returning empty array for build')
    return []
  }

  try {
    const response = await fetch(
      `https://api.webflow.com/v2/collections/${WEBFLOW_COLLECTION_ID}/items`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
          'accept': 'application/json',
        },
        // Revalidate every hour
        next: { revalidate: 3600 }
      }
    )

    if (!response.ok) {
      logger.warn('Webflow API error: ${response.statusText}')
      return []
    }

    const data: WebflowAPIResponse = await response.json()

    // Map API response to our interface
    return data.items.map(item => ({
      id: item.id,
      slug: item.fieldData.slug,
      name: item.fieldData.name,
      description: item.fieldData.description,
      category: item.fieldData.category,
      tags: item.fieldData.tags,
      'seo-keywords': item.fieldData['seo-keywords'],
      'meta-description': item.fieldData['meta-description'],
      'main-image': item.fieldData['main-image'],
      'gallery-images': item.fieldData['gallery-images'] || [],
      createdOn: item.createdOn,
      lastUpdated: item.lastUpdated,
    }))
  } catch (error) {
    logger.warn('Error fetching Webflow projects:', { data: error })
    return []
  }
}

/**
 * Fetch a single project by slug
 */
export async function fetchProjectBySlug(slug: string): Promise<WebflowProject | null> {
  const projects = await fetchProjects()
  return projects.find(p => p.slug === slug) || null
}

/**
 * Get projects by category
 */
export async function fetchProjectsByCategory(category: string): Promise<WebflowProject[]> {
  const projects = await fetchProjects()
  return projects.filter(p => p.category === category)
}
