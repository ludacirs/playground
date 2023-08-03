import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerServiceWorker = async () => {
        if ("serviceWorker" in navigator) {
          try {
            const registration = await navigator.serviceWorker.register(
              "./sw.js"
            );
            if (registration.installing) {
              console.log("Service worker installing");
            } else if (registration.waiting) {
              console.log("Service worker installed");
            } else if (registration.active) {
              console.log("Service worker active");
            }
          } catch (error) {
            console.error(`Registration failed with ${error}`);
          }
        }
      };

      registerServiceWorker();
    }
  }, []);

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
