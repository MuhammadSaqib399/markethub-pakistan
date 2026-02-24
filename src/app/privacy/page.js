import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: February 2026
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-3">
              We collect information you provide directly to us when you:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Create an account (name, email, phone number)</li>
              <li>Post a listing (item details, photos, location)</li>
              <li>Communicate with other users through our messaging system</li>
              <li>Contact our support team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide, maintain, and improve our marketplace services.</li>
              <li>To process your listings and connect buyers with sellers.</li>
              <li>To send you important notifications about your account and listings.</li>
              <li>To detect and prevent fraud, spam, and abuse.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              3. Information Sharing
            </h2>
            <p>
              We do not sell your personal information. We may share your
              information only in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>
                <strong>With other users:</strong> Your name and listing details
                are visible to other users. Phone numbers are only shared when
                you choose to display them.
              </li>
              <li>
                <strong>With service providers:</strong> We use third-party
                services for image hosting (Cloudinary) and other operational
                needs.
              </li>
              <li>
                <strong>For legal reasons:</strong> We may disclose information
                when required by law or to protect our rights and safety.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              data, including encrypted passwords, secure token-based
              authentication, and rate limiting to prevent abuse. However, no
              method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              5. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Access and update your personal information.</li>
              <li>Delete your account and associated data.</li>
              <li>Opt out of non-essential communications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              6. Cookies
            </h2>
            <p>
              We use local storage to maintain your session and preferences. We
              do not use third-party tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. Contact Us
            </h2>
            <p>
              For privacy-related inquiries, contact us at{" "}
              <a
                href="mailto:support@elyndra.pk"
                className="text-green-600 hover:underline"
              >
                support@elyndra.pk
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
