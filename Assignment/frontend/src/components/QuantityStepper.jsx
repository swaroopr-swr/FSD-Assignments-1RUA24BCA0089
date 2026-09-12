export const QuantityStepper = ({ quantity, max, onChange }) => {
  const handleDecrement = () => {
    if (quantity > 1) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className="inline-flex items-center border-2 border-ink">
      <button 
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className="px-4 py-2 font-mono text-xl hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink transition-colors"
      >
        -
      </button>
      <span className="px-6 py-2 font-mono text-lg border-x-2 border-ink min-w-[3rem] text-center">
        {quantity}
      </span>
      <button 
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="px-4 py-2 font-mono text-xl hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink transition-colors"
      >
        +
      </button>
    </div>
  );
};
