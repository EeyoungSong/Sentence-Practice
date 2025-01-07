import { AlertPopup } from '@/components/alert/AlertPopup';
import { BorderButton } from '@/components/buttons/BorderButton';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Portal } from '@/modal/ModalPortal';
import { VerificationModal } from '@/modal/VerificationModal';
import usePopupStore from '@/store/popup';
import { AlertType } from '@/types/alert';
import { CellWithSheetName, DataItem } from '@/types/data';

interface VerificationButtonGroupProps {
  clickedVer: DataItem | null;
  expression: (CellWithSheetName | string)[];
  popupType: string | null;
  isEditing: boolean;
  setPopupType: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setVerifyResult: React.Dispatch<React.SetStateAction<boolean | null>>;
  onRegister: () => void;
  onEdit: () => void;
  onVerify: () => void;
  onSave: () => void;
  onAddVerification: (verificationName: string) => void;
  onClosePopup: () => void;
}

const VerificationButtonGroup = ({
  clickedVer,
  expression,
  popupType,
  isEditing,
  setPopupType,
  setIsEditing,
  setVerifyResult,
  onRegister,
  onEdit,
  onVerify,
  onSave,
  onAddVerification,
  onClosePopup,
}: VerificationButtonGroupProps): JSX.Element => {
  // !important setIsOpen이 false 상태여야 검증식 등록 팝업에서 글자 입력 가능
  const { setIsOpen } = usePopupStore();
  return (
    <>
      <PrimaryButton
        text={'검증식 등록'}
        color="mainOrange"
        onClick={() => {
          if (expression.length === 0) setPopupType('reject');
          else {
            setIsOpen(true);
            setPopupType('add');
          }
        }}
        size={'big'}
        disabled={isEditing}
      />
      <PrimaryButton
        text={`${isEditing ? '수정 완료' : '검증식 수정'}`}
        color="mainOrange"
        onClick={() => (isEditing ? setPopupType('edit') : setIsEditing(true))}
        size={'big'}
      />
      <BorderButton
        text={'초기화'}
        color="mainOrange"
        onClick={() => {
          setVerifyResult(null);
          onRegister();
        }}
        size={'big'}
        disabled={isEditing}
      />
      <PrimaryButton text={'검증'} color="mainOrange" onClick={onVerify} size={'big'} />
      <PrimaryButton
        text={'검증 결과 보기'}
        color="mainOrange"
        onClick={onSave}
        size={'big'}
        disabled={isEditing}
      />
      {popupType === 'reject' && (
        <Portal>
          <AlertPopup
            type={AlertType.ERROR}
            message="등록할 검증식을 입력해주세요"
            onClose={onClosePopup}
          />
        </Portal>
      )}
      {popupType === 'add' && (
        <Portal>
          <VerificationModal
            text={'등록'}
            placeholder={'검증식 이름을 입력해주세요'}
            onClose={onClosePopup}
            onConfirm={(e, verificationName) => {
              onAddVerification(verificationName);
            }}
          />
        </Portal>
      )}
      {popupType === 'edit' && clickedVer !== null && (
        <Portal>
          <AlertPopup
            type={AlertType.WARNING}
            message={`${Object.keys(Object.values(clickedVer)[0])[0]}를 변경합니다`}
            onConfirm={onEdit}
            onClose={onClosePopup}
          />
        </Portal>
      )}
    </>
  );
};

export default VerificationButtonGroup;
