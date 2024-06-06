import { FC, memo, useEffect } from 'react';

import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  loadIngridients,
  selectIngredients
} from '../../store/slices/rootSlice';
import { TIngredient } from '@utils-types';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const dispatch = useDispatch();
  const data = useSelector(selectIngredients);
  const ingredients: TIngredient[] = [
    ...data.buns,
    ...data.mains,
    ...data.sauces
  ];

  const loadItems = async () => {
    try {
      dispatch(loadIngridients());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!ingredients.length) {
      loadItems();
    }
  }, []);
  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <OrdersListUI orderByDate={orderByDate} />;
});
