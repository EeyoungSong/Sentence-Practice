import { PlusButton } from '@/components/Button/PlusButton';
import { BoxLayout } from '@/components/BoxLayout';
import { TwoSpaceTextBox } from '@/components/TwoSpaceTextBox';
import { QuestionLayout } from '@/components/QuestionLayout';
import { Button } from '@/components/Button/Button';
import { useRouter } from 'next/router';

export default function Home(): JSX.Element {
  const router = useRouter();
  return (
    <>
      <main className="flex justify-center w-[100%] m-auto mt-10 text-textBlue">
        <div className="flex-col justify-center items-center w-[400px] h-[932px] space-y-10 p-5">
          <div className="flex-row justify-end items-center w-[100%] h-[40px]">
            {/* <Droplet className="w-8 h-8 flex" /> */}
            <PlusButton />
          </div>
          <div className="flex-row justify-end items-center w-[100%] h-[500px]">
            {/* <Droplet className="w-8 h-8 flex" /> */}
            <BoxLayout>
              <QuestionLayout
                type="button-row"
                question="몇번이나 연습하고싶어?"
                buttons={['a', 'b']}
              />
            </BoxLayout>
          </div>
          <TwoSpaceTextBox textBack="a" textFront="b" />
          <Button text="카테고리로" onClick={() => router.push('/categories')} size="big" />
          {/* <BigButton text='aaaaaaa' /> */}
        </div>
      </main>
    </>
  );
}
