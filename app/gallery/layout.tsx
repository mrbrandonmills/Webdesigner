import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import { CustomCursor } from '@/components/custom-cursor'

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CustomCursor />
      <SmoothScrollProvider>
        {children}
      </SmoothScrollProvider>
    </>
  )
}
