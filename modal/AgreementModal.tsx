import Image from 'next/image';
import styled from 'styled-components';
import Close from '@/public/icons/close.svg';
import { Check } from 'lucide-react';
import { ScrollSection } from '@/components/template/CommentsGroup';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import useAgreementStore from '@/store/agreement';
import { Circulation, SubmitCirculationData } from '@/types/data';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCirculations, submitCheckedReport } from '@/pages/api/reportApi';

interface AgreementProps {
  workspace: number;
  setPopupType: React.Dispatch<React.SetStateAction<string | null>>;
  sheetName: Circulation;
  onClose: () => void;
}

export interface QuillViewerProps {
  content: string; // HTML 콘텐츠
}

const AgreementSection = styled.section`
  min-width: 24rem;
  width: 600px;
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  padding: 0 3rem;
  box-shadow: '0 10px 15px rgba(0, 0, 0, 0.1),0 4px 6px rgba(0, 0, 0, 0.05)';
  background-color: white;
  height: 80vh;
`;

export const ReportDiv = styled.div`
  width: 5px;
  height: 30px;
  background-color: var(--mainOrange);
  margin-right: 1rem;
`;

export const ReportSection = styled(ScrollSection)`
  height: 45vh;
`;

export const AgreementModal = ({
  workspace,
  sheetName,
  onClose,
  setPopupType,
}: AgreementProps): JSX.Element => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { agreement, setAgreement } = useAgreementStore();

  const { data: circulations, isSuccess } = useQuery({
    queryKey: ['circulation'],
    queryFn: () => getCirculations(),
  });

  useEffect(() => {
    if (circulations) {
      setAgreement(circulations);
    }
  }, [isSuccess]);

  const QuillViewer: React.FC<QuillViewerProps> = ({ content }): ReactNode => {
    const [sanitizedContent, setSanitizedContent] = useState<string>('');

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const cleanContent = DOMPurify.sanitize(content);
        setSanitizedContent(cleanContent);
      }
    }, [content]);

    return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
  };

  const submitAgreementData = useMutation({
    mutationKey: ['agreement-submit'],
    mutationFn: (data: SubmitCirculationData) => submitCheckedReport(data),
    onSuccess: () => setPopupType('success'),
    onError: () => setPopupType('error'),
  });

  return (
    <AgreementSection>
      <div className="flex justify-between">
        <h1 className="my-10 text-xl font-bold">보고서 회람하기</h1>
        <button onClick={onClose} className="my-10">
          <Image src={Close} width={23} height={23} alt="닫기 버튼" />
        </button>
      </div>
      {sheetName.empty_report.length > 0 && (
        <div className="flex mb-5 items-center">
          <ReportDiv />
          <span className="mr-5">해당사항없음</span>
          <h2
            className={`font-bold w-80 ${sheetName.empty_report.length > 5 ? 'h-12 overflow-y-scroll' : ''}`}
          >
            {sheetName.empty_report.join(', ')}
          </h2>
        </div>
      )}
      {sheetName.written_report.length > 0 && (
        <div className="flex mb-5 items-center">
          <ReportDiv />
          <span className="mr-2">해당파일</span>
          <h2
            className={`font-bold w-80 ${sheetName.written_report.length > 5 ? 'h-12 overflow-y-scroll' : ''}`}
          >
            {sheetName.written_report.join(', ')}
          </h2>
        </div>
      )}
      <ReportSection className="bg-gray-100 p-4 rounded-md text-lg h-[50vh] overflow-y-scroll">
        <QuillViewer content={agreement} />
      </ReportSection>
      <div className="relative flex mt-5 items-center">
        <input
          id="agreement"
          className="hidden"
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label
          htmlFor="agreement"
          className={`flex cursor-pointer items-center justify-center w-4 h-4 rounded border-2 border-mainOrange mr-2 ${
            isChecked ? 'bg-mainOrange' : ''
          }`}
        >
          {isChecked && <Check className="w-4 h-4 text-white" />}
        </label>
        <label htmlFor="agreement" className="font-lg">
          해당 사항에 대해 모두 동의합니다.
        </label>
      </div>
      <div className="mt-5 self-end">
        <PrimaryButton
          text="회람하기"
          size={'big'}
          color={'mainOrange'}
          onClick={() => {
            const updatedReport = {
              workspace: workspace,
              written_report: sheetName.written_report,
              empty_report: sheetName.empty_report,
              agreed: isChecked,
              circulations_template: agreement,
            };

            submitAgreementData.mutate(updatedReport);
          }}
        />
      </div>
    </AgreementSection>
  );
};
