import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-4">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <ul className="flex flex-wrap flex-col sm:flex-row justify-center gap-4 sm:gap-8">
          <li>
            <Link href="/about-us" className="hover:text-red-1">About Us</Link>
          </li>
          <li>
            <Link href="/terms-and-conditions" className="hover:text-red-1">
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link href="/shipping-policy" className="hover:text-red-1">
              Shipping Policy
            </Link>
          </li>
          <li>
            <Link href="/cancellation-and-refunds" className="hover:text-red-1">
              Cancellation & Refunds
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
