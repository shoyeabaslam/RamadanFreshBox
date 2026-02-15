"use client"

import { User, Heart, Users, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export type OrderType = 'self' | 'donate' | 'sponsor'

interface OrderTypeSelectorProps {
  readonly selectedType: OrderType | null
  readonly onSelectType: (type: OrderType) => void
}

const orderTypes = [
  {
    type: 'self' as OrderType,
    icon: User,
    title: 'Order for Myself',
    description: 'Fresh Iftar fruit boxes delivered before Maghrib in Hyderabad',
    features: [
      'Select your fruit box and quantity',
      'Choose preferred delivery address',
      'Hygienic packing with same-day delivery'
    ],
    color: 'primary'
  },
  {
    type: 'donate' as OrderType,
    icon: Heart,
    title: 'Donate an Iftar Box',
    description: 'Send fresh Iftar fruit boxes to a mosque or chosen location',
    features: [
      'Minimum 10 boxes',
      'Choose donation location',
      'Delivered before Maghrib',
      'Transparent distribution updates'
    ],
    color: 'green-600',
    badge: 'Sadaqah'
  },
  {
    type: 'sponsor' as OrderType,
    icon: Users,
    title: 'Sponsor Iftar Boxes',
    description: 'Sponsor bulk fruit boxes for mosques or community distribution',
    features: [
      'Minimum 10 boxes',
      'Bulk sponsorship support',
      'Your name or brand added on the boxes',
      'Direct coordination via WhatsApp'
    ],
    color: 'purple-600',
    badge: 'Bulk Order'
  }
]


export function OrderTypeSelector({ selectedType, onSelectType }: OrderTypeSelectorProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Choose <span className="text-primary">Order Type</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Select how you'd like to receive or share your fresh fruit box
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {orderTypes.map((orderType) => {
          const Icon = orderType.icon
          const isSelected = selectedType === orderType.type
          
          return (
            <Card
              key={orderType.type}
              className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl ${
                isSelected
                  ? 'border-2 border-primary shadow-lg ring-2 ring-primary/20'
                  : 'border border-border hover:border-primary/50'
              }`}
              onClick={() => onSelectType(orderType.type)}
            >
              {/* Selected Check Mark */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg z-10">
                  <Check className="w-5 h-5 text-primary-foreground" />
                </div>
              )}

              {/* Badge */}
              {orderType.badge && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold px-2 py-1 bg-accent/20 text-accent rounded-full">
                    {orderType.badge}
                  </span>
                </div>
              )}

              <CardContent className="p-6">
                {/* Icon */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-${orderType.color}/10 flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 text-${orderType.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  {orderType.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  {orderType.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {orderType.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
