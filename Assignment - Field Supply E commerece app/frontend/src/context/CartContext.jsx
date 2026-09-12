import { createContext, useReducer } from 'react';

export const CartContext = createContext();

const initialState = {
  items: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, name, price, stock, quantity } = action.payload;
      const stockLimit = typeof stock === 'number' ? stock : 50;
      const existingItemIndex = state.items.findIndex(item => item.productId === productId);

      if (existingItemIndex > -1) {
        const currentItem = state.items[existingItemIndex];
        const effectiveStock = typeof currentItem.stock === 'number' ? currentItem.stock : stockLimit;
        const newQuantity = Math.min(currentItem.quantity + quantity, effectiveStock);
        const newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...currentItem,
          stock: effectiveStock,
          quantity: newQuantity
        };
        return { ...state, items: newItems };
      }
      return { 
        ...state, 
        items: [...state.items, { 
          productId, 
          name, 
          price, 
          stock: stockLimit, 
          quantity: Math.min(quantity, stockLimit) 
        }] 
      };
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item => {
          if (item.productId === action.payload.productId) {
            const maxStock = typeof action.payload.max === 'number' 
              ? action.payload.max 
              : (typeof item.stock === 'number' ? item.stock : Infinity);
            const clampedQty = Math.max(1, Math.min(action.payload.quantity, maxStock));
            return { 
              ...item, 
              stock: typeof action.payload.max === 'number' ? action.payload.max : item.stock,
              quantity: clampedQty 
            };
          }
          return item;
        }),
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload.productId),
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product, quantity) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { 
        productId: product.id, 
        name: product.name, 
        price: product.price, 
        stock: product.stock, 
        quantity 
      },
    });
  };

  const updateQuantity = (productId, quantity, max) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity, max } });
  };

  const removeItem = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cart: state.items, addItem, updateQuantity, removeItem, clearCart, getSubtotal }}>
      {children}
    </CartContext.Provider>
  );
};
