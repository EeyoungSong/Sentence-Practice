import { PlusButton } from '@/components/PlusButton';
import { SwitchBtn } from '@/components/SwitchButton';
import { TextBox } from '@/components/TextBox';
import { Droplet, Plus } from 'lucide-react';

export default function Home(): JSX.Element {
  return (
    <>
      <main className="flex justify-center w-[100%] m-auto mt-10 text-textBlue">
        <div className="flex-col justify-center items-center w-[430px] h-[932px] space-y-10 p-5 bg-blue-300">
          <div className="flex-row justify-between w-[430px] h-[40px]">
            <Droplet className="w-10 h-10 flex" />
            <PlusButton />
          </div>
          <SwitchBtn />
          <TextBox children={<>안녕</>} />
        </div>
      </main>
    </>
  );
}
