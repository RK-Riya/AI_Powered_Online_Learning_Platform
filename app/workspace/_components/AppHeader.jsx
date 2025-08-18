import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'   // ✅ fixed import

function AppHeader() {
  return (
    <div className='p-5 flex justify-between items-center shadow-sm'>
      <SidebarTrigger />
      <UserButton />
    </div>
  )
}

export default AppHeader
