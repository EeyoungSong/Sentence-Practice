import { BackDataType } from '@/types/data';
import { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import styled from 'styled-components';
import { Portal } from './ModalPortal';
import { SearchUserModal } from './SearchUserModal';
import { ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getReportList } from '@/pages/api/backdataApi';

interface DescriptionForm {
  title: string;
  onClose: () => void;
  onConfirm: (data: BackDataType) => void;
  pageId: number;
  workspaceId: number;
}

const EditSection = styled.section`
  min-width: 24rem;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  padding: 0 3rem;
  box-shadow: '0 10px 15px rgba(0, 0, 0, 0.1),0 4px 6px rgba(0, 0, 0, 0.05)';
  background-color: white;
  height: 500px;
`;

export const EditModal: React.FC<DescriptionForm> = ({
  title,
  onClose,
  onConfirm,
  pageId,
  workspaceId,
}) => {
  const [addingData, setAddingData] = useState<BackDataType>();
  const [onSearchUserModal, setOnSearchUserModal] = useState<boolean>(false);
  const [tempEditingProviders, setTempEditingProviders] = useState<string[]>([]);

  const { data: reports } = useQuery({
    queryKey: ['backdata-reports'],
    queryFn: () => getReportList(workspaceId, pageId),
  });

  const handleEditChange = (value: string | boolean, key: string): void => {
    const tempAddingData = { ...addingData, [key]: value };
    setAddingData(tempAddingData as BackDataType);
  };
  useEffect(() => {
    console.log(addingData);
  }, [addingData]);

  useEffect(() => {
    if (addingData) {
      const changedTempEditingData = { ...addingData, providers: tempEditingProviders };
      setAddingData(changedTempEditingData);
    }
  }, [tempEditingProviders]);

  return (
    <EditSection>
      <span className="flex w-full justify-between px-3 pb-1 text-mainOrange">
        <div></div>
        <ReactSVG src="/icons/close.svg" className="w-5 h-5" onClick={onClose} />
      </span>
      <p className="pl-3 pb-3 font-bold text-xl">{title}</p>
      <div className="flex flex-col mx-3 w-11/12 item-center justify-center mt-5">
        {/* <div
          key={'is_active'}
          className="flex justify-between items-center mb-2 w-[350px] bg-[#ededed] rounded"
        >
          <label>
            <input
              type="checkbox"
              className=" mt-2 mx-2 w-4 h-4"
              onChange={(e) => handleEditChange(e.target.checked, 'is_active')}
              checked={addingData?.is_active}
            />
            {addingData?.is_active === true ? '활성화' : '비활성화'}
          </label>
        </div> */}
        <div key={'report_code'} className="flex justify-between items-center mb-2 w-[350px]">
          <div className="flex justify-between items-center mb-2 w-[350px]">
            <label className="mr-2">보고서 코드</label>
            <select
              name={'report_code'}
              value={addingData?.report_code}
              onChange={(e) => handleEditChange(e.target.value, 'report_code')}
              className={
                'h-[35px] w-36 border focus:outline-none appearance-none text-center mt-1.5'
              }
            >
              <option value="선택하세요">선택하세요</option>
              {reports?.map((report, idx) => (
                <option key={idx} value={report.code}>
                  {report.code}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-mainOrange"
              size={18}
            />
          </div>
        </div>
        <div key={'name'} className="flex justify-between items-center mb-2 w-[350px]">
          <label className="mr-2">자료명</label>
          <input
            type="text"
            className="border p-2"
            onChange={(e) => handleEditChange(e.target.value, 'name')}
            value={addingData?.name}
          />
        </div>
        <div
          key={'providers'}
          className="flex justify-between items-center mb-2 w-[350px]"
          onClick={() => setOnSearchUserModal(true)}
        >
          <label className="mr-2">자료제공자</label>
          <input
            type="text"
            className="border p-2"
            placeholder="클릭해서 선택"
            onChange={(e) => handleEditChange(e.target.value, 'providers')}
            value={tempEditingProviders}
          />
        </div>
        <div key={'due_date'} className="flex justify-between items-center mb-2 w-[350px] ">
          <label className="mr-2">제출기한</label>
          <input
            type="date"
            className="border p-2"
            onChange={(e) => handleEditChange(e.target.value, 'due_date')}
            value={addingData?.due_date}
          />
        </div>
      </div>
      <div className="flex w-1/2 justify-around mt-3">
        <button
          className="text-mainOrange border border-mainOrange w-16 h-8 rounded-[7px]"
          onClick={onClose}
        >
          취소
        </button>
        <button
          className="bg-mainOrange w-16 h-8 rounded-[7px] text-white"
          onClick={() => {
            if (addingData) onConfirm(addingData);
          }}
        >
          확인
        </button>
      </div>
      {onSearchUserModal && (
        <Portal>
          <div className="w-4/12">
            <SearchUserModal
              selectedUser={tempEditingProviders}
              setSelectedUser={setTempEditingProviders}
              onClose={() => setOnSearchUserModal(false)}
            />
          </div>
        </Portal>
      )}
    </EditSection>
  );
};
