import Image from 'next/image';
import Upload from '@/public/icons/upload.svg';
import { useRef, useState } from 'react';
import { AttachedFile } from '@/components/upload/AttachedFile';
import { ReactSVG } from 'react-svg';
import { TitleInfo } from '@/components/title/TitleInfo';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';

interface MultiUploadModalProps {
  onClose: () => void;
  onUpload: (formData: FormData) => void;
}

export const MultiUploadModal = ({ onClose, onUpload }: MultiUploadModalProps): JSX.Element => {
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileChange =
    (index: number) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (event.target.files && event.target.files.length > 0) {
        const newFiles = [...files];
        newFiles[index] = event.target.files[0];
        setFiles(newFiles);
      }
    };

  const handleDeleteFile = (index: number): void => {
    const newFiles = [...files];
    newFiles[index] = null;
    setFiles(newFiles);
  };

  const handleDivClick = (index: number) => () => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click();
    }
  };

  const handleUpload = (): void => {
    const formData = new FormData();
    if (files[0]) formData.append('updated_template_file', files[0]);
    if (files[1]) formData.append('txt_zip', files[1]);
    if (files[2]) formData.append('template_zip', files[2]);
    onUpload(formData);
  };

  return (
    <section className="w-1/2 bg-white rounded-lg flex flex-col">
      <div className="flex justify-between mx-10 my-7">
        <TitleInfo title="일괄 업로드 하기" />
        <div className="cursor-pointer">
          <ReactSVG src="/icons/close.svg" className="w-5 h-5" onClick={onClose} />
        </div>
      </div>
      {files.map((file, index) => (
        <div key={index} className="flex my-10 mx-10 justify-between">
          <div>
            {index === 0 && (
              <p className="text-lg">
                {'보고서 작성기 코드 포함 파일'}
                <span className="text-red-500 ml-0.5">*</span>
              </p>
            )}
            {index === 1 && <p className="text-lg">{'TXT 압축 파일'}</p>}
            {index === 2 && <p className="text-lg">{'작성 파일 압축 후 일괄 업로드'}</p>}
            {file && (
              <AttachedFile key={'codefile'} file={file} onDelete={() => handleDeleteFile(index)} />
            )}
          </div>
          <div
            className="w-1/2 h-32 border-2 border-dashed border-orange-300 p-6 hover:cursor-pointer"
            onClick={handleDivClick(index)}
          >
            <div className="flex justify-center items-center">
              <section className="flex flex-col items-center justify-center">
                {file ? (
                  <p className="text-gray-700">파일: {file.name}</p>
                ) : (
                  <>
                    <Image className="py-2" src={Upload} width={23} height={23} alt="upload icon" />
                    <p className="text-mainOrange text-sm">파일 또는 이미지를 업로드 하세요</p>
                    <p className="text-sm text-mainOrange">최대 5MB까지 가능합니다.</p>
                  </>
                )}
                <input
                  type="file"
                  accept={'*/*'}
                  className="hidden"
                  ref={(el) => {
                    fileInputRefs.current[index] = el;
                  }}
                  onChange={handleFileChange(index)}
                />
              </section>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-10 mb-4 self-end mr-10">
        <PrimaryButton text={'업로드하기'} color="mainOrange" size="big" onClick={handleUpload} />
      </div>
    </section>
  );
};
