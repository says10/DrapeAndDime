import React from "react";
import { Mail, Instagram, Leaf, Heart, Star, Truck, Shield, ArrowRight } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50">
      {/* Premium Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div className="relative max-w-[1920px] mx-auto px-4 py-8 sm:px-8 sm:py-24">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto mb-12 sm:mb-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Drape & Dime
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Where style meets comfort, and trends meet affordability. Crafting fashion that speaks to your soul.
          </p>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-gray-200 via-gray-900 to-gray-200 mx-auto mt-6 sm:mt-8 rounded-full" />
        </section>
        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12 sm:space-y-24">
          {/* Our Story Section */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Our Story
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              At <span className="font-semibold text-gray-900">Drape & Dime</span>, we are more than just a fashion brand. 
              We are a movement, redefining style with a perfect blend of elegance and affordability. 
              Every piece we offer is handpicked to ensure premium quality, comfort, and an effortless fashion statement.
            </p>
          </section>
          {/* Core Values Section */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              What We Stand For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-900">Sustainability</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Eco-friendly materials and ethical sourcing are at our core. We believe in fashion that respects our planet.
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-900">Attention to Detail</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Every stitch, fabric, and fit is crafted to perfection. We obsess over the details so you don't have to.
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-900">Customer First</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Your happiness is our success. We strive for top-tier service and an exceptional shopping experience.
                </p>
              </div>
            </div>
          </section>
          {/* Why Choose Us Section */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm">✓</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">Trendsetting designs that blend tradition and modernity</p>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-600 text-sm sm:text-base">Fast and hassle-free shipping</p>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm">₹</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">Affordable pricing with uncompromised quality</p>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-600 text-sm sm:text-base">Secure and seamless shopping experience</p>
              </div>
            </div>
          </section>
          {/* Contact Section */}
          <section className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <a
                href="mailto:drapeanddime@gmail.com"
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
              >
                <Mail className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                <span className="text-gray-600 group-hover:text-gray-900 text-sm sm:text-base">drapeanddime@gmail.com</span>
              </a>
              <a
                href="https://www.instagram.com/drapeanddime?igsh=bjZyM3E2dHZzMDBs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
              >
                <Instagram className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                <span className="text-gray-600 group-hover:text-gray-900 text-sm sm:text-base">@drapeanddime</span>
              </a>
            </div>
          </section>
          {/* Return Policy Section */}
          <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Return Policy
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                We want you to love your purchase! If you're not satisfied, you can{" "}
                <span className="font-semibold text-gray-900">return your item within 2 days</span>.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <p className="text-sm sm:text-base">
                  To initiate a return, email us at{" "}
                  <a href="mailto:drapeanddime@gmail.com" className="text-gray-900 font-medium hover:underline">
                    drapeanddime@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </section>
          {/* Elegant Closing */}
          <div className="text-center py-8 sm:py-12">
            <p className="text-lg sm:text-2xl font-light text-gray-600 italic tracking-wide">
              "Where fashion meets purpose, and style meets soul."
            </p>
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mt-6 sm:mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
