'use client'
import Logout from "@/components/LogoutButton"
import { Button } from "@/components/ui/button"

import { authClient } from "@/lib/auth-client" // import the auth client
import Link from "next/link"
 
export default  function Home() {
  
  const { 
    data: session, 
    isPending, //loading state
    error, //error object
    refetch //refetch the session
} = authClient.useSession() 

  return (
    <div>{
        isPending ? "Loading..." : ""
        }
        {
            error ? "Error" : ""
        }
        {
            session ? <>
             <h1>{JSON.stringify(session)}</h1>
             <Logout /></>: <Link href={"/sign-in"}>Sign in</Link>
        }
    </div>
  )
}
