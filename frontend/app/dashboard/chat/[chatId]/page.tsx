'use client'
import OldChatComponent from '@/components/context/OldChatComponent'
import { authClient } from '@/lib/auth-client'
import { useParams } from 'next/navigation'
import React from 'react'

const ContinueChat = () => {
        const {data:session} = authClient.useSession()
        const id = session?.user.id
        const params  = useParams()
        const chatId = params?.chatId
  return (
    <OldChatComponent id={id as string} chatId={params.chatId as string}/>
  )
}

export default ContinueChat