"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Apple } from "lucide-react"

interface PackageCardProps {
  readonly id: number
  readonly name: string
  readonly fruitsLimit: number
  readonly price: number
  readonly highlights: string[]
  readonly isPopular?: boolean
  readonly onSelect: (packageId: number) => void
}

export function PackageCard({
  id,
  name,
  fruitsLimit,
  price,
  highlights,
  isPopular = false,
  onSelect,
}: PackageCardProps) {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 ${
        isPopular
          ? "border-2 border-primary shadow-xl shadow-primary/20"
          : "border border-border hover:border-primary/50"
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 right-0 bg-linear-to-br from-primary to-accent text-white px-3 py-1 sm:px-4 rounded-bl-xl sm:rounded-bl-2xl flex items-center gap-1 shadow-lg">
          <Sparkles className="w-3 h-3" />
          <span className="text-[10px] sm:text-xs font-bold">MOST POPULAR</span>
        </div>
      )}

      <CardHeader className="text-center pb-3 sm:pb-4 pt-4 sm:pt-6 px-4 sm:px-6">
        {/* Package Icon */}
        <div
          className={`mx-auto mb-3 sm:mb-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${
            isPopular
              ? "bg-linear-to-br from-primary/20 to-accent/20 border-2 border-primary"
              : "bg-primary/10 border-2 border-primary/30"
          }`}
        >
          <Apple className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        </div>

        {/* Package Name */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight">
          {name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Choose {fruitsLimit} items for your Iftar box
        </p>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 pb-3 sm:pb-4 px-4 sm:px-6">
        {/* Price */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs sm:text-sm text-muted-foreground">₹</span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">{price}</span>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">per box</p>
        </div>

        {/* Features List */}
        <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-border">
          {highlights.map((highlight) => (
            <div key={highlight} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {highlight}
              </p>
            </div>
          ))}
          <div className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Delivered before Maghrib
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4 sm:pb-6 px-4 sm:px-6">
        <Button
          onClick={() => onSelect(id)}
          className={`w-full text-sm sm:text-base ${
            isPopular
              ? "bg-linear-to-r from-primary to-accent hover:shadow-lg"
              : ""
          }`}
          size="lg"
        >
          Select Package
        </Button>
      </CardFooter>
    </Card>
  )
}
