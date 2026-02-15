"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Fruit {
  id: number
  name: string
  is_available: boolean
}

interface ApiResponse {
  success: boolean
  data?: {
    fruits: Fruit[]
  }
  error?: string
}

interface FruitPickerProps {
  readonly packageLimit: number
  readonly selectedFruits: number[]
  readonly onFruitsChange: (fruitIds: number[]) => void
}

export function FruitPicker({ packageLimit, selectedFruits, onFruitsChange }: FruitPickerProps) {
  const [fruits, setFruits] = useState<Fruit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFruits() {
      try {
        const response = await fetch('/api/fruits')
        const result: ApiResponse = await response.json()
        
        if (result.success && result.data?.fruits) {
          setFruits(result.data.fruits)
          
          // Auto-select first N fruits if no fruits are selected yet
          if (selectedFruits.length === 0 && result.data.fruits.length > 0) {
            const autoSelected = result.data.fruits
              .slice(0, packageLimit)
              .map(fruit => fruit.id)
            
            onFruitsChange(autoSelected)
          }
        } else {
          setError(result.error || 'Failed to load fruits')
        }
      } catch (err) {
        console.error('Failed to fetch fruits:', err)
        setError('Unable to connect to server')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchFruits()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFruitToggle = (fruitId: number) => {
    if (selectedFruits.includes(fruitId)) {
      // Remove fruit
      onFruitsChange(selectedFruits.filter(id => id !== fruitId))
      return
    }
    
    // Add fruit if limit not reached
    if (selectedFruits.length < packageLimit) {
      onFruitsChange([...selectedFruits, fruitId])
    }
  }

  const remainingSlots = packageLimit - selectedFruits.length

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => globalThis.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Select Your <span className="text-primary">Box Items</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Choose {packageLimit} items for your Iftar box from our available options
          </p>
          <p className="text-xs sm:text-sm text-primary font-semibold mt-1">
            Additional essentials as listed in your package will be included
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <span className="text-sm font-medium text-muted-foreground">Selected:</span>
          <span className="text-lg font-bold text-primary">
            {selectedFruits.length} / {packageLimit}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(selectedFruits.length / packageLimit) * 100}%` }}
        />
      </div>

      {/* Remaining Notice */}
      {remainingSlots > 0 && (
        <div className="text-center py-2 px-4 bg-accent/10 rounded-lg">
          {remainingSlots === packageLimit ? (
            <p className="text-xs sm:text-sm text-accent font-medium">
              Please select {packageLimit} items to continue
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-accent font-medium">
              Select {remainingSlots} more item{remainingSlots === 1 ? '' : 's'}
            </p>
          )}
        </div>
      )}

      {remainingSlots === 0 && (
        <div className="text-center py-2 px-4 bg-primary/10 rounded-lg">
          <p className="text-xs sm:text-sm text-primary font-medium">
            ✓ All items selected! You can change your selection or continue.
          </p>
        </div>
      )}

      {/* Fruits Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {fruits.map((fruit) => {
          const isSelected = selectedFruits.includes(fruit.id)
          const isDisabled = !fruit.is_available || (selectedFruits.length >= packageLimit && !isSelected)
          
          let cardClassName = 'relative cursor-pointer transition-all duration-300 '
          if (isSelected) {
            cardClassName += 'border-2 border-primary shadow-lg bg-primary/5'
          } else if (isDisabled) {
            cardClassName += 'border border-border opacity-50 cursor-not-allowed'
          } else {
            cardClassName += 'border border-border hover:border-primary/50 hover:shadow-md'
          }

          return (
            <Card
              key={fruit.id}
              className={cardClassName}
              onClick={() => !isDisabled && handleFruitToggle(fruit.id)}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg z-10">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}

              <CardContent className="p-4 text-center">
                {/* Fruit Name */}
                <h3 className="text-sm sm:text-base font-semibold text-foreground">
                  {fruit.name}
                </h3>

                {/* Availability Status */}
                {!fruit.is_available && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Out of stock
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Helper function removed - no longer using emojis
