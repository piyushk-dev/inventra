"use client"

import Image from "next/image"

export function WalmartLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image src="/walmart-logo.svg" alt="Walmart" width={120} height={32} className="h-8 w-auto" />
      <div className="h-8 w-px bg-gray-300" />
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-[#004c91]">Supply Chain AI</span>
        <span className="text-xs text-gray-600 -mt-1">Enterprise Command Center</span>
      </div>
    </div>
  )
}
