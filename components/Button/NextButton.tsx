import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";

interface ButtonProps {
  isPrev: boolean;
  onClick: () => void;
}



export const NextButton = ({ isPrev, onClick }: ButtonProps): JSX.Element => {

  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick();
  }

  return (
    <div
      className="flex justify-center items-center w-[50px] h-[50px] text-textBlue rounded-[30px]"
      onClick={
        (event) => handleClick(event)
      }
    >
     {isPrev ?
      <GoTriangleLeft className="w-8 h-8" /> : 
      <GoTriangleRight className="w-8 h-8"/>}
    </div>
  );
};
