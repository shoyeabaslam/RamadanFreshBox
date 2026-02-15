import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Ramadan Fresh Box - How we collect, use, and protect your personal information',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: February 15, 2026</p>

        <div className="prose prose-green max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Ramadan Fresh Box ("we," "our," or "us"). We are committed to protecting your personal 
              information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 mb-3">We collect the following personal information when you place an order:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Full name</li>
              <li>Phone number</li>
              <li>Delivery address (including landmark)</li>
              <li>Email address (if provided)</li>
              <li>Order details and preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">2.2 Payment Information</h3>
            <p className="text-gray-700 mb-3">
              Payment transactions are processed through Razorpay, a secure third-party payment gateway. 
              We do not store your complete credit card or debit card information. Razorpay collects and 
              processes payment information in accordance with their privacy policy.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">2.3 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Pages visited and time spent on our website</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Processing and delivering your orders</li>
              <li>Communicating with you about your orders (delivery updates, confirmations)</li>
              <li>Processing payments securely</li>
              <li>Improving our services and customer experience</li>
              <li>Sending promotional offers and updates (with your consent)</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-3">We may share your information with:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Delivery Partners:</strong> To fulfill your orders</li>
              <li><strong>Payment Processors:</strong> Razorpay for secure payment processing</li>
              <li><strong>Service Providers:</strong> Third parties who assist in operating our business</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
            <p className="text-gray-700 mt-3">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, no method 
              of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
              Privacy Policy, unless a longer retention period is required by law. Order information is typically 
              retained for accounting and legal purposes for a period of 7 years.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-700 mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
            <p className="text-gray-700 mt-3">
              To exercise these rights, please contact us at the information provided below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze site 
              traffic, and understand user behavior. You can control cookies through your browser settings, but 
              disabling cookies may affect the functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for children under the age of 18. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please contact us 
              immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this 
              Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 mb-3">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
                        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <p className="text-gray-800 font-medium mb-2">Ramadan Fresh Box</p>
              <p className="text-gray-700">Hyderabad, Telangana, India</p>
              <p className="text-gray-700">Email: ramadanfreshbox@gmail.com</p>
              <p className="text-gray-700">Phone: +91 830 964 4110</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Compliance with Indian Laws</h2>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy is designed to comply with the Information Technology Act, 2000, and the Information 
              Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) 
              Rules, 2011. We are committed to protecting your personal information in accordance with Indian data 
              protection laws.
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
