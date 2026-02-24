import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  HiShieldCheck,
  HiUserGroup,
  HiGlobeAlt,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";

const VALUES = [
  {
    icon: HiShieldCheck,
    title: "Trust & Safety",
    description:
      "Every listing is reviewed and sellers can be verified. We prioritize your safety with secure messaging and fraud prevention.",
  },
  {
    icon: HiUserGroup,
    title: "Community First",
    description:
      "Built for Pakistanis, by Pakistanis. We connect local buyers and sellers across all provinces and cities.",
  },
  {
    icon: HiGlobeAlt,
    title: "Accessible to All",
    description:
      "Free to list, free to browse. Elyndra makes buying and selling accessible to everyone across Pakistan.",
  },
  {
    icon: HiChatBubbleLeftRight,
    title: "Seamless Communication",
    description:
      "Our built-in messaging system lets buyers and sellers connect instantly, without sharing personal contact details.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              About Elyndra Pakistan
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto leading-relaxed">
              Pakistan&apos;s trusted online marketplace connecting millions of
              buyers and sellers. Buy and sell everything from mobiles and cars to
              property and services — quickly, safely, and locally.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Elyndra Pakistan was created with a simple mission: to make
              buying and selling easy, safe, and accessible for everyone in
              Pakistan. Whether you are in Karachi, Lahore, Islamabad, or a
              smaller city, we provide a platform where you can find what you
              need and sell what you no longer use — all within your local
              community.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              We believe in empowering individuals and small businesses by
              giving them the tools to reach buyers across the country. With
              categories spanning mobiles, cars, property, electronics, jobs,
              and more, Elyndra is your one-stop marketplace.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-green-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {[
                { label: "Active Users", value: "50K+" },
                { label: "Listings Posted", value: "200K+" },
                { label: "Cities Covered", value: "100+" },
                { label: "Categories", value: "12" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-green-200 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
