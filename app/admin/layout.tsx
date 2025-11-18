// Force all admin pages to be dynamic (no static generation)
// This prevents "window is not defined" errors during build
export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
