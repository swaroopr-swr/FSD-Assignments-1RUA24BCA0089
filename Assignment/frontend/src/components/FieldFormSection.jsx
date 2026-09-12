export const FieldFormSection = ({ number, title, children }) => {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-4 mb-6">
        <span className="font-mono text-rust text-lg font-bold">{number}.</span>
        <h2 className="font-serif text-2xl uppercase tracking-widest text-ink">{title}</h2>
      </div>
      <div className="pl-10">
        {children}
      </div>
    </section>
  );
};

export const DashedDivider = () => (
  <div className="w-full border-t-2 border-dashed border-ink opacity-30 my-8" />
);
