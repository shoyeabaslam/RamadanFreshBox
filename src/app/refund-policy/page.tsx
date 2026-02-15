import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Refund and Cancellation Policy for Ramadan Fresh Box - Learn about our refund process and cancellation terms',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund & Cancellation Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: February 15, 2026</p>

        <div className="prose prose-green max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              At Ramadan Fresh Box, we strive to provide the best quality fresh fruits and timely delivery service. 
              This policy outlines the terms and conditions for order cancellations and refunds. Please read this 
              carefully before placing your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Cancellation Policy</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Customer-Initiated Cancellation</h3>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-4">
              <p className="text-gray-800 font-medium mb-3">📝 Cancellation Timeline:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-green-600">✓</span>
                  <span><strong>Within 30 minutes of order:</strong> 100% refund (if not yet processed)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-amber-600">⚠</span>
                  <span><strong>After order is assigned:</strong> No cancellation allowed</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-red-600">✗</span>
                  <span><strong>After dispatch:</strong> No cancellation or refund</span>
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">2.2 How to Cancel Your Order</h3>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>Contact us immediately via phone or email (contact details below)</li>
              <li>Provide your order ID and reason for cancellation</li>
              <li>We will verify if cancellation is possible</li>
              <li>Confirmation will be sent via SMS/email</li>
            </ol>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">2.3 Company-Initiated Cancellation</h3>
            <p className="text-gray-700 mb-3">We reserve the right to cancel orders in the following cases:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Product unavailability due to unforeseen circumstances</li>
              <li>Inability to deliver to the specified address</li>
              <li>Payment or fraud-related issues</li>
              <li>Extreme weather or force majeure events</li>
              <li>Technical errors resulting in incorrect pricing</li>
            </ul>
            <p className="text-gray-700 mt-3 font-medium text-green-700">
              ✓ Full refund will be processed if we cancel your order
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Refund Policy</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Refund Eligibility</h3>
            <p className="text-gray-700 mb-3">You are eligible for a refund if:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Order cancelled within the allowed time window</li>
              <li>We are unable to deliver your order</li>
              <li>You receive damaged or rotten fruits</li>
              <li>Wrong items are delivered</li>
              <li>Items are missing from your order</li>
              <li>Payment was debited but order was not confirmed</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">3.2 Non-Refundable Cases</h3>
            <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-4">
              <p className="text-gray-800 font-medium mb-3">❌ No Refund in These Cases:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Order successfully delivered and accepted</li>
                <li>Customer not available at delivery location</li>
                <li>Wrong or incomplete address provided</li>
                <li>Phone unreachable during delivery</li>
                <li>Donation orders (once processed)</li>
                <li>Quality complaints raised after 1 hour of delivery</li>
                <li>Change of mind after order is dispatched</li>
              </ul>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">3.3 Refund Process Timeline</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Stage</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Refund Approval</td>
                    <td className="px-6 py-4 text-gray-700">1-2 business days</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Refund Processing</td>
                    <td className="px-6 py-4 text-gray-700">5-7 business days</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Bank Credit (may vary by bank)</td>
                    <td className="px-6 py-4 text-gray-700">5-10 business days</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-6 py-4 text-gray-900 font-semibold">Total Time</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">10-15 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">3.4 Refund Method</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Refunds will be processed to the original payment method used</li>
              <li>For UPI/Card payments: Credited to the same account</li>
              <li>For failed transactions: Auto-refund within 7 days</li>
              <li>We do not provide cash refunds</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Quality Issues and Replacements</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Reporting Quality Issues</h3>
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-4">
              <p className="text-gray-800 font-medium mb-3">⚠️ Report Within 1 Hour of Delivery:</p>
              <p className="text-gray-700 mb-3">If you receive damaged, rotten, or wrong items:</p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Take clear photos of the items and packaging</li>
                <li>Contact us immediately (phone/WhatsApp)</li>
                <li>Provide order ID and description of issue</li>
                <li>Keep the items as received (don't consume)</li>
              </ol>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">4.2 Resolution Options</h3>
            <p className="text-gray-700 mb-3">Based on the issue, we will offer:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Replacement:</strong> Fresh items delivered (if time permits)</li>
              <li><strong>Partial Refund:</strong> For specific damaged items</li>
              <li><strong>Full Refund:</strong> If major quality issues</li>
              <li><strong>Credit for Next Order:</strong> As compensation (if preferred)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Donation Orders</h2>
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <p className="text-gray-800 font-medium mb-3">🤲 Special Policy for Donations:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Donation orders are <strong>non-refundable</strong> once processed</li>
                <li>Cancellation allowed only within 30 minutes of placement</li>
                <li>We ensure donated boxes reach verified recipients</li>
                <li>Updates/photos may be shared for transparency</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Failed Deliveries</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">6.1 Customer Unavailable</h3>
            <p className="text-gray-700 mb-3">If you are unavailable at the delivery location:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Delivery partner will attempt to contact you (3 attempts)</li>
              <li>15-minute waiting time at location</li>
              <li>If unreachable, order marked as "undelivered"</li>
              <li><strong>No refund</strong> for customer unavailability</li>
              <li>Redelivery may be attempted (subject to additional charges)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">6.2 Wrong Address</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Verify your address before confirming order</li>
              <li>Address corrections after dispatch may not be possible</li>
              <li>Unable to deliver due to wrong address: No refund</li>
              <li>Redelivery to correct address: Additional charges apply</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Payment Issues</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">7.1 Payment Failures</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>If payment fails, order will not be processed</li>
              <li>Multiple payment attempts allowed</li>
              <li>Contact your bank for declined transactions</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">7.2 Double Charges</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>If charged multiple times for single order, contact us immediately</li>
              <li>Provide transaction screenshots/IDs</li>
              <li>Excess amount refunded within 5-7 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. How to Request a Refund</h2>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-4">
              <p className="text-gray-800 font-medium mb-3">📞 Contact Us For Refunds:</p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Email: <strong>ramadanfreshbox@gmail.com</strong></li>
                <li>Phone/WhatsApp: <strong>+91 830 964 4110</strong></li>
                <li>Provide: Order ID, Payment details, Issue description</li>
                <li>Attach photos (if quality issue)</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you are not satisfied with our refund decision:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Contact our customer support team to escalate</li>
              <li>We will review your case within 48 hours</li>
              <li>Final decision will be communicated via email</li>
              <li>For unresolved disputes, you may approach consumer forums</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Force Majeure</h2>
            <p className="text-gray-700 leading-relaxed">
              In case of natural disasters, strikes, pandemics, or other events beyond our control that prevent 
              delivery, we will process full refunds. However, we are not liable for any consequential damages or 
              losses arising from such events.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Policy Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to update this Refund & Cancellation Policy at any time. Changes will be posted 
              on this page with an updated "Last Updated" date. Please review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 mb-3">
              For any questions or to request a refund/cancellation:
            </p>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <p className="text-gray-800 font-medium mb-2">Ramadan Fresh Box</p>
              <p className="text-gray-700">Customer Support</p>
              <p className="text-gray-700 mt-3"><strong>Email:</strong> ramadanfreshbox@gmail.com</p>
              <p className="text-gray-700 mt-2"><strong>Phone/WhatsApp:</strong> +91 830 964 4110</p>
              <p className="text-gray-700 mt-2"><strong>Hours:</strong> 9:00 AM - 9:00 PM (Daily during Ramadan)</p>
            </div>
          </section>

          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 mt-8">
            <p className="text-blue-900 font-medium mb-2">💡 Pro Tip:</p>
            <p className="text-blue-800">
              To avoid cancellation/refund hassles, please double-check your order details, delivery address, 
              and phone number before confirming. Ensure someone is available at the delivery location during 
              the delivery window.
            </p>
          </div>
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
