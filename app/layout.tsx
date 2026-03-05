import type { ReactNode } from 'react'

// Bare root layout — actual HTML is rendered by [locale]/layout.tsx or admin/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
