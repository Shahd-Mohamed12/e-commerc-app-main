import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck,
  faArrowRotateLeft,
  faShieldHalved,
  faHeadset
} from '@fortawesome/free-solid-svg-icons';

const items = [
  { icon: faTruck, title: 'Free Shipping', text: 'On orders over 500 EGP' },
  { icon: faArrowRotateLeft, title: 'Easy Returns', text: '14-day return policy' },
  { icon: faShieldHalved, title: 'Secure Payment', text: '100% secure checkout' },
  { icon: faHeadset, title: '24/7 Support', text: 'Contact us anytime' }
];

export default function FeaturesStrip() {
  return (
    <div className="bg-primary-50 border-y border-primary-100">
      <div className="container mx-auto px-4 py-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={icon} className="text-primary-600 text-lg" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
                <p className="text-gray-500 text-xs">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}