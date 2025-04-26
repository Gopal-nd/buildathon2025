'use client'

import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { ChevronRight, Fan } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import hero from '../assete/herosection.webp'
export default  function LandingPage() {
  const { 
    data: session, 
    isPending, //loading state
    error, //error object
    refetch //refetch the session
} = authClient.useSession() 

  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto ">
      <header className="px-4 lg:px-6 h-14 flex items-center  border-b py-4">
        <Link className="flex items-center justify-center" href="/">
          <span className="text-2xl font-bold text-primary flex gap-1 items-center"><Fan /> AGRO AI</span>
        </Link>
        <div className="ml-auto flex item-center gap-4 ">
        <ModeToggle />
        {session?.user ?
        <Link href={'/dashboard'}>
          <Button >Dashboard</Button>
        </Link>:
        <Link href={'/login'}>
          <Button >Login</Button>
        </Link>
        }
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 border-b">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    AGRO AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Weather forecast/ Prediction System
                  </p>
                </div>
              </div>
              <Image
                alt="Hero Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="550"
                src={hero}
                width="550"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}