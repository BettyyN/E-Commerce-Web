import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

const navLink = (navigate: ReturnType<typeof useNavigate>, path: string) => {
  navigate(path);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function Footer() {
  const navigate = useNavigate();



  return (
    <footer className="bg-stone-100 text-stone-600 border-t border-stone-200">
      {/* Main footer */}
      <div className="container mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <button
            onClick={() => navLink(navigate, "/")}
            className="text-2xl font-bold text-yellow-600 tracking-tight"
          >
            STOCK UP
          </button>
          <p className="text-sm text-stone-500 leading-relaxed">
            Ethiopia's trusted marketplace for premium organic products — honey,
            wellness essentials, and more.
          </p>
          <div className="flex gap-3 pt-2">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Youtube, label: "YouTube" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="h-9 w-9 rounded-lg bg-white hover:bg-yellow-50 hover:text-yellow-600 border border-stone-200 text-stone-500 flex items-center justify-center transition-colors"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <p className="text-stone-800 font-semibold text-sm uppercase tracking-widest">
            Contact Us
          </p>
          <ul className="space-y-3.5">
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
              <span className="text-sm text-stone-500">
                Bole, Addis Ababa, Ethiopia
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-yellow-600 shrink-0" />
              <a
                href="tel:+251911234567"
                className="text-sm text-stone-500 hover:text-yellow-600 transition-colors"
              >
                +251 911 234 567
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-yellow-600 shrink-0" />
              <a
                href="mailto:support@elutrading.com"
                className="text-sm text-stone-500 hover:text-yellow-600 transition-colors"
              >
                support@elutrading.com
              </a>
            </li>
          </ul>
          <div className="pt-2">
            <p className="text-xs text-stone-400 mb-1">Business Hours</p>
            <p className="text-sm text-stone-500">
              Mon – Sat: 8:00 AM – 6:00 PM
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-200">
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} STOCK UP. All rights reserved.
          </p>
          <div className="flex gap-5">
            {[
              { label: "Privacy Policy", path: "/privacy-policy" },
              { label: "Terms of Service", path: "/terms-of-service" },
            ].map(({ label, path }) => (
              <button
                key={label}
                onClick={() => navLink(navigate, path)}
                className="text-xs text-stone-400 hover:text-yellow-600 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
