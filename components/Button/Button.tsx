import { FiPlus } from 'react-icons/fi';

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export const Button = ({ text, onClick }: ButtonProps): JSX.Element => {
  return (
    <div
      className="flex justify-center items-center w-[160px] h-[60px] bg-[#CDE8FF] text-textBlue rounded-[30px]"
      onClick={onClick}
    >
      {text}
    </div>
  );
};
