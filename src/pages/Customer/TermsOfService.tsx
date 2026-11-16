import Header from "@/components/shared/Header";
import Footer from "@/components/Customer/Footer";
import { ScrollText } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using the STOCK UP ("Site"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Site.`,
  },
  {
    title: "2. About STOCK UP",
    body: `STOCK UP is an online marketplace based in Addis Ababa, Ethiopia, offering organic honey, wellness products, and related goods for sale.`,
  },
  {
    title: "3. Orders and Payment",
    body: `When you place an order through our Site, you agree to provide accurate and complete information. All orders are subject to acceptance and availability. Prices are listed in the applicable currency and may change without prior notice.`,
  },
  {
    title: "4. Shipping and Delivery",
    body: `We aim to deliver orders within the timeframes communicated at checkout. Delivery times are estimates and may vary due to factors outside our control.`,
  },
  {
    title: "5. Returns and Refunds",
    body: `If you are not satisfied with your order, please contact us at support@elutrading.com within a reasonable time of receiving your order. Returns and refunds will be handled in accordance with the condition of the product and the circumstances of the request.`,
  },
  {
    title: "6. Product Information",
    body: `We make reasonable efforts to ensure product descriptions, images, and pricing on our Site are accurate. However, we do not warrant that all information is complete, current, or error-free.`,
  },
  {
    title: "7. User Conduct",
    body: `You agree not to use the Site for any unlawful purpose, to interfere with the Site's operation, or to attempt to gain unauthorized access to any part of the Site or its related systems.`,
  },
  {
    title: "8. Intellectual Property",
    body: `All content on this Site, including text, graphics, logos, and images, is the property of STOCK UP or its licensors and is protected by applicable intellectual property laws. You may not reproduce or use this content without our prior written permission.`,
  },
  {
    title: "9. Limitation of Liability",
    body: `To the fullest extent permitted by law, STOCK UP shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Site or products purchased through it.`,
  },
  {
    title: "10. Changes to These Terms",
    body: `We may revise these Terms of Service from time to time. Continued use of the Site after changes are posted constitutes your acceptance of the revised terms.`,
  },
  {
    title: "11. Contact Us",
    body: `If you have any questions about these Terms of Service, please contact us at support@elutrading.com or +251 911 234 567.`,
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Hero banner */}
      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-6 py-10 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
            <ScrollText className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
              Terms of Service
            </h1>
            <p className="text-sm text-stone-400 mt-0.5">
              Last updated: September 9, 2026
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <p className="text-stone-600 leading-relaxed mb-10 text-sm">
          These Terms of Service govern your use of the STOCK UP website and the
          purchase of products through it. Please read them carefully before
          using our Site.
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm"
            >
              <h2 className="text-base font-semibold text-stone-800 mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 shrink-0" />
                {section.title}
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
