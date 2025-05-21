import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Database, Sparkles, Code, Zap, Github } from 'lucide-react'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GITHUB_REPO } from '@/constants/links'
import { PATHS } from '@/constants/paths'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background px-8">
      <div className="flex flex-col container mx-auto">
        {/* Header */}
        <header className="z-40 bg-background">
          <div className="flex h-20 items-center justify-between py-6">
            <div className="flex gap-6 md:gap-10">
              <Link href="/" className="flex items-center space-x-2">
                <Database className="h-6 w-6" />
                <span className="font-bold inline-block">schema.ai</span>
              </Link>
              <nav className="hidden gap-6 md:flex">
                <Link
                  href="#features"
                  className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Características
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton>
                  <Button variant="outline" className="border-primary/20">
                    Iniciar sesión
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="bg-gradient-to-r from-primary to-purple-500">
                    Regístrate gratis
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href={PATHS.SCHEMAS}
                  className="text-sm text-muted-foreground"
                >
                  <p className="text-foreground">Ver mis Esquemas</p>
                </Link>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
            <div className="flex max-w-[64rem] mx-auto flex-col items-center gap-4 text-center">
              <Link
                href={GITHUB_REPO}
                className="rounded-2xl bg-muted/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
                target="_blank"
              >
                Ver en GitHub
              </Link>
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                Construye Bases de Datos{' '}
                <span className="inline-block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  con&nbsp;IA
                </span>
              </h1>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-balance">
                Genera, visualiza y optimiza tus esquemas de base de datos a
                través del lenguaje natural. No más diseño manual de esquemas:
                solo describe lo que necesitas.
              </p>
              <div className="space-x-4">
                <Link href={PATHS.CHAT}>
                  <Button className="bg-gradient-to-r from-primary to-purple-500 px-8">
                    Comenzar
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    className="border-primary/20 px-8 backdrop-blur-sm"
                  >
                    Ver más
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Product Demo/Screenshot Section */}
          <section className="py-8 md:py-12 lg:py-24">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <div className="overflow-hidden rounded-lg border bg-background shadow-xl">
                <img
                  src="https://res.cloudinary.com/dyonw3lkf/image/upload/v1747641488/schema.ai/rf7kuldb0hdbeg2rlzuk.png"
                  width={1200}
                  height={600}
                  alt="Schema.ai product screenshot"
                  className="aspect-video"
                />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="space-y-6 py-8 md:py-12 lg:py-24">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Características
                </span>
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Schema.ai proporciona potentes herramientas para optimizar tu
                flujo de trabajo de diseño de bases de datos
              </p>
            </div>
            <div className="mx-auto grid w-full gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2">
              <Card className="w-full relative overflow-hidden border border-primary/10 bg-gradient-to-b from-background to-background/80 p-2 backdrop-blur-sm py-5">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Generación con IA</CardTitle>
                  <CardDescription>
                    Generación de esquemas de base de datos completos a partir
                    de descripciones en lenguaje natural
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="w-full relative overflow-hidden border border-primary/10 bg-gradient-to-b from-background to-background/80 p-2 backdrop-blur-sm py-5">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    Editor Visual de Esquemas
                  </CardTitle>
                  <CardDescription>
                    Editor visual intuitivo para ajustar tu estructura de base
                    de datos
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="w-full relative overflow-hidden border border-primary/10 bg-gradient-to-b from-background to-background/80 p-2 backdrop-blur-sm py-5">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    Generación de Código
                  </CardTitle>
                  <CardDescription>
                    ¡Exporta tu esquema a SQL, MongoDB y (próximamente) más!
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="w-full relative overflow-hidden border border-primary/10 bg-gradient-to-b from-background to-background/80 p-2 backdrop-blur-sm py-5">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    Optimización de Rendimiento
                  </CardTitle>
                  <CardDescription>
                    Sugerencias de IA para índices y optimizaciones
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* How It Works Section */}
          {/* <section id="how-it-works" className="py-8 md:py-12 lg:py-24">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  How It Works
                </span>
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Building your database schema has never been easier
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
              <div className="relative overflow-hidden rounded-xl border border-primary/10 p-1">
                <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,_var(--tw-gradient-stops))] from-primary/10 via-primary/5 to-primary/10" />
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  width={500}
                  height={400}
                  alt="Describe your schema"
                  className="aspect-video overflow-hidden rounded-lg object-cover object-center"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-gradient-to-r from-primary to-purple-500 px-3 py-1 text-sm text-primary-foreground">
                  Step 1
                </div>
                <h3 className="text-2xl font-bold">Describe Your Schema</h3>
                <p className="text-muted-foreground">
                  Simply describe your database needs in plain English. For example: "I need a blog with users, posts, and
                  comments."
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4 lg:order-last">
                <div className="inline-block rounded-lg bg-gradient-to-r from-primary to-purple-500 px-3 py-1 text-sm text-primary-foreground">
                  Step 2
                </div>
                <h3 className="text-2xl font-bold">Review & Refine</h3>
                <p className="text-muted-foreground">
                  Our AI generates a complete schema. Review the visual representation and make adjustments as needed.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-primary/10 p-1 lg:order-first">
                <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,_var(--tw-gradient-stops))] from-primary/10 via-primary/5 to-primary/10" />
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  width={500}
                  height={400}
                  alt="Review and refine"
                  className="aspect-video overflow-hidden rounded-lg object-cover object-center"
                />
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
              <div className="relative overflow-hidden rounded-xl border border-primary/10 p-1">
                <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,_var(--tw-gradient-stops))] from-primary/10 via-primary/5 to-primary/10" />
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  width={500}
                  height={400}
                  alt="Export your schema"
                  className="aspect-video overflow-hidden rounded-lg object-cover object-center"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-gradient-to-r from-primary to-purple-500 px-3 py-1 text-sm text-primary-foreground">
                  Step 3
                </div>
                <h3 className="text-2xl font-bold">Export & Implement</h3>
                <p className="text-muted-foreground">
                  Export your schema to your preferred format and start building your application right away.
                </p>
              </div>
            </div>
          </section> */}

          {/* CTA Section */}
          <section className="relative py-8 md:py-12 lg:py-24">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  ¿Empezamos ya?
                </span>
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Sé uno de los desarrolladores que están construyendo mejores
                bases de datos más rápido con schema.ai
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-purple-500 px-8"
                  >
                    Regístrate gratis <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href={PATHS.CHAT}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary/20 px-8 backdrop-blur-sm"
                  >
                    Empezar
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t bg-background">
          <div className="flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <Database className="h-6 w-6" />
              <p className="text-center text-sm leading-loose md:text-left">
                © {new Date().getFullYear()} schema.ai
              </p>
            </div>
            <div className="flex gap-4">
              {/* <Link href="/terms" className="text-sm font-medium underline underline-offset-4">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm font-medium underline underline-offset-4">
                Privacy
              </Link> */}
              <Link
                href={GITHUB_REPO}
                className="text-sm font-medium underline underline-offset-4"
              >
                GitHub
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
