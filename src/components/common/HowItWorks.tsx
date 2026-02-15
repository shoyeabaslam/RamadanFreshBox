"use client"

import { Package, CheckCircle, Truck, Smile } from "lucide-react"
import { useSettings } from "@/hooks/useSettings"

const steps = [
  {
    icon: Package,
    title: "Choose Your Package",
    description: "Select from 4, 6, or 8 fruit boxes and pick your fresh fruits"
  },
  {
    icon: CheckCircle,
    title: "Select Order Type",
    description: "Order for yourself, donate to a mosque, or sponsor in bulk"
  },
  {
    icon: Truck,
    title: "We Pack & Deliver",
    description: "Hygienically packed and delivered fresh before Maghrib prayer"
  },
  {
    icon: Smile,
    title: "Break Your Fast",
    description: "Enjoy premium quality fruits for a blessed Iftar meal"
  }
]

export function HowItWorks() {
  const { selfCutoffTime, donateCutoffTime } = useSettings()

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Simple, fast, and fresh - get your Iftar fruit box in 4 easy steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="relative group"
              >
                {/* Connector Line (hidden on mobile, shown on lg+) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-primary/20 -z-10">
                    <div className="h-full bg-primary/40 w-0 group-hover:w-full transition-all duration-500" />
                  </div>
                )}

                {/* Step Card */}
                <div className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-xl hover:bg-background transition-colors duration-300">
                  {/* Step Number */}
                  <div className="relative inline-block">
                    <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                      {index + 1}
                    </div>
                    
                    {/* Icon */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-10 sm:mt-12 md:mt-16 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Order before <span className="font-bold text-primary">{selfCutoffTime}</span> for same-day delivery • 
            Cutoff for Donate/Sponsor: <span className="font-bold text-primary">{donateCutoffTime}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
