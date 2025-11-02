import { notFound } from 'next/navigation'
import { fetchProjectBySlug, fetchProjects } from '@/lib/webflow-client'
import { ProjectDetail } from '@/components/gallery/project-detail'

export async function generateStaticParams() {
  try {
    const projects = await fetchProjects()

    // Filter out any projects without slugs
    const validProjects = projects.filter(p => p.slug)

    if (validProjects.length === 0) {
      console.warn('No projects found for static generation')
      return []
    }

    return validProjects.map((project) => ({
      slug: project.slug,
    }))
  } catch (error) {
    console.warn('Error generating static params:', error)
    return []
  }
}

// Enable dynamic rendering for pages not statically generated
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await fetchProjectBySlug(slug)

  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: `${project.name} | Brandon Mills`,
    description: project['meta-description'],
    openGraph: {
      title: project.name,
      description: project['meta-description'],
      images: [{ url: project['main-image'].url }],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await fetchProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}
