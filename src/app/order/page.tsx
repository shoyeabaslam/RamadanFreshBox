"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/common/Navbar"
import { OrderTypeSelector, OrderType } from "@/components/order/OrderTypeSelector"
import { FruitPicker } from "@/components/order/FruitPicker"
import { DeliveryDetailsForm, DeliveryDetails } from "@/components/order/DeliveryDetailsForm"
import { OrderSummary } from "@/components/order/OrderSummary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart, Clock } from "lucide-react"
import { useSettings, isCutoffTimePassed } from "@/hooks/useSettings"

interface Package {
  id: number
  name: string
  fruits_limit: number
  price: number
}

interface Fruit {
  id: number
  name: string
}

function OrderPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const packageId = searchParams.get('package')

  const [step, setStep] = useState(1)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [orderType, setOrderType] = useState<OrderType | null>(null)
  const [selectedFruits, setSelectedFruits] = useState<number[]>([])
  const [fruits, setFruits] = useState<Fruit[]>([])
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountType: string; discountValue: number } | null>(null)
  const { settings, selfCutoffTime, donateCutoffTime } = useSettings()

  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },[step])

  // Fetch package details
  useEffect(() => {
    async function fetchPackage() {
      if (!packageId) {
        router.push('/')
        return
      }

      try {
        const response = await fetch('/api/packages')
        const result = await response.json()
        
        if (result.success && result.data?.packages) {
          const pkg = result.data.packages.find((p: Package) => p.id === Number(packageId))
          if (pkg) {
            setSelectedPackage(pkg)
          } else {
            router.push('/')
          }
        }
      } catch (error) {
        console.error('Failed to fetch package:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackage()
  }, [packageId, router])

  // Fetch fruits for summary
  useEffect(() => {
    async function fetchFruits() {
      try {
        const response = await fetch('/api/fruits')
        const result = await response.json()
        if (result.success && result.data?.fruits) {
          setFruits(result.data.fruits)
        }
      } catch (error) {
        console.error('Failed to fetch fruits:', error)
      }
    }
    
    if (step === 4) {
      fetchFruits()
    }
  }, [step])

  // Auto-advance to next step when order type is selected
  useEffect(() => {
    if (step === 1 && orderType !== null) {
      // Set minimum quantity based on order type
      const minQty = (orderType === 'donate' || orderType === 'sponsor') ? 10 : 1
      setQuantity(minQty)
      
      // Small delay for better UX - shows the selection before transitioning
      const timer = setTimeout(() => {
        setStep(2)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [orderType, step])

  const handleNext = () => {
    if (step === 1 && orderType) {
      setStep(2)
    } else if (step === 2 && selectedFruits.length === selectedPackage?.fruits_limit) {
      setStep(3)
    } else if (step === 3 && isDeliveryDetailsValid()) {
      // Save address to localStorage when proceeding to review
      if (deliveryDetails) {
        localStorage.setItem('ramzan_saved_address', JSON.stringify(deliveryDetails))
      }
      setStep(4)
    } else if (step === 4) {
      handleSubmitOrder()
    }
  }

  const handleSubmitOrder = async () => {
    if (!selectedPackage || !orderType || !deliveryDetails) return

    try {
      setIsLoading(true)

      // Prepare order payload matching API schema
      const orderPayload = {
        package_id: selectedPackage.id,
        quantity: quantity,
        order_type: orderType,
        delivery_date: deliveryDetails.deliveryDate,
        delivery_location: deliveryDetails.deliveryLocation || null,
        customer_name: deliveryDetails.customerName,
        phone_number: deliveryDetails.phoneNumber,
        email: deliveryDetails.email || null,
        address: deliveryDetails.address,
        fruit_ids: selectedFruits,
        sponsor_name: deliveryDetails.sponsorName || null,
        sponsor_message: deliveryDetails.sponsorMessage || null,
        coupon_code: appliedCoupon?.code || null,
      }

      // Step 1: Create order in database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      })

      const orderResult = await orderResponse.json()

      if (!orderResult.success) {
        console.log(`Error: ${orderResult.error || 'Failed to create order'}`)
        return
      }

      const orderId = orderResult.data.order_id
      const totalAmount = orderResult.data.total_amount

      // Step 2: Create Razorpay order
      const paymentOrderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          orderId: orderId,
        }),
      })

      const paymentOrderResult = await paymentOrderResponse.json()

      if (!paymentOrderResult.success) {
        console.log('Failed to initiate payment. Please try again.')
        return
      }

      // Step 3: Open Razorpay payment modal
      const options = {
        key: paymentOrderResult.data.key_id,
        amount: paymentOrderResult.data.amount,
        currency: paymentOrderResult.data.currency,
        name: 'Ramzan Fresh Box',
        description: `Order #${orderId} - ${selectedPackage.name}`,
        order_id: paymentOrderResult.data.razorpay_order_id,
        handler: async function (response: any) {
          // Payment successful, verify on backend
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderId,
                amount: totalAmount,
              }),
            })

            const verifyResult = await verifyResponse.json()

            if (verifyResult.success) {
              // Send confirmation email
              if (deliveryDetails.email) {
                try {
                  await fetch('/api/email/send-order-confirmation', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      orderId: orderId,
                      customerName: deliveryDetails.customerName,
                      customerEmail: deliveryDetails.email,
                      packageName: selectedPackage.name,
                      quantity: quantity,
                      deliveryDate: deliveryDetails.deliveryDate,
                      totalAmount: totalAmount,
                      discountAmount: orderResult.data.discount_amount || 0,
                      orderType: orderType,
                    }),
                  })
                } catch (emailError) {
                  console.error('Failed to send confirmation email:', emailError)
                  // Continue anyway - don't block success page
                }
              }
              
              // Redirect to success page
              router.push(`/success?order_id=${orderId}`)
            } else {
              console.log('Payment verification failed. Please contact support.')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            console.log('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: deliveryDetails.customerName,
          contact: deliveryDetails.phoneNumber,
        },
        theme: {
          color: '#10b981',
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false)
          },
        },
      }

      // Load Razorpay script and open modal
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => {
        const razorpay = new (globalThis as any).Razorpay(options)
        razorpay.open()
      }
      script.onerror = () => {
        console.log('Failed to load payment gateway. Please try again.')
        setIsLoading(false)
      }
      document.body.appendChild(script)

    } catch (error) {
      console.error('Order submission error:', error)
      console.log('Failed to submit order. Please try again.')
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 4) {
      setStep(3)
    } else if (step === 3) {
      setStep(2)
    } else if (step === 2) {
      setStep(1)
    } else {
      router.push('/')
    }
  }

  const isDeliveryDetailsValid = () => {
    if (!deliveryDetails) return false
    
    const required = [
      deliveryDetails.customerName,
      deliveryDetails.phoneNumber,
      deliveryDetails.deliveryDate,
      deliveryDetails.flatNumber,
      deliveryDetails.street,
      deliveryDetails.area,
      deliveryDetails.pincode,
    ]
    
    // Check order-type specific fields
    if ((orderType === 'donate' || orderType === 'sponsor') && !deliveryDetails.deliveryLocation) return false
    if (orderType === 'sponsor' && !deliveryDetails.sponsorName) return false
    
    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(deliveryDetails.phoneNumber)) return false
    
    // Pincode validation
    const pincodeRegex = /^\d{6}$/
    if (!pincodeRegex.test(deliveryDetails.pincode)) return false
    
    return required.every(field => field && field.trim().length > 0)
  }

  const canProceed = () => {
    if (step === 1) return orderType !== null
    if (step === 2) return selectedFruits.length === selectedPackage?.fruits_limit
    if (step === 3) return isDeliveryDetailsValid()
    if (step === 4) return true // Ready for payment
    return false
  }

  // Check if cutoff time has passed for today's delivery
  const getCutoffWarning = () => {
    if (!deliveryDetails?.deliveryDate || !settings) return null
    
    const cutoffTime = orderType === 'self' 
      ? settings.self_cutoff_time 
      : settings.donate_cutoff_time
    
    const isPassed = isCutoffTimePassed(cutoffTime, deliveryDetails.deliveryDate)
    
    if (isPassed) {
      const formattedTime = orderType === 'self' ? selfCutoffTime : donateCutoffTime
      return `Orders for today must be placed before ${formattedTime}. Please select a different delivery date.`
    }
    
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!selectedPackage) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button 
              onClick={handleBack}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span>•</span>
            <span>Step {step} of 4</span>
          </div>

          <div className="bg-muted/30 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  {selectedPackage.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose {selectedPackage.fruits_limit} items for your Iftar box
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Base Price</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  ₹{selectedPackage.price}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                1
              </div>
              <span className="hidden sm:inline text-sm font-medium">Type</span>
            </div>

            <div className={`h-0.5 w-8 sm:w-16 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />

            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                2
              </div>
              <span className="hidden sm:inline text-sm font-medium">Items</span>
            </div>

            <div className={`h-0.5 w-8 sm:w-16 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />

            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                3
              </div>
              <span className="hidden sm:inline text-sm font-medium">Details</span>
            </div>

            <div className={`h-0.5 w-8 sm:w-16 ${step >= 4 ? 'bg-primary' : 'bg-muted'}`} />

            <div className={`flex items-center gap-2 ${step >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                4
              </div>
              <span className="hidden sm:inline text-sm font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {step === 1 && (
            <OrderTypeSelector
              selectedType={orderType}
              onSelectType={setOrderType}
            />
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Quantity Selector */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">
                        Number of Boxes
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {orderType === 'donate' || orderType === 'sponsor' 
                        ? 'Minimum 10 boxes for donations and sponsorships'
                        : 'Choose how many boxes you want to order'
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const minQty = (orderType === 'donate' || orderType === 'sponsor') ? 10 : 1
                        setQuantity(Math.max(minQty, quantity - 1))
                      }}
                      disabled={quantity <= ((orderType === 'donate' || orderType === 'sponsor') ? 10 : 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <Input
                      type="text"
                      inputMode="numeric"
                      value={quantity}
                      onChange={(e) => {
                        const value = e.target.value
                        // Allow empty string while typing
                        if (value === '') {
                          setQuantity(0)
                          return
                        }
                        // Only allow numbers
                        const numValue = value.replaceAll(/\D/g, '')
                        if (numValue) {
                          const qty = Number.parseInt(numValue)
                          setQuantity(Math.min(100, qty))
                        }
                      }}
                      onBlur={() => {
                        // Enforce minimum on blur
                        const minQty = (orderType === 'donate' || orderType === 'sponsor') ? 10 : 1
                        if (quantity < minQty) {
                          setQuantity(minQty)
                        }
                      }}
                      className="w-20 text-center text-lg font-semibold"
                      placeholder="1"
                    />

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(100, quantity + 1))}
                      disabled={quantity >= 100}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        ₹{selectedPackage.price} × {quantity} {quantity === 1 ? 'box' : 'boxes'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                      <p className="text-3xl font-bold text-primary">
                        ₹{(selectedPackage.price * quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fruit Picker */}
              <FruitPicker
                packageLimit={selectedPackage.fruits_limit}
                selectedFruits={selectedFruits}
                onFruitsChange={setSelectedFruits}
              />
            </div>
          )}

          {step === 3 && orderType && (
            <DeliveryDetailsForm
              orderType={orderType}
              deliveryDetails={deliveryDetails}
              onDetailsChange={setDeliveryDetails}
            />
          )}

          {step === 4 && orderType && deliveryDetails && (
            <OrderSummary
              packageDetails={selectedPackage}
              orderType={orderType}
              selectedFruits={fruits.filter(f => selectedFruits.includes(f.id))}
              deliveryDetails={deliveryDetails}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onCouponApplied={setAppliedCoupon}
            />
          )}
        </div>

        {/* Cutoff Time Warning */}
        {step >= 3 && getCutoffWarning() && (
          <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-destructive mb-1">Order Cutoff Time Exceeded</h4>
                <p className="text-sm text-destructive/90">
                  {getCutoffWarning()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 1 ? 'Back to Home' : 'Previous'}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || isLoading || (step >= 3 && !!getCutoffWarning())}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                {step === 1 && 'Next: Choose Items'}
                {step === 2 && 'Continue to Delivery Details'}
                {step === 3 && 'Review Order'}
                {step === 4 && 'Proceed to Payment'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
      </div>
    </main>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <OrderPageContent />
    </Suspense>
  )
}
