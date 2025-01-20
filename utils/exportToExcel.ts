import ExcelJS from 'exceljs';
import { AssignmentData, HeaderName } from '@/types/data';
import { saveAs } from 'file-saver';

export const exportToExcel = async (
  data: AssignmentData[],
  fileName: string = 'assignment',
): Promise<void> => {
  if (data.length === 0 || !data[0] || typeof data[0] !== 'object') {
    console.warn('내보낼 데이터가 없습니다.');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // 2. 컬럼 정의
  const columns = Object.keys(data[0])
    .filter((header) => header !== 'id')
    .map((header) => ({
      header: HeaderName[header as keyof typeof HeaderName] ?? header,
      key: header,
      width: 20,
    }));

  worksheet.columns = columns;

  // 3. 데이터 추가
  data.forEach((item) => {
    const rowData: { [key: string]: string } = {};
    columns.forEach((col) => {
      const value = item[col.key as keyof AssignmentData];
      if (Array.isArray(value)) {
        rowData[col.key] = value.join(', ');
      } else {
        rowData[col.key] = value as string;
      }
    });

    worksheet.addRow(rowData);
  });

  // 4. 헤더 스타일 적용
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' },
    };
    cell.alignment = { horizontal: 'center' };
  });

  // 5. 엑셀 파일 생성 및 다운로드
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
};
