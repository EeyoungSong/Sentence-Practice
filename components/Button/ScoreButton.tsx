interface ButtonProps {
  isSelected: boolean;
  score: number;
  onClick: (score: number) => void;
}

export const ScoreButton = ({ isSelected, score, onClick }: ButtonProps): JSX.Element => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    event.stopPropagation();
    onClick(score);
  };

  return (
    <div
      className={`flex justify-center items-center w-[40px] h-[40px] text-textBlue ${isSelected ? 'bg-[#2A5491]' : 'bg-mainBlue'} rounded-[30px]`}
      onClick={(event) => handleClick(event)}
    >
      {score}
    </div>
  );
};
