import React, { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button className="w-400 h-300" {...props}>
      {children}
    </button>
  );
};

export default Button;
