import Header from "@/components/shared/Header";
import Footer from "@/components/Customer/Footer";
import { Shield } from "lucide-react";

const sections = [
  {
    title: "1. Introduction",
    body: `STOCK UP ("we", "us", "our") operates an online marketplace for organic honey, wellness products, and related goods. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website or make a purchase from us.`,
  },
  {
    title: "2. Information We Collect",
    body: `We may collect the following information when you interact with our site:`,
    list: [
      "Contact details such as your name, email address, phone number, and delivery address",
      "Account information, including your login credentials",
      "Order and payment details necessary to process transactions",
      "Communications you send us through our contact form or email",
      "Technical data such as IP address, browser type, and device information",
    ],
  },
  {
    title: "3. How We Use Your Information",
    body: `We use the information we collect to:`,
    list: [
      "Process and deliver your orders",
      "Communicate with you about your orders, account, or inquiries",
      "Improve our products, services, and website experience",
      "Send you newsletters or promotional offers, where you have opted in",
      "Comply with legal obligations and prevent fraud",
    ],
  },
  {
    title: "4. Sharing Your Information",
    body: `We do not sell your personal information. We may share your information with trusted third parties such as delivery partners, payment processors, and service providers who help us operate our business, and only to the extent necessary for them to perform their services.`,
  },
  {
    title: "5. Data Security",
    body: `We take reasonable technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "6. Cookies and Tracking",
    body: `Our website may use cookies and similar technologies to remember your preferences and improve site functionality. You can control cookie settings through your browser at any time.`,
  },
  {
    title: "7. Your Rights",
    body: `You have the right to access, correct, or request deletion of your personal information. To exercise these rights, please contact us using the details below.`,
  },
  {
    title: "8. Children's Privacy",
    body: `Our services are not directed at children under the age of 13, and we do not knowingly collect personal information from children.`,
  },
  {
    title: "9. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.`,
  },
  {
    title: "10. Contact Us",
    body: `If you have questions about this Privacy Policy, please contact us at support@elutrading.com or +251 911 234 567.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Hero banner */}
      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-6 py-10 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
            <Shield className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
              Privacy Policy
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
          This Privacy Policy describes how STOCK UP collects, uses, and
          protects your information when you use our website and services.
          Please read it carefully.
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
              {section.body && (
                <p className="text-sm text-stone-600 leading-relaxed">
                  {section.body}
                </p>
              )}
              {section.list && (
                <ul className="mt-3 space-y-2">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-stone-600 leading-relaxed flex items-start gap-2"
                    >
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-yellow-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
