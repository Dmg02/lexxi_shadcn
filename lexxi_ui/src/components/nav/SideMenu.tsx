"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Triangle, 
  SquareTerminal, 
  Handshake, 
  Settings2, 
  LifeBuoy, 
  SquareUser,
  Users,
  Menu,
  X,
  Search,
  Scale
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', href: '/main', icon: SquareTerminal },
  { name: 'Mi Despacho', href: '/my_practice', icon: Handshake },
  { name: 'Mis Asuntos', href: '/my_trials', icon: Scale },
  { name: 'Clientes', href: '/customers', icon: Users },
  { name: 'Encuentra un Juicio', href: '/search_trials', icon: Search },
  { name: 'Settings', href: '/settings', icon: Settings2 },
]

const bottomMenuItems = [
  { name: 'Help', href: '/help', icon: LifeBuoy },
  { name: 'Account', href: '/account', icon: SquareUser },
]

export function SideMenu() {  
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    if (!mobile) {
      setIsExpanded(false)
    }
  }, [])

  useEffect(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [checkMobile])

  const toggleMenu = () => setIsExpanded((prev) => !prev)

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsExpanded(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsExpanded(false)
    }
  }

  return (
    <TooltipProvider>
      <>
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMenu}
            className="fixed top-4 left-4 z-30"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-20 flex h-full flex-col bg-background transition-all duration-300",
            isExpanded ? "w-64" : "w-[56px]",
            isMobile && !isExpanded && "-translate-x-full"
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-between p-2">
            <Button variant="outline" size="icon" aria-label="Home">
              <Triangle className="h-5 w-5 fill-foreground" />
            </Button>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          <nav className="grid gap-1 p-2">
            {menuItems.map((item) => (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={item.href} className="block">
                    <Button
                      variant="ghost"
                      size="default"
                      className={cn(
                        "w-full justify-start",
                        pathname === item.href && "bg-muted",
                        !isExpanded && "w-[40px] p-0"
                      )}
                      aria-label={item.name}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {isExpanded && <span className="ml-2 truncate">{item.name}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  {item.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
          <nav className="mt-auto grid gap-1 p-2">
            {bottomMenuItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href} className="block">
                    <Button
                      variant="ghost"
                      size="default"
                      className={cn(
                        "w-full justify-start",
                        !isExpanded && "w-[40px] p-0"
                      )}
                      aria-label={item.name}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {isExpanded && <span className="ml-2 truncate">{item.name}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  {item.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </aside>
      </>
    </TooltipProvider>
  )
}