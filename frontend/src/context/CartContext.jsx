import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Service charge constant
export const SERVICE_CHARGE = 2;

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);

  // Load cart from localStorage when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated() && user) {
        const userCartKey = `cart_${user.id || user.email}`;
        const savedCart = localStorage.getItem(userCartKey);
        let parsedCart = savedCart ? JSON.parse(savedCart) : [];
        setCart(parsedCart);

        // Fetch corresponding Product document if the cart item is missing Cloudinary images
        const needsFetch = parsedCart.some(item => !item.image_url && !(item.images && item.images.length > 0) && !item.image);
        if (needsFetch) {
          try {
            const updatedCart = await Promise.all(parsedCart.map(async item => {
              if (!item.image_url && !(item.images && item.images.length > 0) && !item.image) {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${item.id}`);
                if (res.ok) {
                  const data = await res.json();
                  return { ...item, image_url: data.image_url, images: data.images };
                }
              }
              return item;
            }));
            setCart(updatedCart);
          } catch (err) {
            console.error('Error fetching missing cart images:', err);
          }
        }
      } else {
        // Clear cart if not authenticated
        setCart([]);
      }
    };
    loadCart();
  }, [user, isAuthenticated]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated() && user) {
      const userCartKey = `cart_${user.id || user.email}`;
      localStorage.setItem(userCartKey, JSON.stringify(cart));
    }
  }, [cart, user, isAuthenticated]);

  const addToCart = (product) => {
    if (!isAuthenticated()) {
      return false; // Return false if not authenticated
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item =>
        item.id === product.id &&
        JSON.stringify(item.customization) === JSON.stringify(product.customization)
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id &&
            JSON.stringify(item.customization) === JSON.stringify(product.customization)
            ? { ...item, quantity: item.quantity + product.quantity, price: product.price || item.price }
            : item
        );
      }

      return [...prevCart, product];
    });
    return true; // Return true if successfully added
  };

  const removeFromCart = (productId) => {
    setCart(prevCart =>
      prevCart.filter(item => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (isAuthenticated() && user) {
      const userCartKey = `cart_${user.id || user.email}`;
      localStorage.removeItem(userCartKey);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + ((item.finalPrice || item.price || 0) * item.quantity), 0);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + ((Number(item.finalPrice) || Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
  };

  const getServiceCharge = () => {
    return cart.length > 0 ? SERVICE_CHARGE : 0;
  };

  const getFinalTotal = () => {
    return getCartSubtotal() + getServiceCharge();
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartSubtotal,
      getServiceCharge,
      getFinalTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
