import React from 'react';

interface TowSpaceTextBoxProps {
  textFront: string;
  textBack: string;
}

export const TowSpaceTextBox = ({ textFront, textBack }: TowSpaceTextBoxProps): JSX.Element => {
  return (
    <>
      <div className="w-full flex flex-col justify-center items-center ">
        <div className="flex justify-center items-center bg-[#CDE8FF] text-textBlue rounded-[10px] rounded-b min-h-[1rem] w-[100%]">
          {textFront}
          {/* Tail 아래의 다양한 요소들 */}
        </div>
        <div className="flex justify-center items-center bg-white text-textBlue rounded-[10px] rounded-t min-h-[1rem] w-[100%]">
          {textBack}
          {/* Tail 아래의 다양한 요소들 */}
        </div>
      </div>
    </>
  );
};
