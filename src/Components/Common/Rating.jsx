import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular, faStarHalfStroke } from '@fortawesome/free-regular-svg-icons';

export function calcDiscount(price, priceAfterDiscount) {
  if (!priceAfterDiscount || priceAfterDiscount >= price) return 0;
  return 100 - Math.round((priceAfterDiscount / price) * 100);
}

export default function Rating({ rating = 0 }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <>
      {[0, 1, 2, 3, 4].map((index) => {
        if (index < full)
          return <FontAwesomeIcon key={index} icon={faStar} className="text-yellow-400" />;
        if (index === full && hasHalf)
          return (
            <FontAwesomeIcon
              key={index}
              icon={faStarHalfStroke}
              className="text-yellow-400"
            />
          );
        return <FontAwesomeIcon key={index} icon={faStarRegular} className="text-yellow-400" />;
      })}
    </>
  );
}