import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Database, Sparkles, Code, Zap, Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GITHUB_REPO } from "@/constants/links"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
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
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  How It Works
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
            <div className="flex max-w-[64rem] mx-auto flex-col items-center gap-4 text-center">
              <Link
                href={GITHUB_REPO}
                className="rounded-2xl bg-muted/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
                target="_blank"
              >
                Follow along on GitHub
              </Link>
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="inline-block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Build Database Schemas
                </span>{" "}
                with AI
              </h1>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Generate, visualize, and optimize your database schemas through natural language. No more manual schema
                design - just describe what you need.
              </p>
              <div className="space-x-4">
                <Link href="/demo">
                  <Button className="bg-gradient-to-r from-primary to-purple-500 px-8">Get Started</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="border-primary/20 px-8 backdrop-blur-sm">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Product Demo/Screenshot Section */}
          <section className="py-8 md:py-12 lg:py-24">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <div className="overflow-hidden rounded-lg border bg-background shadow-xl">
                <Image
                  src="/placeholder.svg?height=600&width=1200"
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
                  Features
                </span>
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Schema.ai provides powerful tools to streamline your database design workflow
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
              <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-b from-background to-background/80 p-2 backdrop-blur-sm">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">AI-Powered Generation</CardTitle>
                  <CardDescription>Generate complete database schemas from natural language descriptions</CardDescription>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-b from-background to-background/80 p-2 backdrop-blur-sm">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Visual Schema Editor</CardTitle>
                  <CardDescription>Intuitive visual editor for fine-tuning your database structure</CardDescription>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-b from-background to-background/80 p-2 backdrop-blur-sm">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Code Generation</CardTitle>
                  <CardDescription>Export your schema to SQL, Prisma, TypeORM, and more</CardDescription>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-b from-background to-background/80 p-2 backdrop-blur-sm">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Performance Optimization</CardTitle>
                  <CardDescription>AI suggestions for indexes and optimizations</CardDescription>
                </CardHeader>
              </Card>
              <Card className="relative overflow-hidden border border-primary/10 bg-gradient-to-b from-background to-background/80 p-2 backdrop-blur-sm sm:col-span-2 md:col-span-1">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                    <Github className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Version Control</CardTitle>
                  <CardDescription>Track changes and collaborate with your team</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-8 md:py-12 lg:py-24">
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
                <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,_var(--tw-gradient-stops))] from-primary/10 via-primary/5 to-primary/10"></div>
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
                <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,_var(--tw-gradient-stops))] from-primary/10 via-primary/5 to-primary/10"></div>
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
                <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,_var(--tw-gradient-stops))] from-primary/10 via-primary/5 to-primary/10"></div>
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
          </section>

          {/* CTA Section */}
          <section className="relative py-8 md:py-12 lg:py-24">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Ready to Get Started?
                </span>
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Join thousands of developers who are building better databases faster with schema.ai
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-purple-500 px-8">
                    Sign Up Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" size="lg" className="border-primary/20 px-8 backdrop-blur-sm">
                    Try Demo
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
