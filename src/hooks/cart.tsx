import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { Product } from '../pages/Cart/styles';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE

      const getProductsString = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );
      if (!getProductsString) {
        const getProducts = JSON.parse(getProductsString as string);
        setProducts(getProducts as Product[]);
      } else {
        // setProducts([]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      try {
        if (!products) {
          product.quantity = 1;
          setProducts([product]);
        } else {
          const findProduct = products.find(prod => prod.id === product.id);
          if (!findProduct) {
            product.quantity = 1;
            setProducts([...products, product]);
          }

          await AsyncStorage.setItem(
            '@GoMarketplace:products',
            JSON.stringify(products),
          );
        }
      } catch (err) {
        console.log(err);
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const findProduct = products.find(prod => prod.id === id);

      if (findProduct) {
        findProduct.quantity += 1;

        const productsUpdated = products.map(prod => {
          if (prod.id === id) {
            return findProduct;
          }
          return prod;
        });

        setProducts(productsUpdated);

        await AsyncStorage.setItem(
          '@GoMarketplace:products',
          JSON.stringify(products),
        );
      } else {
        throw new Error('product not find.');
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART

      const findProduct = products.find(prod => prod.id === id);
      if (findProduct) {
        findProduct.quantity -= 1;

        if (findProduct.quantity === 0) {
          setProducts(
            products.filter(product => product.id !== findProduct.id),
          );
        } else {
          const productsUpdated = products.map(prod => {
            if (prod.id === id) {
              return findProduct;
            }
            return prod;
          });
          setProducts(productsUpdated);
        }

        await AsyncStorage.setItem(
          '@GoMarketplace:products',
          JSON.stringify(products),
        );
      } else {
        throw new Error('product not find.');
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
