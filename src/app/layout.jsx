import '@fontsource-variable/exo';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import Providers from './providers';

export const metadata = {
  title: {
    default: 'FreshCart | Online Shopping for Fashion, Electronics & More',
    template: '%s | FreshCart'
  },
  description:
    'FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices.',
  icons: {
    icon: '/favicon.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
