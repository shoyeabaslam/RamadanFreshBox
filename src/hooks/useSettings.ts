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

// Check if current time has exceeded cutoff time
export function isCutoffTimePassed(cutoffTime: string, deliveryDate: string): boolean {
  const now = new Date()
  const delivery = new Date(deliveryDate)
  
  // If delivery is not today, cutoff doesn't apply
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  delivery.setHours(0, 0, 0, 0)
  
  if (delivery.getTime() !== today.getTime()) {
    return false
  }
  
  // Parse cutoff time (format: "HH:MM")
  const [cutoffHours, cutoffMinutes] = cutoffTime.split(':').map(Number)
  
  // Get current time
  const currentHours = now.getHours()
  const currentMinutes = now.getMinutes()
  
  // Convert to minutes for easier comparison
  const currentTotalMinutes = currentHours * 60 + currentMinutes
  const cutoffTotalMinutes = cutoffHours * 60 + cutoffMinutes
  
  return currentTotalMinutes >= cutoffTotalMinutes
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
