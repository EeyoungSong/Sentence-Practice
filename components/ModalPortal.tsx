import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';

const PortalBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 50%);
`;

export const Portal = ({ children }: { children: ReactElement }): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (typeof window === 'undefined') return <></>;

  return mounted ? (
    createPortal(
      <PortalBox>
        <div className="z-100 flex justify-center items-center w-full">{children}</div>
      </PortalBox>,
      document.getElementById('modal-root') as HTMLElement,
    )
  ) : (
    <></>
  );
};
