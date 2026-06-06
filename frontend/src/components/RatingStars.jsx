import { Star } from 'lucide-react';

function RatingStars({ value = 0, interactive = false, onChange, size = 20 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = value >= star;

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                size={size}
                className={filled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
              />
            </button>
          );
        }

        return (
          <Star
            key={star}
            size={size}
            className={filled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
          />
        );
      })}
    </div>
  );
}

export default RatingStars;
