import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen flex flex-col">{children}</div>
}
