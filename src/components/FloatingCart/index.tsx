import React, { useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    if (!products) {
      return formatValue(0);
    }
    const totalPrice = products.reduce(
      (previousProd, currentProd) =>
        previousProd + currentProd.price * currentProd.quantity,
      0,
    );
    return formatValue(totalPrice);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    if (!products) {
      return 0;
    }
    const quantity = products.reduce(
      (previousProd, currentProd) => previousProd + currentProd.quantity,
      0,
    );

    return quantity;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
