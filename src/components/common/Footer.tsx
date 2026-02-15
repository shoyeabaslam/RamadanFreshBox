"use client"

import { Phone, Mail, MapPin, Heart } from "lucide-react"
import { useSettings } from "@/hooks/useSettings"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { selfCutoffTime, donateCutoffTime } = useSettings()

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-primary">
              Ramadan Fresh Box
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium quality fresh fruits delivered to your doorstep every day during Ramadan. 
              Order, Donate, or Sponsor - making Iftar special for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#packages" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Packages
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="https://wa.me/918309644110" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Order Now
                </a>
              </li>
              <li>
                <a href="#donate" className="text-muted-foreground hover:text-primary transition-colors">
                  Donate/Sponsor
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-foreground">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <a href="tel:+918309644110" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 830 964 4110
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <a href="mailto:ramadanfreshbox@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                  ramadanfreshbox@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  Hyderabad, Telangana
                </span>
              </li>
            </ul>
          </div>

          {/* Service Hours */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-foreground">
              Service Hours
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-semibold text-foreground">Order Cutoff</p>
                <p className="text-muted-foreground">Self: {selfCutoffTime}</p>
                <p className="text-muted-foreground">Donate/Sponsor: {donateCutoffTime}</p>
              </div>
              <div className="pt-2">
                <p className="font-semibold text-foreground">Delivery Time</p>
                <p className="text-muted-foreground">Before Maghrib Prayer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            © {currentYear} Ramadan Fresh Box. Made with 
            <Heart className="w-4 h-4 text-red-500 fill-red-500" /> 
            in Hyderabad
          </p>
          
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
