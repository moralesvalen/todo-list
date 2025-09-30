import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header({ className, children = 'My Todos' }) {
  return (
    <div className={`${styles.headerWrap} ${className ?? ''}`}>
      <h1 className={styles.title}>
        <svg
          className={styles.titleIcon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="4"
            ry="4"
            strokeWidth="2"
          />
          <path d="M7 12.5l3.5 3.5L17 9" strokeWidth="2.4" />
        </svg>
        {children}
      </h1>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            [styles.link, isActive ? styles.active : styles.inactive].join(' ')
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            [styles.link, isActive ? styles.active : styles.inactive].join(' ')
          }
        >
          About
        </NavLink>
      </nav>
    </div>
  );
}
