import { BorderButton } from '@/components/buttons/BorderButton';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import styled from 'styled-components';

interface VerificationModalProps {
  text: string;
  title?: string;
  placeholder: string;
  onConfirm: (event: React.MouseEvent, modifiedName: string) => void;
  onClose: () => void;
}

const VerificationModalSection = styled.section`
  width: 22rem;
  height: 16rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: white;
  color: var(--mainOrange);

  input {
    width: 80%;
    border: 2px solid var(--mainOrange);
    padding: 0.5rem;
    color: black;
    border-radius: 0.25rem;
  }
  input:focus {
    outline: none;
  }
`;

// 검증식 이름 수정만 하는 창 => 이거 검증식 등록할 때도 사용할 것임
export const VerificationModal = ({
  text,
  title,
  placeholder,
  onConfirm,
  onClose,
}: VerificationModalProps): JSX.Element => {
  const [nameValue, setNameValue] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNameValue(event.target.value);
  };

  const handleConfirm = (event: React.MouseEvent): void => {
    onConfirm(event, nameValue);
    onClose();
  };

  useEffect(() => {
    title && setNameValue(title);
  }, [title]);

  return (
    <VerificationModalSection>
      <ReactSVG src={'icons/warning.svg'} className="w-16 h-16" />
      <h1 className="text-2xl font-bold text-black">{`검증식을 ${text}하시겠습니까?`}</h1>
      <input type="text" value={nameValue} onChange={handleInputChange} placeholder={placeholder} />
      <div className="flex">
        <PrimaryButton onClick={handleConfirm} text={text} size="big" color="mainOrange" />
        <BorderButton onClick={onClose} text={'취소'} size="big" color="mainOrange" />
      </div>
    </VerificationModalSection>
  );
};
