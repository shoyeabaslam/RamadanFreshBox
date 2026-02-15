"use client"

import { Phone, MessageCircle, Clock } from "lucide-react"
import { useSettings } from "@/hooks/useSettings"

export function CTASection() {
  const { selfCutoffTime, donateCutoffTime } = useSettings()

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-linear-to-br from-primary/10 via-accent/5 to-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
            Ready to Order Your
            <br className="sm:hidden" />
            <span className="text-primary"> Fresh Iftar Box?</span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Order before {selfCutoffTime} for same-day delivery. Choose from premium quality seasonal fruits, 
            delivered fresh and hygienically packed to your doorstep.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-10">
            <a
              href="https://wa.me/918309644110"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-xl transition-all duration-300 font-semibold text-base sm:text-lg"
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              Order via WhatsApp
            </a>
            
            <a
              href="tel:+918309644110"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-300 font-semibold text-base sm:text-lg"
            >
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              Call Us Now
            </a>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
            <div className="bg-background/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
              <h3 className="text-sm sm:text-base font-bold text-foreground mb-1">
                Order Cutoff
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {selfCutoffTime} for Self Orders
                <br />
                {donateCutoffTime} for Donate/Sponsor
              </p>
            </div>

            <div className="bg-background/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
              <h3 className="text-sm sm:text-base font-bold text-foreground mb-1">
                Quick Response
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                WhatsApp support
                <br />
                Instant confirmation
              </p>
            </div>

            <div className="bg-background/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border">
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
              <h3 className="text-sm sm:text-base font-bold text-foreground mb-1">
                Call Anytime
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                +91 830 964 4110
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
