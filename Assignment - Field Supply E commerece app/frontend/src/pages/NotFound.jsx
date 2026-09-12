import { Link } from 'react-router-dom';
import { StampButton } from '../components/StampButton';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="border-4 border-ink p-12 bg-cream max-w-2xl">
        <h1 className="font-serif text-5xl md:text-7xl font-bold uppercase tracking-tight text-ink mb-6">
          Lost in the Field
        </h1>
        <p className="font-mono text-xl mb-10 text-rust">
          Error 404
        </p>
        <p className="font-serif text-lg mb-10 leading-relaxed">
          Your bearing seems to be incorrect. The coordinates you have provided do not match any known outposts or supply caches in our records.
        </p>
        <Link to="/">
          <StampButton>Recalibrate Bearing</StampButton>
        </Link>
      </div>
    </div>
  );
};
