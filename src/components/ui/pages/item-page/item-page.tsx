import React, { FC, ReactNode } from 'react';

import styles from '../common.module.css';

interface ItemPageUIProps {
  children: ReactNode;
  title: string;
}

export const ItemPageUI: FC<ItemPageUIProps> = ({ children, title }) => (
  <main className={styles.container}>
    <div className={`${styles.wrapCenter}`}>
      <h3 className={`text text_type_main-large pb-3 pt-10 ${styles.header}`}>
        {title}
      </h3>
      {children}
    </div>
  </main>
);
