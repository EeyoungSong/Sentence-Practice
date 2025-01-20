interface ButtonProps {
  text: string;
  onClick: () => void;
  size: 'small' | 'big';
}

export const Button = ({ text, onClick, size }: ButtonProps): JSX.Element => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    event.stopPropagation();
    onClick();
  };
  return (
    <div
      className={`flex justify-center items-center ${size === 'big' ? 'w-[160px] h-[60px]' : 'w-[120px] h-[40px]'} bg-[#CDE8FF] text-textBlue rounded-[30px]`}
      onClick={(event) => handleClick(event)}
    >
      {text}
    </div>
  );
};
