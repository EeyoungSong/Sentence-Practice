import { ACTIVE, INACTIVE } from '@/types/table';
import { Plus, Trash2 } from 'lucide-react';
import {
  addBackData,
  deleteBackData,
  editBackDatas,
  getBackData,
  uploadBackDataFile,
} from '../api/backdataApi';
import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AlertPopup } from '@/components/alert/AlertPopup';
import { AlertType } from '@/types/alert';
import { BackDataTable } from '@/components/table/BackDataTable';
import { BackDataType } from '@/types/data';
import { CommentUploadBox } from '@/components/upload/CommentUploadBox';
import { EditModal } from '@/modal/EditModal';
import { GrayButton } from '@/components/buttons/GrayButton';
import { Header } from '@/components/header/Header';
import NoDataPage from '@/components/loading/NoData';
import { Portal } from '@/modal/ModalPortal';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { TitleInfo } from '@/components/title/TitleInfo';
import { useSearchParams } from 'next/navigation';

const BackDataPage = (): JSX.Element => {
  const queryClient = useQueryClient();
  const [onAttachedModal, setOnAttachedModal] = useState<{
    id: number;
    isReUpload: boolean;
  } | null>(null);
  const [selectedDatas, setSelectedDatas] = useState<BackDataType[]>();
  const [onAddDataModal, setOnAddDataModal] = useState<boolean>(false);
  const [onAlertDeleteModal, setOnAlertDeleteModal] = useState<boolean>(false);
  const [onSuccessModal, setOnSuccessModal] = useState<string | null>(null);
  const [onErrorModal, setOnErrorModal] = useState<string | null>(null);

  onErrorModal;
  const searchParams = useSearchParams();
  const pageId = searchParams.get('page')!;
  const workspaceId = searchParams.get('workspace')!;

  // 공지사항 불러오기
  const { data: backData } = useQuery({
    queryKey: ['back_data'],
    queryFn: () => getBackData(Number(workspaceId), Number(pageId)),
  });

  const onFileUpload = (id: number, isReUpload: boolean): void => {
    setOnAttachedModal({ id: id, isReUpload: isReUpload });
  };

  const handleFileUpload = (
    id: number,
    file: File | null,
    isNotApplicable: boolean,
    comment: string,
  ): void => {
    console.log(handleFileUpload);
    fileuploadMutaion({ id, file, isNotApplicable, comment });
    setOnAttachedModal(null);
  };

  // 백데이터 항목 추가
  const { mutate: addBackDataMutaion } = useMutation({
    mutationKey: ['add-back-data'],
    mutationFn: ({
      workspace,
      page,
      data,
    }: {
      workspace: number;
      page: number;
      data: BackDataType;
    }) => addBackData(workspace, page, data),
    onMutate: () => {
      // if (tableRef.current) {
      //   tableRef.current.resetSelectedData();
      // }
      // setSignupStatusOptions([]);
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['back_data'], (oldData: BackDataType[] | undefined) => {
        if (!oldData) return [updatedData]; // 기존 데이터가 없으면 새 데이터로 초기화

        const isExisting = oldData.some((data) => data.id === updatedData.id);
        if (isExisting) {
          // 데이터가 이미 존재하는 경우 업데이트
          return oldData.map((data) =>
            data.id === updatedData.id ? { ...data, ...updatedData } : data,
          );
        } else {
          // 데이터가 없으면 추가
          return [...oldData, updatedData];
        }
      });
      setOnSuccessModal('백데이터가 성공적으로 추가되었습니다.');
    },
    onError: () => {
      console.log('An error occured');
      setOnErrorModal('오류가 발생했습니다.');
    },
  });

  // 백데이터 항목 삭제

  const { mutate: deleteBackDataMutaion } = useMutation({
    mutationKey: ['delete-back-data'],
    mutationFn: ({ workspace, page, data }: { workspace: number; page: number; data: number[] }) =>
      deleteBackData(workspace, page, data),
    onMutate: () => {
      // if (tableRef.current) {
      //   tableRef.current.resetSelectedData();
      // }
      // setSignupStatusOptions([]);
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['back_data'], (oldData: BackDataType[] | undefined) => {
        if (!oldData) return []; // 캐시에 데이터가 없는 경우 처리
        return oldData.filter((data) => !updatedData.deleted_ids.includes(data.id));
      });
      setOnSuccessModal('백데이터가 삭제되었습니다.');
    },
    onError: () => {
      setOnErrorModal('오류가 발생했습니다.');
      console.log('An error occured');
    },
  });

  // 백데이터 정보 수정
  const { mutate: editBackDataMutaion } = useMutation({
    mutationKey: ['edit-users'],
    mutationFn: (data: BackDataType[]) => editBackDatas(data),
    onMutate: () => {
      console.log('edit-backdatas');
      // if (tableRef.current) {
      //   tableRef.current.resetSelectedData();
      // }
      // setSignupStatusOptions([]);
    },
    onSuccess: (updatedData) => {
      console.log('updatedData', updatedData);
      queryClient.setQueryData(['back_data'], (oldData: BackDataType[] | undefined) => {
        console.log('oldData', oldData);
        if (!oldData) return []; // 캐시에 데이터가 없는 경우 처리
        return oldData.map((data) => {
          const updatedItem = updatedData.find((item) => item.id === data.id);
          console.log('updatedItem', updatedItem);
          return updatedItem ? { ...data, ...updatedItem } : data;
        });
      });
      setOnSuccessModal('백데이터가 수정되었습니다.');
    },
    onError: () => {
      setOnErrorModal('오류가 발생했습니다.');
      console.log('An error occured');
    },
  });

  const handleOnSetData = async (newBackData: BackDataType | undefined): Promise<void> => {
    if (!newBackData) return;
    editBackDataMutaion([newBackData]);
  };

  // 파일 업로드
  const { mutate: fileuploadMutaion } = useMutation({
    mutationKey: ['back_data_file_down'],
    mutationFn: uploadBackDataFile,
    onSuccess: (updatedData) => {
      console.log('backData:', updatedData.id);
      queryClient.setQueryData(['back_data'], (oldData: BackDataType[] | undefined) => {
        console.log(oldData, updatedData);
        if (!oldData) return [];
        return oldData.map((data) =>
          data.id === updatedData.id ? { ...data, ...updatedData } : data,
        );
      });
      setOnSuccessModal('파일이 업로드되었습니다. ');
    },
    onError: () => {
      console.log('An error occured');
      setOnErrorModal('오류가 발생했습니다.');
    },
  });

  // 선택된 user 감지
  const onRowSelect = useCallback(
    (ids: number[]): void => {
      if (backData) {
        const tempSelectedDatas = backData.filter((data) => ids.includes(data.id));
        console.log(tempSelectedDatas);
        setSelectedDatas(tempSelectedDatas);
      }
    },
    [backData],
  );

  const onConfirmAddData = (addingData: BackDataType): void => {
    addBackDataMutaion({ workspace: Number(workspaceId), page: Number(pageId), data: addingData });
    setOnAddDataModal(false);
  };

  const handleDisactiveAllClick = (isActiveNode: boolean): void => {
    const tempSelectedDatas = selectedDatas?.map((data: BackDataType) => ({
      ...data,
      is_active: isActiveNode,
    }));
    console.log('tempSelectedDatas', tempSelectedDatas);
    if (tempSelectedDatas) editBackDataMutaion(tempSelectedDatas);
  };

  const handleDeleteClick = (): void => {
    deleteBackDataMutaion({
      workspace: Number(workspaceId),
      page: Number(pageId),
      data: selectedDatas?.map((data) => data.id) ? selectedDatas?.map((data) => data.id) : [],
    });
  };

  // table에서 사용하는 헤더들
  const headers =
    backData?.length &&
    Object.keys(backData[0]).filter(
      (key) => !['id', 'file_url', 'details', 'report_name'].includes(key),
    );

  return (
    <>
      <Header />
      <section className="flex flex-col justify-center items-center my-20">
        <div className="relative flex justify-start items-center w-full px-10">
          <TitleInfo title="백데이터 확인하기" />
          <div className="absolute flex items-center justify-center right-20 space-x-2">
            <PrimaryButton
              text={ACTIVE}
              color="mainOrange"
              size="big"
              onClick={() => handleDisactiveAllClick(true)}
            />
            <GrayButton text={INACTIVE} onClick={() => handleDisactiveAllClick(false)} />
            <Plus
              className="bg-[#e8e8e8] p-2 rounded-md cursor-pointer"
              size={35}
              onClick={() => {
                console.log('onclick');
                setOnAddDataModal(true);
              }}
            />
            <Trash2
              className="bg-[#e8e8e8] p-2.5 rounded-md cursor-pointer"
              size={35}
              onClick={() => setOnAlertDeleteModal(true)}
            />
          </div>
        </div>

        <section className="flex justify-center items-center h-[600px] w-full p-10">
          {backData && headers ? (
            <BackDataTable
              onFileUpload={onFileUpload}
              onSetData={(newBackData) => handleOnSetData(newBackData)}
              datas={backData}
              isScrolled={true}
              headers={headers}
              isSelectable={false}
              onRowSelect={onRowSelect}
            />
          ) : (
            <NoDataPage content="백데이터가 존재하지 않습니다." size="big" />
          )}
        </section>
      </section>
      {onAddDataModal && (
        <Portal>
          <div className="w-4/12">
            <EditModal
              title={'백데이터 추가하기'}
              onClose={() => setOnAddDataModal(false)}
              onConfirm={(addingData: BackDataType) => onConfirmAddData(addingData)}
              pageId={Number(pageId)}
              workspaceId={Number(workspaceId)}
            />
          </div>
        </Portal>
      )}
      {onAttachedModal !== null && (
        <Portal>
          <div className="w-4/12">
            <CommentUploadBox
              title={onAttachedModal.isReUpload ? '백데이터 재업로드' : '백데이터 업로드'}
              isModal={true}
              onFileUpload={(file: File | null, isNotApplicable: boolean, comment: string) => {
                handleFileUpload(onAttachedModal.id, file, isNotApplicable, comment);
                console.log('now Im in back data');
              }}
              onClose={() => setOnAttachedModal(null)}
            />
          </div>
        </Portal>
      )}
      {onSuccessModal !== null ? (
        <Portal>
          <AlertPopup
            type={AlertType.SUCCESS}
            message={onSuccessModal}
            onClose={() => setOnSuccessModal(null)}
          />
        </Portal>
      ) : null}
      {onAlertDeleteModal ? (
        <Portal>
          <AlertPopup
            type={AlertType.WARNING}
            message={'백데이터터를 삭제하시겠습니까?\n삭제하시면 복구할 수 없습니다.\n'}
            onClose={() => setOnAlertDeleteModal(false)}
            onConfirm={handleDeleteClick}
          />
        </Portal>
      ) : null}
      {onErrorModal !== null ? (
        <Portal>
          <AlertPopup
            type={AlertType.SUCCESS}
            message={onErrorModal}
            onClose={() => setOnErrorModal(null)}
          />
        </Portal>
      ) : null}
    </>
  );
};

export default BackDataPage;
