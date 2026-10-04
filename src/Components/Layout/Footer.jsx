import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faLocationDot,
  faCreditCard,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
const logo = '/freshcart-logo.svg';

const linkClass = 'text-gray-400 hover:text-primary-400 transition-colors text-sm';

const columns = [
  {
    title: 'Shop',
    span: 'lg:col-span-2',
    links: [
      { to: '/products', label: 'All Products' },
      { to: '/categories', label: 'Categories' },
      { to: '/brands', label: 'Brands' },
      { to: '/products?category=6439d58a0049ad0b52b9003f', label: 'Electronics' },
      { to: '/products?category=6439d2d167d9aa4ca970649f', label: "Men's Fashion" },
      { to: '/products?category=6439d5b90049ad0b52b90048', label: "Women's Fashion" }
    ]
  },
  {
    title: 'Account',
    span: 'lg:col-span-2',
    links: [
      { to: '/profile', label: 'My Account' },
      { to: '/profile/orders', label: 'Order History' },
      { to: '/wishlist', label: 'Wishlist' },
      { to: '/cart', label: 'Shopping Cart' },
      { to: '/login', label: 'Sign In' },
      { to: '/register', label: 'Create Account' }
    ]
  },
  {
    title: 'Support',
    span: 'lg:col-span-2',
    links: [
      { to: '/contact', label: 'Contact Us' },
      { to: '/help', label: 'Help Center' },
      { to: '/shipping', label: 'Shipping Info' },
      { to: '/returns', label: 'Returns & Refunds' },
      { to: '/track-order', label: 'Track Order' }
    ]
  },
  {
    title: 'Legal',
    span: 'lg:col-span-2',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms of Service' },
      { to: '/cookies', label: 'Cookie Policy' }
    ]
  }
];

const socials = [faFacebookF, faTwitter, faInstagram, faYoutube];
const payments = [
  { icon: faCreditCard, label: 'Visa' },
  { icon: faCreditCard, label: 'Mastercard' },
  { icon: faCreditCard, label: 'PayPal' }
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <div className="bg-white rounded-lg px-4 py-2 inline-block">
                <img src={logo} alt="FreshCart Logo" width="160" height="31" className="h-8 w-auto" />
              </div>
            </Link>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              FreshCart is your one-stop destination for quality products. From fashion to
              electronics, we bring you the best brands at competitive prices with a seamless
              shopping experience.
            </p>

            <div className="space-y-3 mb-6">
              <a href="tel:+18001234567" className={`flex items-center gap-3 ${linkClass}`}>
                <FontAwesomeIcon icon={faPhone} className="text-primary-500" />
                <span>+1 (800) 123-4567</span>
              </a>
              <a href="mailto:support@freshcart.com" className={`flex items-center gap-3 ${linkClass}`}>
                <FontAwesomeIcon icon={faEnvelope} className="text-primary-500" />
                <span>support@freshcart.com</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <FontAwesomeIcon icon={faLocationDot} className="text-primary-500 mt-0.5" />
                <span>123 Commerce Street, New York, NY 10001</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {socials.map((icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={icon} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className={column.span}>
              <h3 className="font-semibold text-lg mb-5">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} FreshCart. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {payments.map((payment) => (
                <div key={payment.label} className="flex items-center gap-2 text-gray-500 text-sm">
                  <FontAwesomeIcon icon={payment.icon} />
                  <span>{payment.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}