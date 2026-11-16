import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { Phone, Mail, MessageCircle } from "lucide-react";

export default function ContactSupportPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleBackToLogin = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-gray-100 flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-5xl md:h-[90vh] md:max-h-[700px] flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl border border-gray-200">
        {/* Left panel */}
        <div className="md:w-5/12 bg-gray-100 p-8 md:p-10 flex flex-col justify-between border-r border-gray-200">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              Account Pending Activation
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your account has been created and is awaiting admin approval. This
              usually takes 1-2 business days.
            </p>
          </div>
          <div className="mt-3 space-y-3">
            {[
              {
                step: "1",
                label: "Account created",
                done: true,
                active: false,
              },
              {
                step: "2",
                label: "Awaiting admin review",
                done: false,
                active: true,
              },
              {
                step: "3",
                label: "Account activated",
                done: false,
                active: false,
              },
            ].map(({ step, label, done, active }) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? "bg-yellow-500 text-white" : active ? "bg-white text-yellow-600 ring-2 ring-yellow-500" : "bg-gray-100 text-gray-400"}`}
                >
                  {done ? (
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`text-sm ${done ? "text-gray-800 font-medium" : active ? "text-yellow-600 font-medium" : "text-gray-400"}`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel  contact info only */}
        <div className="md:w-7/12 bg-gray-50 flex flex-col justify-center p-8 md:p-10">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Contact Support
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Reach out to us through any of the channels below and we will get
            back to you shortly.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-gray-800 font-medium">+251 911 234 567</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Email
                </p>
                <p className="text-gray-800 font-medium">
                  support@elutrading.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Message
                </p>
                <p className="text-gray-800 font-medium">
                  Chat with us on Telegram
                </p>
                <p className="text-xs text-gray-400">@elutrading_support</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Already activated?{" "}
            <button
              onClick={handleBackToLogin}
              className="text-yellow-600 hover:text-yellow-800 underline-offset-2 hover:underline font-medium"
            >
              Back to login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
