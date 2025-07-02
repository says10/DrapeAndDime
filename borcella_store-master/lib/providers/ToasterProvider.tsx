import { Toaster } from "sonner";

// Temporary replacement to test if sonner is causing the sw.js issue
const ToasterProvider = () => {
  return <Toaster richColors position="top-center" />;
}

export default ToasterProvider;