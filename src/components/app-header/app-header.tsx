import { FC, useEffect } from 'react';
import { AppHeaderUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { loadUser, userDataSelector } from '../../store/slices/rootSlice';
import { useNavigate } from 'react-router-dom';

export const AppHeader: FC = () => {
  const user = useSelector(userDataSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return <AppHeaderUI userName={user?.name || undefined} />;
};
