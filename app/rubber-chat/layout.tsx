import React from 'react';

type Props = {
  children: React.ReactNode;
};

function layout({ children }: Props) {
  return (
    <div className="grid relative items-center justify-items-center h-[100vh] w-full">
      {children}
    </div>
  );
}

export default layout;
