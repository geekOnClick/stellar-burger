import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  loadOrders,
  selectIsLoading,
  selectOrders
} from '../../store/slices/burgerSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadOrders());
  }, []);

  if (!orders.length && isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
