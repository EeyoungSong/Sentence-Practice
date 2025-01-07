import styled from 'styled-components';

export const PROGRESS = '진행상황';
export const NOTICE = '공지사항';
export const ADD_DATA = '추가하기';
export const MODIFY = '수정하기';
export const MODIFY_LOG = '수정기록';
export const ATTACH = '첨부하기';
export const RESULT_LIST = '결과표 목록';
export const NOSHEET = '선택된 Sheet가 없습니다.';
export const NO_NOTICE = '공지사항이 없습니다.';
export const NO_TASK = '진행 현황 데이터가 없습니다.';
export const NO_REPORT = '보고서가 없습니다.';
export const ACTIVE = '활성화';
export const INACTIVE = '비활성화';
export const MODIFING = '현재 수정중입니다.';

export const Grid = styled.div<{
  $columns: number;
  $isScrolled?: boolean;
  $height: string;
  $minimize?: boolean;
  $type: 'verification' | 'single-select' | 'board';
}>`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(
    ${(props) => props.$columns},
    ${(props) =>
      props.$type === 'verification'
        ? 'minmax(min-content, 1fr)'
        : props.$type === 'single-select'
          ? props.$minimize
            ? '10vw'
            : 'minmax(min-content, 10vw)'
          : 'minmax(min-content, 15vw)'}
  );
  height: ${(props) => props.$height};
  overflow-y: ${(props) => (props.$isScrolled ? 'auto' : '')};
  overflow-x: auto;
  scrollbar-color: var(--mainOrange) transparent;
  cursor: pointer;
  align-content: start;
  &::-webkit-scrollbar-thumb {
    background-color: var(--mainOrange);
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

export const Cell = styled.div<{
  $isCenter: boolean;
  $isSelected?: boolean;
  $isEven?: boolean;
  $isFalse?: boolean;
  $isDataExisted?: boolean;
  $minimize?: boolean;
  isDisabled?: boolean;
}>`
  cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')}; // 비활성화 시 커서 변경
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)}; // 비활성화 시 투명도 변경
  padding: 0.5rem;
  text-align: center;
  background-color: ${(props) =>
    props.$isSelected
      ? '#FED7AA'
      : props.$isDataExisted
        ? '#D9C2F5'
        : props.$isFalse
          ? '#F8D0D0'
          : props.$isEven
            ? '#F3F4F6'
            : '#FFFFFF'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.75rem;
  justify-content: ${(props) => (props.$isCenter ? 'center' : 'space-between')};
  display: ${(props) => (props.$minimize ? '-webkit-box' : 'flex')};
  word-break: keep-all;
  align-items: center;
  font-size: ${(props) => (props.$minimize ? '0.9rem' : '1rem')};
`;

export const HeaderCell = styled(Cell)`
  font-weight: bold;
  background-color: #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
`;
