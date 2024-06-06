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

import { Route, Routes, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts';
import { ProtectedRoute } from '../../utils/ProtectedRoute';
import { IngredientDetails, Modal, OrderInfo } from '@components';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectItem,
  selectOrder,
  setSelectedOrder,
  setSelectItem
} from '../../store/slices/rootSlice';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderData = useSelector(selectOrder);
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <Modal
              title={orderData?.number === 0 ? '' : `#${orderData?.number}`}
              onClose={() => {
                dispatch(setSelectedOrder('close'));
                navigate('/feed');
              }}
            >
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal
              title={'Детали ингредиента'}
              onClose={() => {
                dispatch(setSelectItem(null));
                navigate('/');
              }}
            >
              <IngredientDetails />
            </Modal>
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
            <Modal
              title={orderData?.number === 0 ? '' : `#${orderData?.number}`}
              onClose={() => {
                dispatch(setSelectedOrder('close'));
                navigate('/profile/orders');
              }}
            >
              <OrderInfo />
            </Modal>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Route>
    </Routes>
  );
};

export default App;
