import React, { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  isAuthCheckedSelector,
  makeOrder,
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest,
  selectOrders,
  setOrderModalData,
  setOrderRequest,
  userDataSelector
} from '../../store/slices/burgerSlice';
import { Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isAuthChecked = false;
  const user = useSelector(userDataSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (
      !constructorItems.bun ||
      !constructorItems.ingredients.length ||
      orderRequest
    )
      return;
    if (!user) {
      return navigate('/login');
    }
    dispatch(setOrderRequest(true));
    dispatch(
      makeOrder(constructorItems.ingredients.map((el: TIngredient) => el._id))
    );
  };
  const closeOrderModal = () => {
    dispatch(setOrderRequest(false));
    if (orderModalData) {
      dispatch(setOrderModalData(null));
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
