import { Button } from "@/components/shared/ui/button";
import { AlertTriangle, ArrowLeft, WifiOff } from "lucide-react";

interface PageErrorProps {
  message?: string;
  onBack?: () => void;
  backLabel?: string;
}

function isNetworkError(message?: string) {
  if (!message) return false;
  const m = message.toLowerCase();
  return (
    m.includes("network") ||
    m.includes("failed to fetch") ||
    m.includes("connection refused") ||
    m.includes("econnrefused") ||
    m.includes("err_network") ||
    m.includes("timeout") ||
    m.includes("no internet")
  );
}

export function PageError({
  message,
  onBack,
  backLabel = "Go Back",
}: PageErrorProps) {
  const isNetwork = isNetworkError(message);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center px-4">
      <div
        className={`h-16 w-16 rounded-full flex items-center justify-center ${isNetwork ? "bg-slate-100" : "bg-red-50"}`}
      >
        {isNetwork ? (
          <WifiOff className="h-7 w-7 text-slate-400" />
        ) : (
          <AlertTriangle className="h-7 w-7 text-red-400" />
        )}
      </div>
      <div>
        <p className="text-base font-semibold text-slate-800 mb-1">
          {isNetwork ? "Unable to connect" : "Something went wrong"}
        </p>
        <p className="text-sm text-slate-500 max-w-xs">
          {isNetwork
            ? "Check your internet connection and try again."
            : (message ?? "An unexpected error occurred.")}
        </p>
      </div>
      {onBack && (
        <Button
          variant="outline"
          onClick={onBack}
          className="border-slate-300 text-slate-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> {backLabel}
        </Button>
      )}
    </div>
  );
}
