import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  loadFeedData,
  selectFeedData,
  selectOrders
} from '../../store/slices/rootSlice';
import { getFeedsApi, TFeedsResponse } from '@api';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const data: TFeedsResponse = useSelector(selectFeedData);
  const orders = data.orders || [];
  const loadItems = async () => {
    try {
      dispatch(loadFeedData());
      await getFeedsApi();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={loadItems} />;
};
