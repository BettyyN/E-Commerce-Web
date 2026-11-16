import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

async function enableMocking() {
  console.log("Mock API env:", import.meta.env.VITE_USE_MOCK_API);

  if (import.meta.env.VITE_USE_MOCK_API !== "true") {
    console.log("MSW disabled");
    return;
  }

  console.log("Importing MSW...");

  const { worker } = await import("./mocks/browser");

  console.log("Starting MSW...");

  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });

  console.log("MSW successfully started!");
}

async function bootstrap() {
  try {
    await enableMocking();
  } catch (error) {
    console.error("MSW initialization error:", error);
  }

  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>,
  );
}

bootstrap();
