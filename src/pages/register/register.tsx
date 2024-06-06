import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { loginUserApi, registerUserApi } from '@api';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const passwordRegex = /^.{6,}$/;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!passwordRegex.test(password)) {
      return;
    }
    setErrorText('');
    try {
      const data = await registerUserApi({ email, password, name: userName });
      navigate('/login');
    } catch (e: any) {
      setErrorText(e.message);
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
