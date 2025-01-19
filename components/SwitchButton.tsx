'use client';

import { useState } from 'react';

interface SwitchBtnProps {
 handleClickButton: (selectedCategory: '문장' | '대화' | '단어') => void;
}

export const SwitchBtn = ({handleClickButton}: SwitchBtnProps): React.ReactElement => {
  const [category, setCategory] = useState<'문장' | '대화' | '단어'>('문장');
  console.log(category);

  return (
    <div>
      <div
        className={`hover:cursor-pointer relative w-auto h-10 flex items-center p-2 bg-toggleBlue rounded-[30px] font-bold text-textBlue`}
      >
        <div
          className={`absolute left-2 w-[calc(33%)] flex justify-center items-center ${category !== '문장' ? '' : 'hidden'} pr-3`}
          onClick={() => {
            setCategory('문장');
            handleClickButton('문장');
          }}
        >
          문장
        </div>
        <div
          className={`absolute left-[calc(35%)] w-[calc(35%)] flex justify-center items-center ${category !== '대화' ? '' : 'hidden'} pr-3`}
          onClick={() => {
            setCategory('대화');
            handleClickButton('대화');
          }}
        >
          대화
        </div>
        <div
          className={`absolute right-2 w-[calc(33%)] flex justify-center items-center ${category !== '단어' ? '' : 'hidden'} pl-3`}
          onClick={() => {
            setCategory('단어');
            handleClickButton('단어');
          }}
        >
          단어
        </div>
        <div
          className={`bg-white w-[calc(33%)] h-8 text-center pt-1 text-textBlue leading-7 shadow-md transform transition-transform duration-400 ease-in-out rounded-[30px] ${category === '대화' ? 'translate-x-[100%]' : category === '단어' ? 'translate-x-[200%]' : ''}`}
        >
          {category}
        </div>
      </div>
    </div>
  );
};
