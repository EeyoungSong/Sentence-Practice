import { GrayButton } from '@/components/buttons/GrayButton';
import { InputBox } from '@/components/input/InputBox';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { ReactSVG } from 'react-svg';
import { TitleInfo } from '@/components/title/TitleInfo';
import { useState } from 'react';

interface DescriptionForm {
  onClose: () => void;
}

export const FindPasswordModal: React.FC<DescriptionForm> = ({ onClose }): JSX.Element => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value); // 입력된 값을 상태로 설정
  };

  const handleSendLinkClick = (): void => {
    console.log(email);
  };

  return (
    <section className="shadow-xl rounded-[10px] w-full h-full flex flex-col justify-center items-center">
      <span className="flex w-full justify-between p-2 text-mainOrange">
        <ReactSVG src="/icons/warning.svg" className="w-8 h-8" />
        <ReactSVG src="/icons/close.svg" className="w-5 h-5" onClick={onClose} />
      </span>
      <div className="flex flex-col px-10 justify-center items-center w-full h-full">
        <TitleInfo title={'비밀번호 찾기'} />
        <InputBox
          info={'이메일'}
          required={false}
          errorComment={''}
          name={email}
          value={email}
          onChange={handleEmailChange}
          disabled={false}
          placeholder="이메일을 입력하세요."
        />
        <div className="my-4 flex flex-row">
          <GrayButton text={'취소'} onClick={onClose} />
          <PrimaryButton
            text={'비밀번호 변경 링크 발송'}
            color="mainOrange"
            onClick={() => handleSendLinkClick()}
            size="big"
          />
        </div>
      </div>
    </section>
  );
};
