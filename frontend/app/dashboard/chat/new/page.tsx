'use client'

import ContextChatComponent from "@/components/context/ContextChatComponent"
import DocumentUpload from "@/components/DocumentUpload"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { authClient } from "@/lib/auth-client"
import { useParams } from "next/navigation"

export default function ResizableDemo() {
    const {data:session,isPending} = authClient.useSession()
    const id = session?.user.id
    if(isPending){
      <div>Loading</div>
    }
  return (
    <div className="flex-1 h-[calc(100vh-65px)] ">
        <ContextChatComponent id={id as string} />
        </div>
  )
}
