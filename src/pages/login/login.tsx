import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { getUserApi, loginUserApi } from '@api';
import { useDispatch } from '../../services/store';
import { setUser } from '../../store/slices/burgerSlice';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    try {
      const data = await loginUserApi({ email, password });
      if (data) {
        setCookie('accessToken', data.accessToken);
        dispatch(setUser(data.user));
        navigate('/');
      }
    } catch (e: any) {
      setErrorText(e.message);
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
