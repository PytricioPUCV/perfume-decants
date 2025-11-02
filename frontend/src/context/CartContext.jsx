import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      localStorage.removeItem('cart');
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Agregar producto al carrito
  const addItem = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Si ya existe, actualizar cantidad
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, agregar nuevo
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Eliminar producto del carrito
  const removeItem = (productId) => {
    setItems((prevItems) => prevItems.filter(item => item._id !== productId));
  };

  // Limpiar carrito
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  // Calcular subtotal
  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  // Calcular cantidad total de items
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return items.some(item => item._id === productId);
  };

  // Obtener cantidad de un producto específico
  const getItemQuantity = (productId) => {
    const item = items.find(item => item._id === productId);
    return item ? item.quantity : 0;
  };

  // Memoizar valor del contexto
  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      getSubtotal,
      getTotalItems,
      isInCart,
      getItemQuantity,
      itemCount: items.length,
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
