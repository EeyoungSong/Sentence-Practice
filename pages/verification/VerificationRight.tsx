import { Calculator } from '@/components/table/Calculator';
import { ExcelTable } from '@/components/table/ExcelTable';
import { VerificationTable } from '@/components/table/VerificationTable';
import {
  ARITIMETIC_OPERATORS,
  CellWithSheetName,
  DataItem,
  SheetData,
  verificationType,
} from '@/types/data';
import { HydrationBoundary, useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import {
  addVerification,
  getSheetData,
  getVerificationData,
  updateVerification,
  VerificationUpdatedData,
} from '../api/verificationApi';
import { useRouter, useSearchParams } from 'next/navigation';
import VerificationButtonGroup from './VerificationButtonGroup';
import { Portal } from '@/modal/ModalPortal';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import usePopupStore from '@/store/popup';
import useReportInfoState from '@/store/reportInfo';
import { AlertPopup } from '@/components/alert/AlertPopup';
import { AlertType } from '@/types/alert';

interface VerificationRightProps {
  verificationList: string[];
  isVerificationEditing: boolean;
  setVerificationEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  clickedVer: DataItem | null;
  onAddVerification: (newVerification: DataItem) => void;
}

export interface TableDataType {
  [key: string]: CellWithSheetName[][];
}

const transformSheetData = (data: Record<string, string>): verificationType[] => {
  return Object.keys(data).map((sheet_name: string) => ({ [sheet_name]: sheet_name }));
};

const VerificationRight = ({
  verificationList,
  isVerificationEditing,
  setVerificationEditing,
  isOpen,
  clickedVer,
  onAddVerification,
}: VerificationRightProps): JSX.Element => {
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [expression, setExpression] = useState<(CellWithSheetName | string)[]>([]);
  const [sheetData, setSheetData] = useState<SheetData>();
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [popupType, setPopupType] = useState<string | null>(null);
  const [clickedSheet, setClickedSheet] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUnable, setIsUnable] = useState<boolean>(false);
  const [unableMsg, setUnableMsg] = useState<string>('');

  const router = useRouter();

  const searchParams = useSearchParams();
  const pageId = searchParams.get('page');
  const pageName = searchParams.get('name');

  const { id: workspaceId } = useReportInfoState();
  const { data: tableData } = useQuery({
    queryKey: ['fact_db_data'],
    queryFn: () => getVerificationData('fact_db_json', workspaceId),
    enabled: !!workspaceId,
  });

  const updateVerificationKey = useMutation({
    mutationKey: ['update-key-verification'],
    mutationFn: (data: VerificationUpdatedData) => updateVerification(data, workspaceId),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsLoading(false);
    },
    onError: () => {
      setUnableMsg(`검증식 형태가 올바르지 않습니다.`);
      setIsLoading(false);
      setIsUnable(true);
    },
  });

  const fetchSheetData = async (sheetName: string): Promise<SheetData | void> => {
    if (!sheetName) return;
    const fetchedSheetData = await getSheetData(sheetName, workspaceId);
    setSheetData(fetchedSheetData);
  };

  useEffect(() => {
    if (selectedSheet) {
      fetchSheetData(selectedSheet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSheet]);

  /**
   * 검증 결과 보기 버튼
   */
  const handleVerifyAll = (): void => {
    router.push(`/verification-result?workspace=${workspaceId}&page=${pageId}&name=${pageName}`);
  };

  /**
   * 구분에 시트 이름만 나타내기 위한 변환 함수
   */
  const transformedSheetData = useCallback(() => {
    if (!tableData) return [];
    const transformedData = Object.entries(tableData).reduce((acc, [key, value]) => {
      acc[key] = JSON.stringify(value); // 객체를 문자열로 변환
      return acc;
    }, {} as verificationType);

    return transformSheetData(transformedData);
  }, [tableData]);

  useEffect(() => {}, [verifyResult]);

  useEffect(() => {
    if (clickedVer) {
      const verificationPrev = replaceByOperatorValue(
        Object.values(Object.values(clickedVer)[0])[0] as string,
      );

      const verificationNext = verificationPrev.map((value) => {
        if (value.length == 1) return value;
        else return parseData(value, 'all');
      });

      setClickedSheet(
        verificationNext
          .filter((value) => typeof value !== 'string')
          .map((value) => value.sheet_name),
      );

      setExpression(verificationNext);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedVer, tableData]);

  useEffect(() => {
    const sheet = expression.filter(
      (value): value is CellWithSheetName => typeof value !== 'string',
    );

    setClickedSheet(sheet.map((value) => value.sheet_name));
  }, [expression]);

  /**
   * 기존의 기호를 수식으로 바뀌기 위한 함수
   * @param str "AL006∽1∽1═AL006∽1∽2" 형식의 데이터
   * @returns 이걸 파싱한 데이터 string[]
   */
  const replaceByOperatorValue = (str: string): string[] => {
    const valueToKeyMap = Object.fromEntries(
      Object.entries(ARITIMETIC_OPERATORS).map(([key, value]) => [value, key]),
    );

    const regex = new RegExp(`(${Object.values(ARITIMETIC_OPERATORS).join('|')})`, 'g');

    return str
      .split(regex)
      .map((part) => valueToKeyMap[part] || part)
      .filter(Boolean);
  };

  /**
   * ExcelTable에서 해당하는 값을 찾기 위한 함수
   * @param str "AL006∽1∽1" 이런 형식의 데이터
   * @param type 'all' | 'partial'
   * @returns 해당 시트의 [1, 1]의 값을 반환
   */
  const parseData = (str: string, type: 'all' | 'partial'): string | CellWithSheetName => {
    const [sheet, row, col] = str.split('∽');
    const targetRow = Number(row); // 행과 열을 숫자로 변환
    let targetCol = Number(col);

    if (tableData) {
      const table = tableData[sheet];
      // 해당 시트에서 특정 행과 열에 맞는 셀을 찾음
      if (isHeader(sheet)[0]) {
        targetCol += 1;
      }

      const foundCell = table[targetRow - 1] && table[targetRow][targetCol - 1];

      if (!foundCell) return '';

      if (type === 'all') {
        return {
          ...foundCell,
          sheet_name: sheet,
        } as CellWithSheetName;
      }

      return foundCell.value as string;
    }
    return '';
  };

  /**
   * 헤더의 존재 유무를 확인 (rowHeader, colHeader)
   * @param sheet
   * @returns [isRowHeader, isColHeader]가 boolean[]으로 들어옴
   */
  const isHeader = (sheet: string): boolean[] => {
    const hasRowHeader = tableData
      ? tableData[sheet].some((value: CellWithSheetName[]) =>
          value.some((cell: CellWithSheetName) => cell.isRowHeader === 'true'),
        )
      : false;
    const hasColHeader = tableData
      ? tableData[sheet].some((value: CellWithSheetName[]) =>
          value.some((cell: CellWithSheetName) => cell.isColHeader === 'true'),
        )
      : false;

    return [hasRowHeader, hasColHeader];
  };

  /**
   * 선택된 시트 전달
   * @param rowNum number 입력
   * @returns void
   */
  const handleSheetChange = (rowNum: number): void => {
    if (!tableData) return;

    const selectedSheetName = Object.keys(tableData)[rowNum];
    setSelectedSheet(selectedSheetName); // 선택된 Sheet 이름 설정
  };

  /**
   * Calculator에서 값이 바뀌는걸 감지하는 함수
   */
  const handleExpressionChange = useCallback(
    (newExpression: (CellWithSheetName | string)[]): void => {
      setExpression(newExpression);
    },
    [],
  );

  /**
   * 검증식 값 수정 함수
   * @returns void
   */
  const handleEditVerification = (): void => {
    if (clickedVer) {
      const sheet = Object.keys(clickedVer)[0];
      const originalKey = Object.keys(clickedVer[Object.keys(clickedVer)[0]])[0];

      const originalValue = Object.values(clickedVer[Object.keys(clickedVer)[0]])[0]; // 기존 키에 따른 value

      const editExpression = expression
        .map((value) =>
          typeof value === 'string'
            ? ARITIMETIC_OPERATORS[value]
            : value.coordinates !== null &&
              value.sheet_name + '∽' + value.coordinates[0] + '∽' + value.coordinates[1],
        )
        .join('');

      const verificationUpdatedData: VerificationUpdatedData = {
        [sheet]: {
          Before: { [originalKey]: originalValue as string },
          After: { [originalKey]: editExpression as string },
        },
      };

      if (!editExpression.includes('═')) {
        setUnableMsg('반드시 수식에는 = 가 들어가야 합니다.');
        setIsUnable(true);
        setPopupType(null);
        return;
      }

      updateVerificationKey.mutate(verificationUpdatedData);
      setPopupType(null);
      setVerificationEditing(false);
    }
  };

  /**
   * 셀을 클릭해서 검증식에 값을 추가하는 함수
   * @param newCells (CellWithSheetName | string)[]
   * @returns void
   */
  const handleCellClick = (newCells: (CellWithSheetName | string)[]): void => {
    if (expression.every((value) => typeof value === 'string'))
      setExpression([newCells[newCells.length - 1]]);
    else setExpression(newCells);
  };

  /**
   * 검증하는 함수
   * @param type string
   * @returns void
   */
  const handleVerify = (type: string): void => {
    try {
      const extractValue = (item: CellWithSheetName | string): string | number => {
        if (typeof item === 'object' && item !== null && 'value' in item) {
          return item.value as string;
        }
        return item;
      };

      const parseExpression = (expr: (CellWithSheetName | string)[]): string =>
        expr.map((item) => extractValue(item)).join(' '); // 문자열로 병합

      const leftExpression = parseExpression(expression.slice(0, expression.indexOf('=')));
      const rightExpression = parseExpression(expression.slice(expression.indexOf('=') + 1));

      const calculateOrCompare = (expr: string): number | string => {
        try {
          return eval(expr);
        } catch {
          return expr.trim();
        }
      };

      const leftValue = calculateOrCompare(leftExpression);
      const rightValue = calculateOrCompare(rightExpression);

      if (type === 'compare') {
        if (leftValue === rightValue) {
          setVerifyResult(true);
        } else {
          setVerifyResult(false);
        }
      }
    } catch (error) {
      console.error('Error during verification:', error);
      if (type === 'compare') {
        setVerifyResult(false);
      } else {
        setIsUnable(true);
      }
    }
  };

  // 검증식 추가 쿼리
  const addVerificationMutation = useMutation({
    mutationKey: ['add-verification'],
    mutationFn: (data: DataItem) => addVerification(data, workspaceId),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsLoading(false);
    },
    onError: () => {
      setUnableMsg(`검증식 형태가 올바르지 않습니다.`);
      setIsLoading(false);
      setIsUnable(true);
    },
  });

  /**
   * 검증식 등록 -> 가장 처음에 입력된 셀의 시트를 기준으로 등록
   * @param verificationName 검증식이름
   * @returns void
   */
  const handleAddVerification = (verificationName: string): void => {
    // 첫 번째 요소의 타입 및 sheet_name 유효성 검사
    const firstElement = expression[0];
    if (typeof firstElement !== 'object' || !('sheet_name' in firstElement)) {
      console.error('Expression의 첫 번째 요소에서 sheet_name을 찾을 수 없습니다.');
      return;
    }
    const sheet_name = (firstElement as CellWithSheetName).sheet_name;

    const verification: string = expression
      .map((value) => {
        if (typeof value === 'string') {
          return ARITIMETIC_OPERATORS[value];
        } else {
          return (
            value.coordinates !== null &&
            value.sheet_name + '∽' + value.coordinates[0] + '∽' + value.coordinates[1]
          );
        }
      })
      .join('');

    const newVerification: DataItem = {
      [sheet_name]: { [verificationName]: verification },
    };

    // 중복된 이름 체크
    if (verificationList.includes(verificationName)) {
      handleVerify('add');
      setUnableMsg('중복된 이름은 추가할 수 없습니다.');
      setIsUnable(true);
      return;
    }

    // 수식체크
    if (!verification.includes('═')) {
      setUnableMsg('반드시 수식에는 = 가 들어가야 합니다.');
      setIsUnable(true);
      return;
    }

    addVerificationMutation.mutate(newVerification);
    onAddVerification(newVerification);
    setPopupType(null);
    setExpression([]);
  };

  /**
   * 검증식 Calculator 내용 삭제
   * @returns void
   */
  const resetExpression = (): void => setExpression([]);
  const { setIsOpen } = usePopupStore();

  return (
    <HydrationBoundary>
      <section className="flex flex-col w-full">
        <div className="flex justify-end my-7">
          <VerificationButtonGroup
            clickedVer={clickedVer}
            expression={expression}
            popupType={popupType}
            isEditing={isVerificationEditing}
            setPopupType={setPopupType}
            setIsEditing={setVerificationEditing}
            setVerifyResult={setVerifyResult}
            onRegister={resetExpression}
            onEdit={handleEditVerification}
            onVerify={() => handleVerify('compare')}
            onSave={handleVerifyAll}
            onAddVerification={handleAddVerification}
            onClosePopup={() => {
              setIsOpen(false);
              setPopupType(null);
            }}
          />
        </div>
        <section className={`flex ${isOpen ? 'justify-start' : 'justify-between'} mb-4 h-[60vh]`}>
          <VerificationTable
            headerName={'구분'}
            data={transformedSheetData()}
            verificationList={[]}
            clickedVerification={clickedSheet}
            isScrolled={true}
            onRowSelect={handleSheetChange}
            isBtnExist={false}
            height={'60vh'}
            tableType={'verification'}
          />
          <div className="ml-2"></div>
          {tableData && sheetData && (
            <ExcelTable
              data={tableData[sheetData.sheet_name]}
              isOpen={isOpen}
              height={'60vh'}
              onExpressionChange={handleCellClick}
              resetSelection={false}
              expression={expression}
              selectedSheet={selectedSheet}
            />
          )}
        </section>
        <Calculator
          $isOpen={isOpen}
          expression={expression}
          onExpressionChange={handleExpressionChange}
          verifyResult={verifyResult}
        />
      </section>
      {isLoading && (
        <Portal>
          <div className="shadow-xl rounded-[10px] w-80 h-64 flex flex-col items-center bg-white justify-center">
            <LoadingSpinner />
          </div>
        </Portal>
      )}
      {isUnable && (
        <Portal>
          <AlertPopup
            type={AlertType.WARNING}
            message={unableMsg}
            onClose={() => setIsUnable(false)}
          />
        </Portal>
      )}
    </HydrationBoundary>
  );
};

export default VerificationRight;
