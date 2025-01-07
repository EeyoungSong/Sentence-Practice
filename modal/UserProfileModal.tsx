import { ReactSVG } from 'react-svg';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { GrayButton } from '@/components/buttons/GrayButton';
import { TitleInfo } from '@/components/title/TitleInfo';
import { useMutation } from '@tanstack/react-query';
import { sendLogoutData } from '@/pages/api/userApi';
import useProfileStore from '@/store/profile';
import { useRouter } from 'next/router';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal = ({ onClose }: UserProfileModalProps): JSX.Element => {
  const { username, email } = useProfileStore();
  const router = useRouter();

  const sendLogoutDataMutaion = useMutation({
    mutationKey: ['logout'],
    mutationFn: () => sendLogoutData(),
    onMutate: () => {
      console.log('logout');
    },
    onSuccess: () => {
      const logout = useProfileStore.getState().logout;
      logout();
      router.push('/user/login');
      sessionStorage.clear();
    },
    onError: () => {
      console.log('An error occured');
    },
  });

  const handleLogoutClick = async (): Promise<void> => {
    sendLogoutDataMutaion.mutate();
  };

  const handleEditClick = (): void => {
    router.push('/user/profile-edit');
  };

  return (
    <div className="relative shadow-xl rounded-[10px] w-full h-full flex flex-col justify-center items-center bg-white">
      <span className="flex w-full justify-between p-2">
        <ReactSVG src="/icons/close.svg" className="w-5 h-5 ml-auto m-1" onClick={onClose} />
      </span>

      <div className="flex flex-col px-10 justify-center items-center w-full h-full">
        <TitleInfo title={'Profile'} />
        <p>이름: {username}</p>
        <p>email: {email}</p>
        <div className="my-4 flex flex-row">
          <GrayButton text={'정보수정'} onClick={handleEditClick} />
          <PrimaryButton
            text={'로그아웃'}
            color="mainOrange"
            onClick={handleLogoutClick}
            size="big"
          />
        </div>
      </div>
    </div>
  );
};
