import React from 'react'

function DashboardBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen max-h-screen flex flex-col bg-gray-dark no-scrollbar overflow-auto">
      <div className="flex flex-col grow">{children}</div>
    </div>
  )
}

export default DashboardBackground
