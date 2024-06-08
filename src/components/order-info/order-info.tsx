import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  loadIngridient,
  loadIngridients,
  loadOrder,
  selectIngredients,
  selectOrder,
  setSelectedOrder
} from '../../store/slices/rootSlice';
import { useParams } from 'react-router-dom';

type TOrderDetails = {
  background?: null | {
    pathname: string;
    search: string;
    hash: string;
    state: null | string;
    key: string;
  };
};

export const OrderInfo: FC<TOrderDetails> = ({ background }) => {
  const orderData: TOrder = useSelector(selectOrder);
  const dispatch = useDispatch();
  const params = useParams();

  const data = useSelector(selectIngredients);
  const ingredients: TIngredient[] = [
    ...data.buns,
    ...data.mains,
    ...data.sauces
  ];

  useEffect(() => {
    if (background === null && params.number) {
      dispatch(loadIngridients());
      dispatch(loadOrder(Number(params?.number)));
    }
  }, []);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || orderData.number === 0) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
