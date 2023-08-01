import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
}

const Button = ({ children }: ButtonProps) => {
  return <button className="w-400 h-300">{children}</button>;
};

export default Button;
