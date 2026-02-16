"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Apple } from "lucide-react"
import { box1,box2,box3 } from "@/assets"
import Image from 'next/image'

interface PackageCardProps {
  readonly index: number
  readonly id: number
  readonly name: string
  readonly fruitsLimit: number
  readonly price: number
  readonly highlights: string[]
  readonly isPopular?: boolean
  readonly onSelect: (packageId: number) => void
}

const STANDARD_PACKAGES = [box1,box2,box3]


const getPackageImage = (idx: number) => {
  return STANDARD_PACKAGES[idx % STANDARD_PACKAGES.length]
}

export function PackageCard({
  index,
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
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 p-0 ${isPopular
          ? "border-2 border-primary shadow-xl shadow-primary/20"
          : "border border-border hover:border-primary/50"
        }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute z-1 top-0 right-0 bg-linear-to-br from-primary to-accent text-white px-3 py-1 sm:px-4 rounded-bl-xl sm:rounded-bl-2xl flex items-center gap-1 shadow-lg">
          <Sparkles className="w-3 h-3" />
          <span className="text-[10px] sm:text-xs font-bold">MOST POPULAR</span>
        </div>
      )}

      <CardHeader className="relative text-center pt-4 pl-2 pr-4 overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={getPackageImage(index)}
            alt="Package Box"
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black" />
        </div>

        {/* Content (relative to sit above background) */}
        <div className="relative z-10 min-h-[250px] flex flex-col items-start justify-end">
          {/* Package Name */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight drop-shadow-lg">
            {name}
          </h3>
          <p className="text-xs sm:text-sm text-white/95 mt-1 drop-shadow-md">
            Choose {fruitsLimit} items for your Iftar box
          </p>
          {/* Price */}
          <div className="text-center flex justify-center items-center">
            <div className="flex items-center justify-center gap-1 ">
              <span className="text-xs sm:text-sm text-[#0acf87]">₹</span>
              <span className="text-3xl md:text-4xl font-bold text-[#0acf87]">{price}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#0acf87] mt-1">/per box</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 pb-3 sm:pb-4 px-4 sm:px-6">
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
          className={`w-full text-sm sm:text-base ${isPopular
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
