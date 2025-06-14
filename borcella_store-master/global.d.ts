declare module '@cashfreepayments/cashfree-js' {
  // Declare the module type (You can adjust this based on the methods and properties you are using)
  export function load(config: { mode: "sandbox" | "production" }): Promise<any>;
}
declare global {
  interface Window {
    Cashfree: any; // Or use a more specific type if available
  }
}
