"use client";

import { useEffect } from "react";

export default function ClientErrorLogger() {
  useEffect(() => {
    function onError(event: ErrorEvent) {
      try {
        // Print helpful details to console
        console.error("ClientErrorLogger caught error:", event.error || event.message, event);
      } catch (e) {
        // swallow logger errors
      }
    }

    function onRejection(event: PromiseRejectionEvent) {
      try {
        console.error("ClientErrorLogger unhandledrejection:", event.reason, event);
      } catch (e) {
        // swallow logger errors
      }
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
