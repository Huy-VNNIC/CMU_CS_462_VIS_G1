import React from 'react';
import { HeaderProps } from '../models/types';

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      {children}
    </header>
  );
};

export default Header;