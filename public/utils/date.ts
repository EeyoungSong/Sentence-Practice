import {
  AssignmentData,
  ModifiedData,
  NoticeData,
  ProgressData,
  ProgressTemplateData,
} from '@/types/data';

export const extractDataValue = <
  T extends
    | NoticeData
    | ProgressData
    | ModifiedData
    | AssignmentData
    | ProgressData
    | ProgressTemplateData,
>(
  data: T[],
  rowIndex: number,
  header: keyof T,
): string | number | object | undefined => {
  const rowData = data[rowIndex];
  return rowData[header] as string | number | object | undefined;
};

export const formatDateValue = (value: string): string | string[] => {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? value.split('T').join(' ') : value;
};
