"use client"

import { useState, useEffect } from "react"

interface Settings {
  self_cutoff_time: string
  donate_cutoff_time: string
  max_boxes_per_day: string
}

interface ApiResponse {
  success: boolean
  data?: {
    settings: Settings
  }
  error?: string
}

// Convert 24-hour time to 12-hour format (e.g., "18:00" -> "6 PM")
export function formatTime(time24: string): string {
  const [hours] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  return `${hours12} ${period}`
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings')
        const result: ApiResponse = await response.json()
        
        if (result.success && result.data?.settings) {
          setSettings(result.data.settings)
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSettings()
  }, [])

  return { 
    settings, 
    isLoading,
    selfCutoffTime: settings ? formatTime(settings.self_cutoff_time) : '6 PM',
    donateCutoffTime: settings ? formatTime(settings.donate_cutoff_time) : '4 PM',
    maxBoxesPerDay: settings?.max_boxes_per_day || '100'
  }
}
