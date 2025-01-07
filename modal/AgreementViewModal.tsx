import { ReportView } from '@/types/data';
import { ReactSVG } from 'react-svg';
import { QuillViewerProps, ReportSection } from './AgreementModal';
import { ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface AgreementViewProps {
  sheetInfo: ReportView;
  onClose: () => void;
}

export const AgreementViewModal = ({ sheetInfo, onClose }: AgreementViewProps): JSX.Element => {
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

  return (
    <section className="shadow-xl rounded-lg w-5/12 h-[80vh] flex flex-col bg-white p-6 justify-around">
      <div className="flex justify-between">
        <div></div>
        <h2 className="text-xl font-bold text-center mt-2 mb-6 border-b pb-2">제출 정보</h2>
        <ReactSVG src="/icons/close.svg" className="w-5 h-5 cursor-pointer" onClick={onClose} />
      </div>
      <div className="flex flex-col justify-around h-full">
        <div className="flex flex-col">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">해당 보고서:</span>
            <span className="text-gray-700">
              {sheetInfo.written_report.length === 0 ? '없음' : sheetInfo.written_report.join(', ')}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">해당사항없음:</span>
            <span className="text-gray-700">
              {sheetInfo.empty_report.length === 0 ? '없음' : sheetInfo.empty_report.join(', ')}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">제출자:</span>
            <span className="text-gray-700">{sheetInfo.submitter}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">제출일자:</span>
            <span className="text-gray-700">{sheetInfo.created_at.toString().split('T')[0]}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">동의여부:</span>
            <span className="text-gray-700">{sheetInfo.agreed ? '동의' : '동의하지 않음'}</span>
          </div>
        </div>
        <ReportSection className="bg-gray-100 p-4 rounded-md text-lg h-[50vh] overflow-y-scroll">
          <QuillViewer content={sheetInfo.submitted_template} />
        </ReportSection>
      </div>
    </section>
  );
};
