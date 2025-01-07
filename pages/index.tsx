import { SwitchBtn } from '@/components/SwitchButton';
import { TextBox } from '@/components/TextBox';

export default function Home(): JSX.Element {
  return (
    <>
      <main className="flex justify-center w-[100%] m-auto mt-10 text-textBlue">
        <div className="flex-col justify-center items-center w-[430px] space-y-10 p-5 bg-blue-300">
          <SwitchBtn />
          <TextBox text={'안녕'} />
        </div>
      </main>
    </>
  );
}
