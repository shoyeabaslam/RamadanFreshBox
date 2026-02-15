"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Video } from "lucide-react"

interface DeliveryBatch {
  id: number
  delivery_date: string
  location: string
  instagram_url: string
}

interface ApiResponse {
  success: boolean
  data?: {
    batch: DeliveryBatch | null
  }
  error?: string
}

export function TodaysDeliveryReel() {
  const [batch, setBatch] = useState<DeliveryBatch | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTodaysDelivery() {
      try {
        const response = await fetch('/api/delivery-batches')
        const result: ApiResponse = await response.json()
        
        if (result.success && result.data?.batch) {
          setBatch(result.data.batch)
        }
      } catch (err) {
        console.error('Failed to fetch delivery batch:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTodaysDelivery()
  }, [])

  // Don't render section if no batch or still loading
  if (isLoading || !batch) {
    return null
  }

  // Extract Instagram reel ID from URL
  const getInstagramEmbedUrl = (url: string) => {
    // Instagram reel URL format: https://www.instagram.com/reel/CODE/
    const reelRegex = /\/reel\/([^/?]+)/
    const match = reelRegex.exec(url)
    if (match?.[1]) {
      return `https://www.instagram.com/reel/${match[1]}/embed`
    }
    return null
  }

  const embedUrl = getInstagramEmbedUrl(batch.instagram_url)

  if (!embedUrl) {
    return null
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-3">
            <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
           <span className="text-primary">Today's Delivery Updates</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{new Date(batch.delivery_date).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short'
              })}</span>
            </div>
            <span className="text-muted-foreground/50">•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{batch.location}</span>
            </div>
          </div>
        </div>

        {/* Instagram Reel Embed - Compact */}
        <div className="max-w-70 sm:max-w-80 mx-auto">
          <div className="relative bg-muted rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-9/16 w-full">
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                allow="encrypted-media"
                title="Today's Delivery Reel"
              />
            </div>
          </div>

          {/* CTA Below Reel - Compact */}
          <div className="mt-4 text-center">
            <a
              href={batch.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium text-xs sm:text-sm"
            >
              <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              View on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
