// Force ALL API routes to be dynamic (no static generation)
// API routes should NEVER be statically generated
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function ApiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
