"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PackageCard } from "./PackageCard"
import { cannotDelivery } from "@/assets"

interface Package {
  id: number
  name: string
  fruits_limit: number
  price: number
  highlights: string[]
  display_order: number
}

interface ApiResponse {
  success: boolean
  data?: {
    packages: Package[]
  }
  error?: string
}

export function PackagesSection() {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await fetch('/api/packages')
        const result: ApiResponse = await response.json()
        
        if (result.success && result.data?.packages) {
          // Packages are already filtered and sorted by the API
          setPackages(result.data.packages)
        } else {
          setError(result.error || 'Failed to load packages')
        }
      } catch (err) {
        console.error('Failed to fetch packages:', err)
        setError('Unable to connect to server')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPackages()
  }, [])

  const handlePackageSelect = (packageId: number) => {
    router.push(`/order?package=${packageId}`)
  }

  // Error State
  if (error) {
    return (
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto">
            <div className="mb-6 flex justify-center">
              <Image 
                src={cannotDelivery} 
                alt="Service unavailable" 
                width={200}
                height={200}
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
              />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
              Oops! Something Went Wrong
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-2">
              We couldn't load our fresh fruit packages right now.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              {error}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={() => globalThis.location.reload()}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Try Again
              </button>
              <a
                href="https://wa.me/918309644110"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              Need help? Chat with us on WhatsApp for instant support
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Loading State
  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="h-6 sm:h-8 bg-muted rounded w-48 sm:w-64 mx-auto mb-3 sm:mb-4 animate-pulse" />
            <div className="h-3 sm:h-4 bg-muted rounded w-64 sm:w-80 md:w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 sm:h-112.5 md:h-125 bg-muted rounded-xl sm:rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Empty State
  if (packages.length === 0) {
    return (
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-lg mx-auto">
            <div className="mb-6 flex justify-center">
              <Image 
                src={cannotDelivery} 
                alt="No packages available" 
                width={200}
                height={200}
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
              />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
              No Packages Available Right Now
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-2">
              We're currently updating our fresh fruit packages for Ramadan.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              Check back soon or contact us directly to place your order!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={() => globalThis.location.reload()}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Refresh
              </button>
              <a
                href="https://wa.me/918309644110"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order via WhatsApp
              </a>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              Connect with us on WhatsApp for personalized assistance
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight px-4">
            Choose Your{" "}
            <span className="text-primary">Iftar Fresh Box</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
            Select from our complete Iftar boxes with fresh fruits, dates, cool drinks and more.
            <br className="hidden sm:block" />
            Delivered fresh before Maghrib. Order for yourself, donate to a mosque, or sponsor in bulk.
          </p>
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              id={pkg.id}
              name={pkg.name}
              fruitsLimit={pkg.fruits_limit}
              price={pkg.price}
              highlights={pkg.highlights}
              isPopular={index === 1} // Middle package is popular
              onSelect={handlePackageSelect}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 sm:mt-14 md:mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6  mx-auto text-center px-4">
          <div className="space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg hover:bg-primary/5 transition-colors">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">100%</div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-tight">Fresh & Hygienic</p>
          </div>
          <div className="space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg hover:bg-primary/5 transition-colors">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Before Maghrib</div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-tight">Delivery Guarantee</p>
          </div>
          <div className="space-y-1 sm:space-y-2 p-3 sm:p-4 rounded-lg hover:bg-primary/5 transition-colors">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Complete Box</div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-tight">Fruits, Dates & More</p>
          </div>
        </div>
      </div>
    </section>
  )
}
