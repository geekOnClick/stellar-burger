import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from '../../services/store';
// import {
//   isAuthCheckedSelector,
//   userDataSelector
// } from '../services/store/selectors';
import { Preloader } from '@ui';
import {
  isAuthCheckedSelector,
  loadUser,
  userDataSelector
} from '../../store/slices/rootSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector); // завершена ли загрузка данных о пользовател
  const user = useSelector(userDataSelector); // данные о пользователе
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  if (!isAuthChecked) {
    // пока идёт чекаут пользователя, показываем прелоадер
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    // если пользователь на странице авторизации и данных в хранилище нет, то делаем редирект
    return <Navigate replace to='/login' state={{ from: location }} />; // в поле from объекта location.state записываем информацию о URL
  }

  if (onlyUnAuth && user) {
    // если пользователь на странице авторизации и данные есть в хранилище
    // при обратном редиректе получаем данные о месте назначения редиректа из объекта location.state
    // в случае если объекта location.state?.from нет — а такое может быть, если мы зашли на страницу логина по прямому URL
    // мы сами создаём объект c указанием адреса и делаем переадресацию на главную страницу
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
