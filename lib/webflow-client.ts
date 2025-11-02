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

export interface WebflowResponse {
  items: WebflowProject[]
}

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN
const WEBFLOW_COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID

/**
 * Fetch all published projects from Webflow CMS
 */
export async function fetchProjects(): Promise<WebflowProject[]> {
  if (!WEBFLOW_API_TOKEN || !WEBFLOW_COLLECTION_ID) {
    throw new Error('Missing Webflow credentials')
  }

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
    throw new Error(`Webflow API error: ${response.statusText}`)
  }

  const data: WebflowResponse = await response.json()
  return data.items
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
