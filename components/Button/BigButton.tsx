import { FiPlus } from 'react-icons/fi';

interface BigButtonProps {
    bookId: number;
    text: string;
    onClick: (bookId: number) => void;
}

export const BigButton = ({ bookId, text, onClick }: BigButtonProps): JSX.Element => {
  return (
    <div
      className="flex justify-center items-center w-[160px] h-[200px] bg-toggleBlue text-textBlue rounded-[30px]"
      onClick={() => onClick(bookId)}
    >
      {text}
    </div>
  );
};
