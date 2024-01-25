import type { Metadata } from 'next'
import { Providers } from './providers'
import { Center, Container, Heading, Spacer } from '@chakra-ui/react'

export const metadata: Metadata = {
  title: 'Guess Who?',
  description: 'Guess Who?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Container>
            <Center>
              <Heading mt={4}>{metadata.title as string}</Heading>
            </Center>
            <Spacer />
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  )
}