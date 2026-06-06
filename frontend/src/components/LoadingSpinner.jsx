import { Loader2 } from 'lucide-react';

function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

export default LoadingSpinner;
