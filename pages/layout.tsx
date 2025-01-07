import localFont from 'next/font/local';
import React from 'react';

const mainFont = localFont({
  src: '../public/Pretendard.ttf',
});

export const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <div lang="ko" className={mainFont.className}>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
