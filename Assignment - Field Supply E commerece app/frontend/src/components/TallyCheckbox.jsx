export const TallyCheckbox = ({ label, checked, onChange }) => {
  return (
    <label className="tally-label group inline-flex items-center space-x-3 cursor-pointer">
      <input 
        type="checkbox" 
        className="hidden" 
        checked={checked} 
        onChange={onChange} 
      />
      <div className="relative flex items-center justify-center w-6 h-6 border-2 border-ink bg-transparent group-hover:border-rust transition-colors">
        {checked && (
          <svg className="w-5 h-5 text-rust absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20L20 4" />
            <path d="M4 4l16 16" />
          </svg>
        )}
      </div>
      <span className="font-mono text-ink text-sm uppercase tracking-wide group-hover:text-rust transition-colors">
        {label}
      </span>
    </label>
  );
};
