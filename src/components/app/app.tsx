import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';

import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../layouts';
import { ProtectedRoute } from '../protected-route';
import { IngredientDetails, Modal, OrderInfo } from '@components';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectItem,
  selectOrder,
  setSelectedOrder,
  setSelectItem
} from '../../store/slices/rootSlice';
import { useLocation } from 'react-router';
import { ItemPageUI } from '../ui/pages/item-page';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const orderData = useSelector(selectOrder);
  const background = location.state;

  function extractStringAfterFeed(str: string, category: string) {
    let regex = /\/feed\/(\d+)/;
    if (category === 'feed') {
      regex = /\/feed\/(\d+)/;
    } else if (category === 'order') {
      regex = /\/profile\/orders\/(.*)/;
    }
    const match = str.match(regex);
    if (match) {
      return match[1]; // Возвращаем найденное значение после '/feed/'
    } else {
      return null; // Возвращаем null, если совпадений не найдено
    }
  }

  const updatedTitleFeed = extractStringAfterFeed(location.pathname, 'feed');
  const updatedTitleOrder = extractStringAfterFeed(location.pathname, 'order');

  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            background ? (
              <Modal
                title={orderData?.number === 0 ? '' : `#${orderData?.number}`}
                onClose={() => {
                  dispatch(setSelectedOrder('close'));
                  navigate('/feed');
                }}
              >
                <OrderInfo />
              </Modal>
            ) : (
              <ItemPageUI
                title={updatedTitleFeed !== null ? `#${updatedTitleFeed}` : ''}
              >
                <OrderInfo />
              </ItemPageUI>
            )
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            background ? (
              <Modal
                title={'Детали ингредиента'}
                onClose={() => {
                  dispatch(setSelectItem(null));
                  navigate('/');
                }}
              >
                <IngredientDetails />
              </Modal>
            ) : (
              <ItemPageUI title='Детали ингредиента'>
                <IngredientDetails />
              </ItemPageUI>
            )
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            background ? (
              <Modal
                title={orderData?.number === 0 ? '' : `#${orderData?.number}`}
                onClose={() => {
                  dispatch(setSelectedOrder('close'));
                  navigate('/profile/orders');
                }}
              >
                <OrderInfo />
              </Modal>
            ) : (
              <ItemPageUI
                title={
                  updatedTitleOrder !== null ? `#${updatedTitleOrder}` : ''
                }
              >
                <OrderInfo />
              </ItemPageUI>
            )
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Route>
    </Routes>
  );
};

export default App;
