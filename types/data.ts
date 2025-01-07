import { ReactNode } from 'react';

export const VERIFICATION_NAME = '검증식';
export const VERIFICATION_LIST = '검증식 목록';
export const VERIFICATION_SELECTION = '검증식 선택';
export const DIVISTION = '구분';

export interface verificationType {
  [key: string]: string;
}

export interface DataItem {
  [key: string]: { [innerKey: string]: string | number | boolean | object };
}

export interface DataSheetItem {
  [key: string]: SheetData;
}

export interface Cells {
  value: string | boolean;
  style: {
    bgColor: string;
  };
  isRowHeader: boolean | string;
  isColHeader: boolean | string;
  coordinates: number[] | null;
}

export interface CellWithSheetName extends Cells {
  sheet_name: string;
}

export interface SheetData {
  sheet_name: string;
  title: string;
  company: string;
  date: string;
  period: string;
  unit: string;
  isreported: boolean;
  cell_formula_coord: { [key: string]: string };
  cell_formula_id: { [key: string]: string };
}

export const ARITIMETIC_OPERATORS: { [key: string]: string } = {
  '(': '⦗',
  ')': '⦘',
  '+': '₊',
  '-': '₋',
  '*': 'ₓ',
  '×': '✕',
  '/': '⅟',
  '÷': '½',
  '^': '∧',
  '=': '═',
};

export interface PaginationInfo {
  has_previous: boolean;
  has_next: boolean;
  num_pages: number;
  current_page: number;
}

export interface CommentData {
  id: number;
  content: string;
  tag: string;
  updated_at: string | Date;
  is_deleted: boolean;
  user: string;
  page: string;
  parent: number | null;
  reply: CommentData[];
}

export interface AddCommentData {
  content: string;
  tag: string;
  page_id: number;
  report_id: number;
  parent_id?: number;
}

export interface NoticeData {
  id: number;
  title: string;
  user: string;
  hits: number;
  created_at: string | Date;
}

export interface NoticeDetailData {
  id: number;
  title: string;
  contents: string;
  hits: number;
  file_data: {
    files: [
      {
        name: string;
        path: string;
        size: number;
      },
    ];
  };
  created_at: string;
  updated_at: string;
  user: string;
  page: string;
}

export interface NoticeDetailEntireData {
  notices: NoticeDetailData[];
}

export interface NoticeEntireData {
  notices: NoticeData[];
  pagination: PaginationInfo;
}

export interface ProgressData {
  id: number;
  report_code: string;
  progress: string;
  upload_date: string | Date;
  submitter: string[];
}

export interface ProgressEntireData {
  progress: ProgressData[];
  pagination: PaginationInfo;
}

export interface ReportProgressData {
  report_id: number;
  report_code: string;
  report_name: string;
  provider: string[];
  author: string[];
  progress: '작성대기' | '회람대기' | '완결';
  circulation: string;
  progress_rate: number;
}

export interface ReportProgressEntireData {
  reports: ReportProgressData[];
}

export interface ReportProgressCellData {
  보고서코드: string;
  보고서명: string | ReactNode;
  자료제공자: string | ReactNode;
  작성자: string | ReactNode;
  작성대기: ReactNode;
  회람대기: ReactNode;
  완결: ReactNode;
  회람: ReactNode;
  검증률: string;
}

export interface SelectedModifiedData {
  id: number;
  report_code: string;
  action: string;
  datetime: Date;
  file: {
    file_name: string;
    download_url: string;
  };
}

export interface ModifiedData {
  id: number;
  workspace_id: number;
  page_id: number;
  report_id: number;
  report_code: string;
  report_name: string;
  action: string;
  datetime: Date | string;
  file: {
    file_name: string;
    download_url: string;
  };
}

export interface ModifiedEntireData {
  report_logs: ModifiedData[];
  pagination: PaginationInfo;
}

export interface AssignmentData {
  id: number;
  page_id: number;
  report_code: string;
  report_name: string;
  due_date: string | Date;
  provider: string[];
  is_active: boolean;
  author: string[];
  submitter: string[];
  approver: string[];
}

export interface AssignmentEntireData {
  assigns: AssignmentData[];
}

export interface ProgressTemplateData {
  id: number;
  page_id: number;
  page: string;
  report_code: string;
  report_name: string;
  due_date: string | Date;
  provider: string[];
  author: string[];
  progress: string;
  circulation: string;
}

export interface ProgressTemplateEntireData {
  progress_template: ProgressTemplateData[];
}

export interface ProgressPercentageData {
  progress_percentage: number;
}

export interface userData {
  [key: string]: string | number;
}

export interface deleteData {
  emails: string[];
}

export interface loginData {
  email: string;
  password: string;
}

export interface ReportData {
  id: number;
  name: string;
  year: number;
  month: number;
  stage: number;
  is_corrective: boolean;
  is_active: boolean;
  status: number;
  admin: string;
  parent_workspace: string | null;
  style_json_file?: { name: string; download_url: string };
  style_xlsx_file?: { name: string; download_url: string };
  new_template_file?: { name: string; download_url: string };
}

export interface TaskData {
  page_id: number;
  page: string;
  write_pending: number;
  curculation_pending: number;
  complete: number;
  validation_rate: number;
}

export interface ParentWorkspaces {
  workspaces: string[];
}

export interface PageData {
  id: number;
  name: string;
}

export interface CodeData {
  code: string;
  parent_page: string;
}

export interface PageDetail {
  name: string;
  is_active: boolean;
  reports: CodeData[];
}

export interface AddPageData {
  page_name: string;
  is_active: boolean;
  selected_reports: string[];
}

export interface Circulation {
  written_report: string[];
  empty_report: string[];
}

export interface SubmitCirculationData extends Circulation {
  workspace: number;
  agreed: boolean;
  circulations_template: string;
}

export interface ReportView extends Circulation {
  submitter: string;
  submitted_template: string;
  agreed: boolean;
  created_at: Date | string;
}

export const HeaderName: { [key: string]: string } = {
  page: '페이지',
  is_active: '상태',
  report_code: '보고서코드',
  report_name: '보고서명',
  due_date: '작성기한',
  provider: '자료제공자',
  author: '작성자',
  submitter: '제출자',
  approver: '승인자',
  progress: '진행상황',
  upload_date: '업로드일시',
  page_name: '페이지 이름',
  circulation: '회람여부',
  action: '작업',
  datetime: '일자',
  file: '파일명',
  title: '제목',
  user: '작성자',
  hits: '조회수',
  created_at: '작성 날짜',
};

export interface BackDataType {
  id: number;
  is_active: boolean;
  report_code: string;
  report_name: string;
  name: string;
  details: string;
  providers: string[];
  due_date: string;
  status: string;
  upload_date: string | null;
  uploader: string[] | null;
  file_name: string | null;
  file_url: string | null;
  comment: string | null;
}

export interface BackDataEntire {
  backdata: BackDataType[];
}
