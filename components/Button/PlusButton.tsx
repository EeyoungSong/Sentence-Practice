import { FiPlus } from 'react-icons/fi';

export const PlusButton = (): JSX.Element => {
  return (
    <div className="flex justify-center w-[40px] h-[40px] items-center relative bg-[#D6ECFE] text-white rounded-[10px]">
      <FiPlus className="w-[28px] h-[28px]" />
    </div>
  );
};
