'use client'
import ChatComponent from "@/components/ChatComponent"
import ChatHistoryOfCollections from "@/components/context/ChatHistoryOfCollections"

import DocumentUpload from "@/components/DocumentUpload"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { authClient } from "@/lib/auth-client"
import { useParams } from "next/navigation"

export default function ResizableDemo() {
    const {data:session} = authClient.useSession()
    const id = session?.user.id
  return (
    <div className="flex-1 h-[calc(100vh-65px)] ">
      <ChatHistoryOfCollections id={id as string}/>
        </div>
  )
}
