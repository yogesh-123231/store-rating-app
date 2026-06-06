import { MapPin } from 'lucide-react';
import RatingStars from './RatingStars';

function StoreCard({ store, onRate, onModify }) {
  const { name, address, overallRating, userRating, canModify } = store;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-900">{name}</h2>

      <div className="mt-2 flex items-start gap-2 text-sm text-gray-600">
        <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
        <span>{address}</span>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Overall rating
          </p>
          <div className="mt-1 flex items-center gap-2">
            {overallRating !== null ? (
              <>
                <RatingStars value={Math.round(overallRating)} />
                <span className="text-sm font-medium text-gray-700">{overallRating}</span>
              </>
            ) : (
              <span className="text-sm text-gray-500">No ratings yet</span>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Your rating
          </p>
          <div className="mt-1">
            {userRating !== null ? (
              <RatingStars value={userRating} />
            ) : (
              <span className="text-sm text-gray-500">Not rated</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        {canModify ? (
          <button
            type="button"
            onClick={() => onModify(store)}
            className="rounded-xl border border-blue-600 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Modify
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onRate(store)}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Rate
          </button>
        )}
      </div>
    </div>
  );
}

export default StoreCard;
