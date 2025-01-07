import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { getUserData } from '@/pages/api/userApi';
import { useQuery } from '@tanstack/react-query';
import Close from '@/public/icons/close.svg';
import Image from 'next/image';
import styled from 'styled-components';
import { SearchInputBox } from '@/components/input/SearchInputBox';
import { ScrollSection } from '@/components/template/CommentsGroup';
import { CgClose } from 'react-icons/cg';
import { userData } from '@/types/data';
import { useCallback, useEffect, useState } from 'react';

const SearchSection = styled.section`
  min-width: 24rem;
  width: 600px;
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  padding: 0 3rem;
  box-shadow: '0 10px 15px rgba(0, 0, 0, 0.1),0 4px 6px rgba(0, 0, 0, 0.05)';
  background-color: white;
  height: 80vh;
`;

const StyledScrollSection = styled(ScrollSection)`
  height: 60vh;
  margin: 2rem 0;
`;

interface SearchUserProps {
  selectedUser: string[];
  setSelectedUser: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
}

export const SearchUserModal = ({
  selectedUser,
  setSelectedUser,
  onClose,
}: SearchUserProps): JSX.Element => {
  const [filteredUser, setFilteredUser] = useState<userData[]>();

  const { data: UserData, isLoading } = useQuery({
    queryKey: ['user_data'],
    queryFn: getUserData,
  });

  useEffect(() => {
    if (UserData) {
      setFilteredUser(UserData);
    }
  }, [UserData]);

  /**
   * 유저 클릭해서 토글하는 함수
   * @param user (userData)
   * @returns void
   */
  const handleUserClick = (user: userData): void => {
    const userIdentifier = `${user.username}(${user.employee_number})`;

    if (selectedUser.includes(userIdentifier)) {
      setSelectedUser((prev: string[]) => prev.filter((item) => item !== userIdentifier));
    } else {
      setSelectedUser((prev: string[]) => [...prev, userIdentifier]);
    }
  };

  /**
   * 선택된 담당자를 취소하는 함수
   * @param user
   * @returns void
   */
  const handleCancel = (user: string): void => {
    setSelectedUser((prev: string[]) => prev.filter((item) => item !== user));
  };

  /**
   * 검색 박스
   * @param searchText username, employee_number
   * @returns void
   */
  const handleSearch = useCallback((searchText: string): void => {
    if (!UserData) return;
    const searchUser = UserData.filter((value) => {
      return (
        String(value.username).includes(searchText) ||
        String(value.employee_number).includes(searchText)
      );
    });

    setFilteredUser(searchUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBorderColor = (user: userData): string => {
    const userIdentifier = `${user.username}(${user.employee_number})`;
    return selectedUser.includes(userIdentifier) ? 'border-mainOrange border-2' : '';
  };

  return (
    <SearchSection>
      <div className="flex justify-between my-8">
        <h1 className="text-2xl font-bold">담당자 검색</h1>
        <button onClick={onClose}>
          <Image src={Close} width={23} height={23} alt="닫기 버튼" />
        </button>
      </div>
      <SearchInputBox placeholder="이름, 직급으로 검색하세요" onSearch={handleSearch} />
      {/* 선택된 담당자 나타내는 영역 */}
      <section className="flex w-full mt-5 flex-wrap">
        {selectedUser &&
          selectedUser.map((user: string) => (
            <div
              key={`select` + user}
              className="flex justify-center items-center bg-[#EDEDED] mr-2 mt-2 px-2 py-1 rounded-md font-bold"
            >
              <span>{user}</span>
              <button className="ml-2" onClick={() => handleCancel(user)}>
                <CgClose />
              </button>
            </div>
          ))}
      </section>
      {isLoading && <LoadingSpinner />}
      <StyledScrollSection>
        {filteredUser &&
          filteredUser.map((user) => (
            <section
              key={`${user.username}(${user.department})`}
              className={`w-full h-12 bg-[#EDEDED] border-2 mt-2 rounded-md flex items-center cursor-pointer ${getBorderColor(user)}`}
              onClick={() => handleUserClick(user)}
            >
              <span className="ml-2">{user.department}</span>
              <span className="ml-2">{user.username}</span>
              <span>({user.employee_number})</span>
            </section>
          ))}
      </StyledScrollSection>
    </SearchSection>
  );
};
