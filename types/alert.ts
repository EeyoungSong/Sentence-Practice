export enum AlertType {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export interface AlertPopupProps {
  type: AlertType;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export const NOASSIGNMENT = `배정된 Assign이 없습니다.`;
export const NOTEMPLATE = `배정된 템플릿 페이지 목록이 없습니다.`;
export const NOMESSAGE = `현재 작성된 댓글이 없습니다.`;
export const SUCCESS_UPLOAD = `성공적으로 업로드 되었습니다.`;
export const UPLOAD_FAIL = `업로드가 되지 않았습니다.`;
export const SUCCESS = `완료되었습니다.`;
export const ERROR_OCCURED = `에러가 발생했습니다.`;
export const NO_DATA = `권한이 없거나 해당 데이터가 존재하지 않습니다.`;
export const NO_VERIFICATION_CHANGE = `검증식 수정 상태에서는 검증식을 삭제하거나, 이름 변경을 할 수 없습니다.`;
export const NO_SAMENAME = `동일한 이름은 사용할 수 없습니다.`;
export const DELETE_VERIFICATION = `검증식을 삭제하시겠습니까?`;
export const MODIFY_VERIFICATION = `검증식을 수정하시겠습니까?`;
export const DELETE_WORKSPACE = `워크스페이스를 삭제하시겠습니까?`;
export const MODIFY_WORKSPACE = `워크스페이스를 수정하시겠습니까?`;
export const NOT_DELETE_WORKSPACE = `워크스페이스가 삭제되지 않았습니다.`;
