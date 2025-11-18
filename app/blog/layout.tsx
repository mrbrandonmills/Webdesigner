// Force all blog pages to be dynamic (no static generation)
// This prevents "window is not defined" errors during build from components
export const dynamic = 'force-dynamic'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
