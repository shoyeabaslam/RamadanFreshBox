import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Ramadan Fresh Box - Terms and conditions for using our services',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last Updated: February 15, 2026</p>

        <div className="prose prose-green max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Ramzan Fresh Box. By accessing or using our website and services, you agree to be bound 
              by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not 
              use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700 mb-3">
              Ramadan Fresh Box provides fresh fruit delivery services specifically for Iftar during the holy month 
              of Ramadan in Hyderabad, Telangana. Our services include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Pre-packaged fresh fruit boxes for self-consumption</li>
              <li>Donation options for distributing fruit boxes to the needy</li>
              <li>Daily deliveries before Maghrib prayer time</li>
              <li>Online ordering and payment processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Order Placement and Acceptance</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Order Process</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Orders must be placed through our website</li>
              <li>You must provide accurate delivery information</li>
              <li>Orders are confirmed upon successful payment</li>
              <li>We reserve the right to refuse or cancel any order</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">3.2 Cutoff Times</h3>
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 my-4">
              <p className="text-gray-800 font-medium mb-2">⏰ Important Order Deadlines:</p>
              <p className="text-gray-700 mb-2">
                Orders must be placed before the daily cutoff time for same-day delivery. Cutoff times vary based on order type:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Self Orders:</strong> Earlier evening cutoff time</li>
                <li><strong>Donation Orders:</strong> Earlier afternoon cutoff time (to allow for distribution)</li>
              </ul>
              <p className="text-gray-600 text-sm mt-2">
                Orders placed after cutoff times will be processed for the next day. Check our website for current cutoff times.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Pricing and Payment</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Pricing</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All prices are listed in Indian Rupees (INR)</li>
              <li>Prices are inclusive of applicable taxes</li>
              <li>We reserve the right to change prices without prior notice</li>
              <li>Price changes do not affect confirmed orders</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">4.2 Payment</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Payment must be made at the time of order placement</li>
              <li>We accept payments through Razorpay (UPI, cards, net banking, wallets)</li>
              <li>Payment confirmation is required for order processing</li>
              <li>Failed payments will result in order cancellation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Delivery Policy</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">5.1 Delivery Areas</h3>
            <p className="text-gray-700 mb-3">
              We currently deliver within Hyderabad city limits. Delivery availability is subject to our 
              operational capacity and may vary by location.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">5.2 Delivery Timing</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All orders are delivered before Maghrib (Iftar time)</li>
              <li>Exact delivery time may vary based on route optimization</li>
              <li>We will make reasonable attempts to deliver on time</li>
              <li>Delays due to unforeseen circumstances are not our responsibility</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">5.3 Delivery Requirements</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Someone must be available to receive the delivery</li>
              <li>Provide accurate address with landmarks</li>
              <li>Keep your phone reachable for delivery coordination</li>
              <li>We are not responsible if delivery cannot be completed due to incorrect information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cancellation and Refund Policy</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">6.1 Cancellation by Customer</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Before Processing:</strong> Full refund if cancelled before order is assigned for delivery</li>
              <li><strong>After Processing:</strong> No refund once order is dispatched</li>
              <li><strong>Cancellation Window:</strong> Typically 30 minutes after order placement</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">6.2 Cancellation by Us</h3>
            <p className="text-gray-700 mb-3">We may cancel orders in the following situations:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Product unavailability due to unforeseen circumstances</li>
              <li>Inability to deliver to the provided address</li>
              <li>Payment issues or fraudulent activities</li>
              <li>Force majeure events</li>
            </ul>
            <p className="text-gray-700 mt-3">Full refund will be processed within 5-7 business days.</p>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">6.3 Refund Process</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Refunds will be processed to the original payment method</li>
              <li>Processing time: 5-7 business days</li>
              <li>Bank processing may take additional 5-10 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Quality and Returns</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">7.1 Product Quality</h3>
            <p className="text-gray-700 mb-3">
              We ensure all fruits are fresh and of high quality. However, if you receive damaged or poor-quality 
              products, please contact us immediately upon delivery.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">7.2 Complaints</h3>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-gray-800 font-medium mb-2">📞 Report Issues Within 1 Hour of Delivery:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Damaged or rotten fruits</li>
                <li>Missing items from your order</li>
                <li>Wrong items delivered</li>
              </ul>
              <p className="text-gray-600 text-sm mt-2">
                Take photos and contact us immediately. We will arrange replacement or refund.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. User Responsibilities</h2>
            <p className="text-gray-700 mb-3">You agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your account (if registered)</li>
              <li>Use our services only for lawful purposes</li>
              <li>Not engage in fraudulent activities</li>
              <li>Not interfere with the proper functioning of our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              To the maximum extent permitted by law, Ramzan Fresh Box shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Delays or failures in delivery due to circumstances beyond our control</li>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Issues arising from third-party services (payment gateways, etc.)</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Our total liability shall not exceed the amount paid for the specific order in question.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on our website, including text, graphics, logos, images, and software, is the property 
              of Ramzan Fresh Box and protected by Indian intellectual property laws. You may not use, reproduce, 
              or distribute any content without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Donation Services</h2>
            <p className="text-gray-700 mb-3">For donation orders:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>We distribute donated boxes to verified recipients</li>
              <li>Photos/updates may be shared for transparency</li>
              <li>Donations are non-refundable once processed</li>
              <li>Tax exemption certificates are not provided (we are not a registered charity)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Force Majeure</h2>
            <p className="text-gray-700 leading-relaxed">
              We shall not be liable for any failure or delay in performance due to circumstances beyond our 
              reasonable control, including natural disasters, war, strikes, power failures, internet disruptions, 
              or government actions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of India. 
              Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction 
              of the courts in Hyderabad, Telangana.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective 
              immediately upon posting on our website. Your continued use of our services after changes constitutes 
              acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 mb-3">
              For questions or concerns about these Terms of Service, please contact us:
            </p>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <p className="text-gray-800 font-medium mb-2">Ramadan Fresh Box</p>
              <p className="text-gray-700">Hyderabad, Telangana, India</p>
              <p className="text-gray-700">Email: ramadanfreshbox@gmail.com</p>
              <p className="text-gray-700">Phone: +91 830 964 4110</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms of Service is found to be invalid or unenforceable, the remaining 
              provisions shall continue in full force and effect.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <a 
            href="/" 
            className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
