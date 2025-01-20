import * as excelJs from 'exceljs';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// 파일 유효성 검사
export const validateExcelFile = async (
  file: File,
  expectedHeaders: string[],
): Promise<ValidationResult> => {
  // 파일 확장자 검사
  const fileExtension = file.name.split('.').pop();
  if (fileExtension !== 'xlsx') {
    return {
      isValid: false,
      message: '엑셀 파일이 아닙니다. .xlsx 형식의 파일을 업로드하세요.',
    };
  }

  const workbook = new excelJs.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    return {
      isValid: false,
      message: '엑셀 파일에 시트가 없습니다.',
    };
  }

  const headerRow = worksheet.getRow(1);
  const headers = headerRow.values as Array<string>;

  const isHeaderValid = expectedHeaders.every((header, index) => header === headers[index + 1]);

  if (!isHeaderValid) {
    return {
      isValid: false,
      message:
        '엑셀 파일의 헤더가 올바르지 않습니다. 헤더 형식은 "사번, 이메일, 이름, 부서, 직위, 권한"이어야 합니다.',
    };
  }

  return {
    isValid: true,
    message: '파일이 유효합니다.',
  };
};
