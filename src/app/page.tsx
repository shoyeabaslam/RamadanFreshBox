import { Banner } from "@/components/common/Banner"
import { PrayerTime } from "@/components/common/PrayerTime"
import { PackagesSection } from "@/components/common/PackagesSection"
import { HowItWorks } from "@/components/common/HowItWorks"
import { TodaysDeliveryReel } from "@/components/common/TodaysDeliveryReel"
import { CTASection } from "@/components/common/CTASection"
import { Footer } from "@/components/common/Footer"

const page = () => {
  return (
   <main>
      <Banner/>
      <PrayerTime isMobile={true} />
      <PackagesSection />
      <HowItWorks />
      <TodaysDeliveryReel />
      <CTASection />
      <Footer />
   </main>
  )
}

export default page