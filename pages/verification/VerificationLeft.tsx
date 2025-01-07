import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { FilteredData } from '@/components/table/FilteredData';
import { TableView } from '@/components/table/TableView';
import { TitleInfo } from '@/components/title/TitleInfo';
import { DataItem } from '@/types/data';

interface VerificationLeftProps {
  isVerificationEditing: boolean;
  isLoading: boolean;
  data: DataItem[];
  verificationList: string[];
  sheetOptions: string[];
  onFilterChange: (selectedSheet: string) => void;
  onRowSelect: (selectedRow: DataItem) => void;
}

const VerificationLeft = ({
  isVerificationEditing,
  isLoading,
  data,
  verificationList,
  sheetOptions,
  onFilterChange,
  onRowSelect,
}: VerificationLeftProps): JSX.Element => {
  /**
   * 검증식을 선택했을 때 함수
   * @param index 현재 선택된 검증식의 index
   * @returns void
   */
  const handleSelectedVerification = (index: number): void => {
    if (!isVerificationEditing) {
      const selectedData: DataItem = data[index];
      if (selectedData) {
        onRowSelect(selectedData);
      }
    }
  };

  return (
    <section className="flex flex-col mr-10">
      <TitleInfo title={'검증식 목록'} />
      <div className="self-end mr-4 mb-1.5">
        <FilteredData options={sheetOptions} onFilterChange={onFilterChange} />
      </div>
      {isLoading ? (
        <div className="h-[65vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <TableView
          headerName={'검증식 목록'}
          data={data}
          verificationList={verificationList}
          onRowSelect={handleSelectedVerification}
          isScrolled={true}
          tableType="verification"
          isDisabled={isVerificationEditing}
        />
      )}
    </section>
  );
};

export default VerificationLeft;
