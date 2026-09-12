import { QuantityStepper } from './QuantityStepper';

export const CartLineItem = ({ item, stock, onUpdate, onRemove }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-ink py-6 gap-4">
      <div className="flex-1">
        <h4 className="font-serif text-xl font-bold">{item.name}</h4>
        <div className="flex items-center gap-3 mt-1">
          <span className="font-mono text-sm text-rust">SKU-{item.productId.padStart(4, '0')}</span>
          {typeof stock === 'number' && (
            <span className="font-mono text-xs opacity-60">
              (Limit: {stock})
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-6">
        <QuantityStepper 
          quantity={item.quantity} 
          max={stock} 
          onChange={(newQuantity) => onUpdate(item.productId, newQuantity, stock)}
        />
        
        <div className="w-24 text-right">
          <span className="font-mono text-lg">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        
        <button 
          onClick={() => onRemove(item.productId)}
          className="font-mono text-sm text-ink hover:text-rust underline p-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
