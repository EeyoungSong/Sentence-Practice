import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { TitleInfo } from '@/components/title/TitleInfo';
import useAgreementStore from '@/store/agreement';
import 'react-quill-new/dist/quill.snow.css';
import { ReactSVG } from 'react-svg';
import dynamic from 'next/dynamic';
import { useMutation } from '@tanstack/react-query';
import { modifyCirculations } from '@/pages/api/reportApi';
import { useState } from 'react';
import { Portal } from './ModalPortal';
import { AlertPopup } from '@/components/alert/AlertPopup';
import { AlertType } from '@/types/alert';

interface AgreementEditorProps {
  onClose: () => void;
}

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

export const AgreementEditorModal = ({ onClose }: AgreementEditorProps): JSX.Element => {
  const { agreement, setAgreement } = useAgreementStore();
  const [isDone, setIsDone] = useState<boolean>(false);

  const modifyCirculationsInfo = useMutation({
    mutationKey: ['modify-circulations'],
    mutationFn: () => modifyCirculations(agreement),
    onMutate: () => setIsDone(true),
  });

  const handleSave = (): void => {
    modifyCirculationsInfo.mutate();
  };

  const handleEditorChange = (value: string): void => {
    setAgreement(value);
  };

  return (
    <section className="w-1/2 bg-white h-full rounded-lg flex flex-col">
      <div className="flex justify-between mx-10 my-7">
        <TitleInfo title="회람내용 수정하기" />
        <div className="cursor-pointer">
          <ReactSVG src="/icons/close.svg" className="w-5 h-5" onClick={onClose} />
        </div>
      </div>
      <ReactQuill
        theme="snow"
        value={agreement}
        onChange={handleEditorChange}
        placeholder=""
        style={{ height: '50vh', margin: '0 40px 10px 40px' }}
      />
      <div className="mt-5 mb-4 self-end mr-10">
        <PrimaryButton onClick={handleSave} text={'수정하기'} color="mainOrange" size="big" />
      </div>
      {isDone && (
        <Portal>
          <AlertPopup
            type={AlertType.SUCCESS}
            message="수정되었습니다."
            onClose={() => {
              setIsDone(false);
              onClose();
            }}
          />
        </Portal>
      )}
    </section>
  );
};
