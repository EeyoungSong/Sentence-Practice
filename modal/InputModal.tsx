import { useState } from 'react';
import { ReactSVG } from 'react-svg';

interface DescriptionForm {
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export const InputModal: React.FC<DescriptionForm> = ({ title, onClose, onConfirm }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleFocus = (): void => setIsFocused(true);
  const handleBlur = (): void => {
    if (inputValue === '') {
      setIsFocused(false);
    }
  };

  return (
    <section className="shadow-xl rounded-[10px] w-80 h-64 flex flex-col items-center">
      <span className="flex w-full justify-between px-3 pb-1 text-mainOrange">
        <ReactSVG src="/icons/warning.svg" className="w-8 h-8" />
        <ReactSVG src="/icons/close.svg" className="w-5 h-5" onClick={onClose} />
      </span>
      <p className="self-start pl-3 pb-3 font-bold">{title}</p>
      <div className="relative mx-3 w-11/12">
        {!isFocused && inputValue === '' && (
          <label className="absolute left-4 top-3 text-xs text-[#696969]">
            사유를 입력해주세요
          </label>
        )}
        <textarea
          className={`w-full h-28 bg-[#EDEDED] rounded-[10px] px-3 pb-3 mb-2 focus:outline-none resize-none ${
            isFocused || inputValue !== '' ? 'pt-3 text-sm' : 'pt-6'
          } custom-scroll`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
      </div>
      <div className="flex w-1/2 justify-around">
        <button
          className="text-mainOrange border border-mainOrange w-16 h-8 rounded-[7px]"
          onClick={onClose}
        >
          취소
        </button>
        <button className="bg-mainOrange w-16 h-8 rounded-[7px] text-white" onClick={onConfirm}>
          확인
        </button>
      </div>
    </section>
  );
};
