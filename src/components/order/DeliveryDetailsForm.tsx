"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, User, Phone, MessageSquare } from "lucide-react"
import { OrderType } from "./OrderTypeSelector"

interface DeliveryDetails {
  customerName: string
  phoneNumber: string
  deliveryDate: string
  // Address components
  flatNumber: string
  street: string
  area: string
  landmark: string
  pincode: string
  address: string // Combined address for API
  deliveryLocation?: string // For donate/sponsor - mosque/charity location
  sponsorName?: string // For sponsor type
  sponsorMessage?: string // For sponsor type
}

interface DeliveryDetailsFormProps {
  readonly orderType: OrderType
  readonly deliveryDetails: DeliveryDetails | null
  readonly onDetailsChange: (details: DeliveryDetails) => void
}

export function DeliveryDetailsForm({ 
  orderType, 
  deliveryDetails, 
  onDetailsChange 
}: DeliveryDetailsFormProps) {
  const [formData, setFormData] = useState<DeliveryDetails>(
    deliveryDetails || {
      customerName: "",
      phoneNumber: "",
      deliveryDate: "",
      flatNumber: "",
      street: "",
      area: "",
      landmark: "",
      pincode: "",
      address: "",
      deliveryLocation: "",
      sponsorName: "",
      sponsorMessage: "",
    }
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [savedAddress, setSavedAddress] = useState<DeliveryDetails | null>(null)
  const [useSavedAddress, setUseSavedAddress] = useState(false)

  // Load saved address from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ramzan_saved_address')
    if (saved) {
      try {
        const parsedAddress = JSON.parse(saved)
        setSavedAddress(parsedAddress)
      } catch (error) {
        console.error('Failed to parse saved address:', error)
      }
    }
  }, [])

  const handleChange = (field: keyof DeliveryDetails, value: string) => {
    const updated = { ...formData, [field]: value }
    
    // Auto-generate combined address when address components change
    if (['flatNumber', 'street', 'area', 'landmark', 'pincode'].includes(field as string)) {
      const parts = [
        updated.flatNumber,
        updated.street,
        updated.area,
        updated.landmark ? `Near ${updated.landmark}` : '',
        updated.pincode ? `PIN: ${updated.pincode}` : ''
      ].filter(Boolean)
      
      updated.address = parts.join(', ')
    }
    
    setFormData(updated)
    onDetailsChange(updated)
    
    // Clear error for this field
    if (errors[field as string]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  // Handle "Use Saved Address" checkbox
  const handleUseSavedAddress = (checked: boolean) => {
    setUseSavedAddress(checked)
    if (checked && savedAddress) {
      // Populate form with saved address
      const updated = {
        ...formData,
        customerName: savedAddress.customerName,
        phoneNumber: savedAddress.phoneNumber,
        flatNumber: savedAddress.flatNumber,
        street: savedAddress.street,
        area: savedAddress.area,
        landmark: savedAddress.landmark || '',
        pincode: savedAddress.pincode,
        address: savedAddress.address,
      }
      setFormData(updated)
      onDetailsChange(updated)
    }
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  const validatePincode = (pincode: string) => {
    const pincodeRegex = /^\d{6}$/
    return pincodeRegex.test(pincode)
  }

  const handlePhoneBlur = () => {
    if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
      setErrors({ ...errors, phoneNumber: "Please enter a valid 10-digit Indian mobile number" })
    }
  }

  const handlePincodeBlur = () => {
    if (formData.pincode && !validatePincode(formData.pincode)) {
      setErrors({ ...errors, pincode: "Please enter a valid 6-digit pincode" })
    }
  }

  // Get minimum date (today) and maximum date (30 days from now)
  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Delivery <span className="text-primary">Details</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {orderType === 'self' && "Enter your delivery information for Iftar box delivery"}
          {orderType === 'donate' && "Provide mosque details where you'd like to donate"}
          {orderType === 'sponsor' && "Provide charity details for bulk sponsorship"}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Saved Address Checkbox */}
        {savedAddress && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useSavedAddress}
                onChange={(e) => handleUseSavedAddress(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground">
                Use my previous address
              </span>
            </label>
          </div>
        )}

        {/* Personal Information */}
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h3>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value.replaceAll(/\D/g, '').slice(0, 10))}
                  onBlur={handlePhoneBlur}
                  placeholder="10-digit mobile number"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Delivery Information
            </h3>

            {/* Delivery Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                Delivery Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="date"
                  id="date"
                  value={formData.deliveryDate}
                  onChange={(e) => handleChange('deliveryDate', e.target.value)}
                  min={today}
                  max={maxDate}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Delivery before Maghrib prayer time
              </p>
            </div>

            {/* Mosque/Charity Location (for donate/sponsor) */}
            {(orderType === 'donate' || orderType === 'sponsor') && (
              <div>
                <label htmlFor="deliveryLocation" className="block text-sm font-medium text-foreground mb-2">
                  {orderType === 'donate' ? 'Mosque Name & Location' : 'Charity/Organization Name & Location'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={(e) => handleChange('deliveryLocation', e.target.value)}
                  placeholder={orderType === 'donate' ? 'E.g., Makkah Masjid, Old City' : 'E.g., Al-Khair Foundation, Malakpet'}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            )}

            {/* Sponsor Name (for sponsor only) */}
            {orderType === 'sponsor' && (
              <div>
                <label htmlFor="sponsorName" className="block text-sm font-medium text-foreground mb-2">
                  Your Name (Sponsor) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="sponsorName"
                  value={formData.sponsorName}
                  onChange={(e) => handleChange('sponsorName', e.target.value)}
                  placeholder="Enter sponsor name"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Name to be mentioned for the sponsorship
                </p>
              </div>
            )}

            {/* Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Flat/House Number */}
              <div>
                <label htmlFor="flatNumber" className="block text-sm font-medium text-foreground mb-2">
                  Flat/House No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="flatNumber"
                  value={formData.flatNumber}
                  onChange={(e) => handleChange('flatNumber', e.target.value)}
                  placeholder="E.g., Flat 304, Tower B"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Street */}
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-foreground mb-2">
                  Street/Road <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                  placeholder="E.g., MG Road"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Area */}
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-foreground mb-2">
                  Area/Locality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="area"
                  value={formData.area}
                  onChange={(e) => handleChange('area', e.target.value)}
                  placeholder="E.g., Banjara Hills"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Pincode */}
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-foreground mb-2">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value.replaceAll(/\D/g, '').slice(0, 6))}
                  onBlur={handlePincodeBlur}
                  placeholder="6-digit pincode"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
                {errors.pincode && (
                  <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>

            {/* Landmark */}
            <div>
              <label htmlFor="landmark" className="block text-sm font-medium text-foreground mb-2">
                Landmark (Optional)
              </label>
              <input
                type="text"
                id="landmark"
                value={formData.landmark}
                onChange={(e) => handleChange('landmark', e.target.value)}
                placeholder="Nearby landmark for easy location"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

          </CardContent>
        </Card>

        {/* Sponsor Message (for sponsor only) */}
        {orderType === 'sponsor' && (
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Sponsorship Message
              </h3>

              <div>
                <label htmlFor="sponsorMessage" className="block text-sm font-medium text-foreground mb-2">
                  Message (Optional)
                </label>
                <textarea
                  id="sponsorMessage"
                  value={formData.sponsorMessage}
                  onChange={(e) => handleChange('sponsorMessage', e.target.value)}
                  placeholder="Any message or dedication for this sponsorship"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This message will be shared with the recipients
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Important Notice */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            <span className="font-semibold">📞 Note:</span> Our team will contact you on the provided phone number to confirm delivery details and timing.
          </p>
        </div>
      </div>
    </div>
  )
}

export type { DeliveryDetails }
