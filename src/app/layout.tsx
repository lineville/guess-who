import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guess Who ?',
  description: 'Guess Who ?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', justifyContent: 'center' }}>
        <h2>Guess Who ?</h2>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}