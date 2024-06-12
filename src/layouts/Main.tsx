import React from 'react';
import { AppHeader } from '@components';
import { Outlet } from 'react-router-dom';
import styles from '../components/app/app.module.css';

export const MainLayout = () => (
  <div className={styles.app}>
    <AppHeader />
    <Outlet />
  </div>
);
