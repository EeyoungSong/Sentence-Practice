interface BoxLayoutProps {
  children: React.ReactNode; // 동적으로 삽입될 콘텐츠
}

export const BoxLayout = ({ children }: BoxLayoutProps): JSX.Element => {
  return (
    <div className="flex justify-center items-center relative bg-white text-textBlue p-4 rounded-[30px] min-h-[300px] w-[100%]">
      {children}
      {/* Tail 아래의 다양한 요소들 */}
      <div className="absolute bottom-[-30px] right-20 w-0 h-0 border-l-[30px] border-t-[40px] border-r-[30px] border-t-white border-l-transparent border-r-transparent"></div>
      <div className="absolute bottom-[-110px] right-10 w-[80px] h-[60px] bg-white rounded-full filter blur-sm"></div>
      <div className="absolute bottom-[-80px] right-[90px] w-[4px] h-[4px] bg-black rounded-full"></div>
      <div className="absolute bottom-[-80px] right-[75px] w-[4px] h-[4px] bg-black rounded-full"></div>
      <div className="absolute bottom-[-90px] right-[80px] w-[10px] h-[2px] bg-black rounded-full"></div>
    </div>
  );
};
