'use client'
import ChatComponent from "@/components/ChatComponent"
// import ChatHistoryOfCollections from "@/components/ChatHistoryOfCollections"
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

    <ResizablePanelGroup
      direction="horizontal"
      className="" >
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          {/* // create a form to upload the pdf using react query to /backend/api/upload  */}
          <DocumentUpload id={id as string}/>
        </div>
      </ResizablePanel >
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
      {/* <ChatHistoryOfCollections id={id as string}/> */}

        <ChatComponent id={id as string} />
    
      </ResizablePanel>
    </ResizablePanelGroup>
        </div>
  )
}
