import { Toaster } from "sonner";

const ToasterProvider = () => {
  return <Toaster 
    position="top-right"
    richColors
    closeButton
    duration={4000}
  />;
}

export default ToasterProvider;