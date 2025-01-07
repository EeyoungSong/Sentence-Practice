import { Header } from '@/components/header/Header';
import VerificationRight from './VerificationRight';
import VerificationLeft from './VerificationLeft';
import { BorderButton } from '@/components/buttons/BorderButton';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DataItem, DataSheetItem } from '@/types/data';
import { useQuery } from '@tanstack/react-query';
import { getVerificationData } from '../api/verificationApi';
import useReportInfoState from '@/store/reportInfo';

const VerificationPage = (): JSX.Element => {
  const [isVerificationEditing, setIsVerificationEditing] = useState<boolean>(false);
  const [isListOpen, setIsOpen] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [sheetOptions, setSheetOptions] = useState<string[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<DataItem | null>(null);
  const [verificationData, setVerificationData] = useState<DataSheetItem>();
  const [verificationList, setVerificationList] = useState<string[]>([]);

  const { id: workspaceId } = useReportInfoState();
  const { isLoading, data: cellValData } = useQuery<DataSheetItem>({
    queryKey: ['cell_val_data'],
    queryFn: () => getVerificationData('cell_val_data', workspaceId),
    enabled: !!workspaceId,
  });

  useEffect(() => {
    setVerificationData(cellValData);
  }, [cellValData]);

  /**
   * 검증식 목록에서 검증식 전체를 가져오는 함수
   */
  const getVerificationDataBySheet = useCallback(
    (selectedSheet: string): Array<Record<string, Record<string, string>>> => {
      if (!verificationData) return [];

      if (selectedSheet === '전체') {
        // 전체 데이터 반환
        return Object.entries(verificationData).reduce(
          (acc: Array<Record<string, Record<string, string>>>, [sheetName, sheetData]) => {
            if (sheetData.cell_formula_coord) {
              Object.entries(sheetData.cell_formula_coord).forEach(([formulaKey, formulaValue]) => {
                acc.push({
                  [sheetName]: { [formulaKey]: formulaValue },
                });
              });
            }
            return acc;
          },
          [],
        );
      } else if (verificationData[selectedSheet]) {
        // 특정 시트 데이터 반환
        const sheet = verificationData[selectedSheet];
        if (sheet.cell_formula_coord) {
          return Object.entries(sheet.cell_formula_coord).map(([formulaKey, formulaValue]) => ({
            [selectedSheet]: { [formulaKey]: formulaValue },
          }));
        }
      }
      return [];
    },
    [verificationData],
  );

  useEffect(() => {
    if (verificationData) {
      const options = Object.keys(verificationData).filter((key) => {
        const sheet = verificationData[key];
        return (
          sheet && sheet.cell_formula_coord && Object.keys(sheet.cell_formula_coord).length > 0
        );
      });

      options.unshift('전체');
      setSheetOptions(options);

      // 처음 렌더링 시 '전체' 데이터를 설정
      const allData = getVerificationDataBySheet('전체') as DataItem[];
      setFilteredData(allData);
      const allDataValues = Object.values(allData); // Object.values로 배열 가져오기

      const processedKeys = allDataValues.map((item) => {
        const topKey = Object.values(item)[0]; // 최상위 키 가져오기
        return Object.keys(topKey)[0];
      });

      setVerificationList(processedKeys);
      setSelectedVerification(allData[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationData]);

  /**
   * 시트 단위로 검증식을 선택하기 위한 Filter
   */
  const handleFilteredChange = (sheet_name: string): void => {
    const changedData = getVerificationDataBySheet(sheet_name);
    setFilteredData(changedData);
  };

  /**
   * 어떤 검증식이 선택되었는지에 대한 함수
   * @param selectedRow 선택된 Row의 검증식
   */
  const handleRowSelect = (selectedRow: DataItem): void => {
    setSelectedVerification(selectedRow);
  };

  /**
   * 검증식 목록에 검증식 추가하는 함수
   * @param newVerification 추가할 검증식
   */
  const handleAddVerification = (newVerification: DataItem): void => {
    setVerificationData((prevData) => {
      const updatedData = { ...prevData };
      Object.keys(newVerification).forEach((key) => {
        const stringifiedValue = JSON.stringify(newVerification[key] as { [key: string]: string });
        if (updatedData[key]?.cell_formula_coord) {
          updatedData[key].cell_formula_coord = {
            ...updatedData[key].cell_formula_coord,
            ...JSON.parse(stringifiedValue),
          };
        }
      });

      return updatedData;
    });
  };

  return (
    <>
      <Header />
      <section className="flex px-12">
        <div className="flex flex-col justify-end relative">
          <div className="my-5 mr-4 absolute top-0 w-max">
            <BorderButton
              text={isListOpen ? '목록 접기' : '검증식 목록 보기'}
              Icon={isListOpen ? ChevronLeft : ChevronRight}
              color={'mainOrange'}
              onClick={() => setIsOpen(!isListOpen)}
              size={'big'}
            />
          </div>
          {isListOpen ? (
            <VerificationLeft
              isVerificationEditing={isVerificationEditing}
              isLoading={isLoading}
              data={filteredData}
              verificationList={verificationList || []}
              sheetOptions={sheetOptions}
              onFilterChange={handleFilteredChange}
              onRowSelect={handleRowSelect}
            />
          ) : (
            <></>
          )}
        </div>
        <div className="w-full">
          <VerificationRight
            verificationList={verificationList}
            isVerificationEditing={isVerificationEditing}
            setVerificationEditing={setIsVerificationEditing}
            onAddVerification={handleAddVerification}
            isOpen={isListOpen}
            clickedVer={selectedVerification}
          />
        </div>
      </section>
    </>
  );
};

export default VerificationPage;
