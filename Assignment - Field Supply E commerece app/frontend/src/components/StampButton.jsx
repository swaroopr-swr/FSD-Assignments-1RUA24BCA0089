export const StampButton = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) => {
  const baseStyle = 'border-2 border-ink px-6 py-3 font-mono uppercase tracking-widest font-bold transition-all active:translate-y-1';
  
  const variants = {
    primary: 'bg-ink text-paper hover:bg-opacity-90',
    outline: 'bg-transparent text-ink hover:bg-ink hover:text-paper',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed active:translate-y-0' : ''} ${className}`}
    >
      {children}
    </button>
  );
};
