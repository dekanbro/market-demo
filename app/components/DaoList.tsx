'use client'

import { useState, useEffect } from 'react'

export function DaoList() {
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMessage() {
      try {
        console.log("fetching message")
        const res = await fetch('/api/daos')
        const data = await res.json()
        setMessage(data.message)
      } catch (error) {
        setError('Failed to fetch message')
      }
    }

    fetchMessage()
  }, [])

  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <h2>{message}</h2>
    </div>
  )
} 