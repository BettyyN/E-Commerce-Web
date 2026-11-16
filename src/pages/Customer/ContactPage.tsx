import { useState } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/Customer/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <div className="border-b border-brown-100 bg-gradient-to-br from-yellow-50 via-white to-yellow-50/30 py-14 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold uppercase tracking-widest mb-4">
            Get in touch
          </span>
          <h1 className="text-4xl font-bold text-brown-900 mb-4">
            We'd love to hear from you
          </h1>
          <p className="text-brown-500 text-lg">
            Have a question, feedback, or just want to say hello? Drop us a
            message and we'll get back to you within 24 hours.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-16 flex-1">
        {" "}
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info cards */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Contact Information
            </h2>

            {[
              {
                icon: Phone,
                color: "bg-green-100 text-green-600",
                label: "Phone",
                value: "+251 911 234 567",
                sub: "Mon – Sat, 8AM – 6PM",
                href: "tel:+251911234567",
              },
              {
                icon: Mail,
                color: "bg-blue-100 text-blue-600",
                label: "Email",
                value: "support@elutrading.com",
                sub: "We reply within 24 hours",
                href: "mailto:support@elutrading.com",
              },
              {
                icon: MapPin,
                color: "bg-yellow-100 text-yellow-600",
                label: "Office",
                value: "Bole, Addis Ababa",
                sub: "Ethiopia",
                href: undefined,
              },
              {
                icon: Clock,
                color: "bg-purple-100 text-purple-600",
                label: "Business Hours",
                value: "Mon – Sat: 8AM – 6PM",
                sub: "Closed on Sundays",
                href: undefined,
              },
            ].map(({ icon: Icon, color, label, value, sub, href }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="text-slate-800 font-semibold text-sm hover:text-yellow-600 transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-slate-800 font-semibold text-sm">
                      {value}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-3">
                Follow Us
              </p>
              <div className="flex gap-2">
                {[
                  {
                    icon: Facebook,
                    label: "Facebook",
                    color: "hover:bg-blue-50 hover:text-blue-600",
                  },
                  {
                    icon: Instagram,
                    label: "Instagram",
                    color: "hover:bg-pink-50 hover:text-pink-600",
                  },
                  {
                    icon: MessageCircle,
                    label: "Telegram",
                    color: "hover:bg-sky-50 hover:text-sky-600",
                  },
                ].map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    aria-label={label}
                    className={`h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 transition-colors ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Send us a message
              </h2>
              <p className="text-sm text-slate-400 mb-7">
                Fill in the form below and we'll be in touch shortly.
              </p>

              {sent && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
                  <Send className="h-4 w-4" /> Message sent! We'll get back to
                  you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Abebe Kebede"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-yellow-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="abebe@example.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-yellow-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Subject
                  </label>
                  <input
                    required
                    value={form.subject}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subject: e.target.value }))
                    }
                    placeholder="How can we help you?"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-yellow-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-yellow-500 focus:bg-white transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                >
                  <Send className="h-4 w-4" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
