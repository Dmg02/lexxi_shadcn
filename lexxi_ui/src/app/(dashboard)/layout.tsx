'use client'

import { useAuth } from '@/context/useAuth'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/nav/Navbar'
import { SideMenu } from '@/components/nav/SideMenu'
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen">
      <SideMenu />
      <div className="flex-1 transition-all duration-300">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}