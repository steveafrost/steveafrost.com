import React from 'react';
import styles from '../css/container.module.css';

export default ({ children }) => (
    <div className={styles.container}>{children()}</div>
);
