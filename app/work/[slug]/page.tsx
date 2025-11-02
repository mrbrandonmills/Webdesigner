import { notFound } from 'next/navigation'
import { fetchProjectBySlug, fetchProjects } from '@/lib/webflow-client'
import { ProjectDetail } from '@/components/gallery/project-detail'

export async function generateStaticParams() {
  const projects = await fetchProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await fetchProjectBySlug(params.slug)

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

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await fetchProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}
