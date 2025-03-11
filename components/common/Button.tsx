import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

interface Props extends ButtonProps {
  title: string;
  asChild?: boolean;
  children: React.ReactNode;
  handleClick?: () => void;
}

export const Btn = (props: Props) => {
  const { size, variant, title, asChild, children, handleClick } = props;
  return (
    <Button
      className="p-3 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      variant={variant}
      size={size}
      title={title}
      asChild={asChild}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};
