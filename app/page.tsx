import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect homepage to gallery
  redirect('/gallery')
}
