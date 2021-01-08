import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...attribute }) => (
  <Container type="button" {...attribute}>
    {children}
  </Container>
);

export default Button;
