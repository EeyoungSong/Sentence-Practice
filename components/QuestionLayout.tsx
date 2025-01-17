interface InsideLayoutProps {
  type: 'input' | 'button-col' | 'button-row';
  question: string;
  buttons?: string[];
  inputAnswer?: string;
  selectedButtonIdx?: number;
}

export const QuestionLayout = ({ type, question, buttons }: InsideLayoutProps): JSX.Element => {
  return (
    <div className="flex flex-col justify-center items-center relative text-textBlue p-4 rounded-[30px] min-h-[300px] w-[100%]">
      <div className="text-textBlue m-5 text-lg font-bold">{question}</div>
      {type === 'input' ? (
        <>
          <div>
            <input
              type="text"
              defaultValue={3}
              className="text-center text-textBlue m-2 w-[3rem] border-b-2 border-textBlue focus:outline-none focus:transition duration-300"
            ></input>
            번
          </div>
        </>
      ) : (
        <>
          <div className={`${type === 'button-col' ? '' : 'flex flex-row mt-10'}`}>
            {buttons?.map((item, idx) => {
              return (
                <div
                  className={`flex justify-center items-center bg-[#CDE8FF] rounded-[30px] ${type === 'button-col' ? 'h-[40px] w-[200px] m-2' : 'h-[40px] w-[70px] m-2'}`}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
