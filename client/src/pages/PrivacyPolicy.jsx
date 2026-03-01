import { Link } from 'react-router-dom'

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-elegant text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg opacity-90">RadioTranslator User Privacy Protection Policy</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">

          {/* Important Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <p className="text-gray-800">
              <strong>Important Notice:</strong> This privacy policy helps you understand how we collect, use, store, and protect your personal information. Please read this policy carefully.
            </p>
          </div>

          {/* Last Updated */}
          <p className="text-gray-600 text-sm mb-8">
            Last Updated: January 1, 2025
          </p>

          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to RadioTranslator. We are committed to protecting your privacy and ensuring transparency about how we collect, use, and protect your personal information. This Privacy Policy applies to our website and mobile applications, and explains our data practices in compliance with applicable privacy laws and regulations including GDPR, CCPA, and app store requirements.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We are committed to protecting your privacy. RadioTranslator collects the following types of information when providing our services:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 Personal Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
              <li><strong>Account Information:</strong> Email address, username, and encrypted password provided during registration</li>
              <li><strong>Profile Information:</strong> Your preferred language settings and other personal preferences you choose to provide</li>
              <li><strong>Subscription Information:</strong> Membership subscription type, payment information, and subscription status</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 Usage Data</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
              <li><strong>Listening Records:</strong> Radio stations you listen to, listening duration, and frequency</li>
              <li><strong>Translation Records:</strong> Translation features used and language preferences</li>
              <li><strong>Device Information:</strong> Device type, operating system, browser type, and IP address</li>
              <li><strong>Application Usage:</strong> Feature usage statistics, error logs, and performance data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3 Audio Data</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
              <li>We process audio streams from radio stations in real-time to generate subtitles and translations</li>
              <li>Audio data is processed temporarily and is not permanently stored on our servers</li>
              <li>Transcriptions and translations may be temporarily cached to improve service performance</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              The information we collect is used for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your registration, login, and membership subscriptions</li>
              <li>Personalize your user experience and content recommendations</li>
              <li>Provide customer support and respond to your inquiries</li>
              <li>Send service notifications, updates, and marketing information (you can opt out)</li>
              <li>Analyze user behavior to improve product features</li>
              <li>Detect, prevent, and resolve technical issues and security risks</li>
              <li>Comply with legal obligations and protect user rights</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We do not sell your personal information. We only share your information in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Third-Party Service Providers</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
              <li><strong>Payment Processing:</strong> Share necessary payment information with payment service providers (e.g., Stripe)</li>
              <li><strong>Cloud Services:</strong> Use cloud service providers for data storage and service hosting</li>
              <li><strong>Analytics Services:</strong> Use analytics tools to understand user behavior and improve services</li>
              <li><strong>AI Services:</strong> Use third-party AI services for speech recognition and translation (e.g., OpenAI, DeepL)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Off-Device Data Transmission</h3>
            <p className="text-gray-700 mb-4 ml-4">
              User data may be transmitted from your device by libraries or SDKs used in our app, including authentication credentials, preferences, and usage analytics.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Legal Requirements</h3>
            <p className="text-gray-700 mb-4 ml-4">
              We may disclose your information when required by law, court order, or government agency requests.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4 Business Transfers</h3>
            <p className="text-gray-700 mb-4 ml-4">
              In the event of a merger, acquisition, or asset sale, your information may be transferred as part of the business assets.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We implement reasonable technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Encrypted Transmission:</strong> Use HTTPS/SSL encryption to protect data transmission</li>
              <li><strong>Password Protection:</strong> Store passwords using industry-standard encryption algorithms (bcrypt)</li>
              <li><strong>Access Control:</strong> Limit access to personal information through JWT authentication</li>
              <li><strong>Regular Audits:</strong> Regularly review and update security measures</li>
              <li><strong>Data Backup:</strong> Regular data backups to prevent data loss</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services. When you delete your account, we will delete or anonymize your personal information within a reasonable time, unless we are required to retain certain information by law.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after deletion</li>
              <li><strong>Subscription Records:</strong> Retained for legal and accounting purposes (typically 7 years)</li>
              <li><strong>Usage Logs:</strong> Retained for 90 days for operational purposes</li>
              <li><strong>Audio Processing Data:</strong> Processed in real-time and not permanently stored</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Under applicable data protection laws, you have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access Right:</strong> You have the right to access the personal information we hold about you</li>
              <li><strong>Correction Right:</strong> You have the right to request correction of inaccurate personal information</li>
              <li><strong>Deletion Right:</strong> You have the right to request deletion of your personal information</li>
              <li><strong>Restriction Right:</strong> You have the right to request restriction of processing your personal information</li>
              <li><strong>Data Portability Right:</strong> You have the right to receive your personal information in a structured, commonly used format</li>
              <li><strong>Objection Right:</strong> You have the right to object to processing of your personal information</li>
              <li><strong>Withdraw Consent:</strong> You have the right to withdraw consent for processing personal information at any time</li>
            </ul>
            <p className="text-gray-700 mt-4 ml-4">
              To exercise these rights, please contact us using the contact information at the bottom of this page.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We use cookies and similar tracking technologies to improve user experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Essential Cookies:</strong> Used for basic website functionality such as authentication and security</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and choices</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users use our services</li>
              <li><strong>Marketing Cookies:</strong> Used to provide relevant advertisements and content (if applicable)</li>
            </ul>
            <p className="text-gray-700 mt-4 ml-4">
              You can manage cookie preferences through your browser settings.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not directed to children under 13 years of age (or the applicable age of digital consent in your jurisdiction). If we discover that we have collected personal information from a child without parental consent, we will take steps to delete that information as soon as possible. If you believe we may have information from a child under 13, please contact us.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and stored on servers located outside your country or region. We will take appropriate safeguards to ensure that your personal information is adequately protected during transmission and complies with applicable data protection laws.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. WebView Data Collection</h2>
            <p className="text-gray-700 leading-relaxed">
              We may collect and transfer user data through WebViews that can be opened from our app, except when users are navigating the open web independently.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Privacy Policy Updates</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes through:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Updating the "Last Updated" date at the top of this page</li>
              <li>Sending email notifications to registered users</li>
              <li>Posting a prominent notice on our website</li>
              <li>In-app notifications</li>
            </ul>
            <p className="text-gray-700 mt-4 ml-4">
              Your continued use of our services after such changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Section 12 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              If you have any questions, comments, or complaints about this Privacy Policy or wish to exercise your data protection rights, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg ml-4">
              <p className="text-gray-700 mb-2">
                <strong>Website:</strong> <a href="https://www.radiotranslator.com" className="text-blue-600 hover:underline">www.radiotranslator.com</a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> <a href="mailto:privacy@radiotranslator.com" className="text-blue-600 hover:underline">privacy@radiotranslator.com</a>
              </p>
              <p className="text-gray-700">
                <strong>Customer Support:</strong> <a href="mailto:support@radiotranslator.com" className="text-blue-600 hover:underline">support@radiotranslator.com</a>
              </p>
            </div>
            <p className="text-gray-700 mt-4 ml-4">
              We will respond to your request within 30 days.
            </p>
          </section>

          {/* Section 13 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Applicable Laws</h2>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy is governed by and construed in accordance with applicable data protection laws, including but not limited to the Personal Information Protection Law, GDPR (General Data Protection Regulation), CCPA (California Consumer Privacy Act), and other applicable privacy laws and regulations.
            </p>
          </section>

          {/* Divider */}
          <hr className="my-8" />

          {/* Footer Notice */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Privacy Matters to Us</h3>
            <p className="text-gray-700 leading-relaxed">
              RadioTranslator is committed to protecting your privacy and personal information. We follow industry best practices and applicable data protection laws to ensure your data is secure. If you have any questions or concerns about our privacy practices, please feel free to contact us.
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
