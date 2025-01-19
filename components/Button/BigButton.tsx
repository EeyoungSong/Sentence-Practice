import { FiPlus } from 'react-icons/fi';

interface BigButtonProps {
  text: string;
  onClick?: () => void;
}

export const BigButton = ({ text, onClick }: BigButtonProps): JSX.Element => {
  return (
    <div
      className="flex justify-center items-center w-[160px] h-[200px] bg-toggleBlue text-textBlue rounded-[30px]"
      onClick={onClick}
    >
      {text}
    </div>
  );
};
