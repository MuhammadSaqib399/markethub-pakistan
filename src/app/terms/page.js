import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: February 2026
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using MarketHub Pakistan, you agree to be bound
              by these Terms of Service. If you do not agree to these terms,
              please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              2. User Accounts
            </h2>
            <p>
              You must be at least 18 years old to create an account. You are
              responsible for maintaining the confidentiality of your account
              credentials and for all activities that occur under your account.
              You agree to provide accurate and complete information when
              creating your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              3. Listing Guidelines
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                All listings must be for legal items and services within
                Pakistan.
              </li>
              <li>
                Listings must accurately describe the item, including its
                condition and price.
              </li>
              <li>
                Prohibited items include weapons, illegal substances, counterfeit
                goods, and stolen property.
              </li>
              <li>
                MarketHub reserves the right to remove any listing that violates
                our guidelines.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. Transactions
            </h2>
            <p>
              MarketHub is a platform that connects buyers and sellers. We do
              not participate in or guarantee any transactions between users. All
              transactions are conducted at your own risk. We recommend meeting
              in public places and inspecting items before making payment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              5. Prohibited Conduct
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Posting false, misleading, or fraudulent listings.</li>
              <li>Harassing, threatening, or abusing other users.</li>
              <li>
                Attempting to manipulate the platform or circumvent security
                measures.
              </li>
              <li>Using the platform for spam or unsolicited advertising.</li>
              <li>
                Scraping, crawling, or collecting data from the platform without
                permission.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              6. Limitation of Liability
            </h2>
            <p>
              MarketHub Pakistan shall not be liable for any direct, indirect,
              incidental, or consequential damages arising from your use of the
              platform or any transactions conducted through it. We provide the
              platform &ldquo;as is&rdquo; without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Continued
              use of the platform after changes constitutes acceptance of the
              updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              8. Contact
            </h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <a
                href="mailto:support@markethub.pk"
                className="text-green-600 hover:underline"
              >
                support@markethub.pk
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
