import { deleteData, loginData, userData } from '@/types/data';

import { PwChangeData } from '../user/find-password';
import { SignUpData } from '../user/signup';
import { departments } from '../user/add-user';
import { getPermission } from '@/components/modal/AddUserModal';

interface APISuccessResult {
  message: string;
}

interface RoleData {
  [key: string]: string[];
}

interface LoginSuccessResult {
  username: string;
  email: string;
  employee_number: number;
  department: string;
  grade: string;
  permission: string;
}

// 부서 데이터 불러오는 api
export const getDepartmentData = async (): Promise<departments[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/departments/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await response.json();
  return data.departments;
};

// 해당 유저의 role 가져오는 api
export const getRoles = async (email: string): Promise<RoleData> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/report/user-roles/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email }),
  });
  const data = await response.json();
  return data.roles;
};

// user 데이터 불러오는 api
export const getUserData = async (): Promise<userData[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/users/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await response.json();
  const usersSubset = data.users.map((user: userData) => ({
    id: user.id,
    employee_number: user.employee_number,
    username: user.username,
    email: user.email,
    grade: user.grade,
    department: user.department,
    join_stage: user.join_stage,
    permission: user.is_superuser ? '시스템관리자' : user.is_staff ? '관리자' : '사용자',
  }));

  return usersSubset;
};

// 단일 user 생성 api
export const addUser = async (user: userData): Promise<APISuccessResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/users/create/`, {
    method: 'POST',
    headers: {},
    body: JSON.stringify({ users: [user] }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('데이터를 가져오는데 실패했습니다.');
  }
  return response.json();
};

// user 생성 api (bulk)
export const addUsers = async (users: userData[]): Promise<APISuccessResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/users/create/`, {
    method: 'POST',
    headers: {},
    body: JSON.stringify({ users }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('데이터를 가져오는데 실패했습니다.');
  }
  return response.json();
};

// user 수정 api
export const editUsers = async (editedData: userData): Promise<APISuccessResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/users/update/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    // 우선 임시 파일로 설정
    body: JSON.stringify({
      username: editedData.username,
      email: editedData.email,
      department: editedData.department,
      grade: editedData.grade,
      permission: getPermission(String(editedData.permission)),
    }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to send approve results');
  }
  return response.json();
};

// user 삭제 api
export const deleteUsers = async (emails: string[]): Promise<APISuccessResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/users/delete/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    // 우선 임시 파일로 설정
    body: JSON.stringify({ emails: emails }),
  });

  if (!response.ok) {
    throw new Error('Failed to send approve results');
  }
  return response.json();
};

// 로그인 api
export const sendLoginData = async (loginData: loginData): Promise<LoginSuccessResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/login/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      employee_number: loginData.email,
      password: loginData.password,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to Login');
  }

  console.log('Login successful');

  return response.json();
};

// 로그아웃 api
export const sendLogoutData = async (): Promise<APISuccessResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/logout/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to Logout');
  }

  console.log('Logout successful');

  return response.json();
};

// 권한 불러오는 api
export const getPermissionData = async (): Promise<userData[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/permissions/`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  const permissionsSubset = data.permissions.map((user: userData) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    grade: user.grade,
    department: user.department,
    permission: user.permission,
  }));

  return permissionsSubset;
};

// 권한 수정 api
export const editPermissions = async (editedData: userData[]): Promise<APISuccessResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/permissions/update/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    // 우선 임시 파일로 설정
    body: JSON.stringify({
      permissions: editedData,
    }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to send edit permissions results');
  }
  return response.json();
};

export const deleteUserData = async ({ emails }: deleteData): Promise<void> => {
  const response = await fetch('http://127.0.0.1:3000/user/manage-user', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emails }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete users');
  }
};

/**
 * 비밀번호 변경을 위한 인증 코드 발송
 */
export const getAuthCode = async (data: PwChangeData): Promise<APISuccessResult> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_IP}/account/password-reset/request-verification-code/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: data.email,
        employee_number: data.employee_number,
      }),
    },
  );

  if (response.status !== 200) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
};

/**
 * 비밀번호 변경 인증코드 확인
 */
export const getIsAuthcodeVaild = async (data: PwChangeData): Promise<APISuccessResult> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_IP}/account/password-reset/verify-code/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: data.email,
        verification_code: data.verification_code,
      }),
    },
  );

  if (response.status !== 200) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
};

/**
 * 비밀번호 변경
 */
export const resetPassword = async (data: PwChangeData): Promise<APISuccessResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/password-reset/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      ...data,
    }),
  });

  if (response.status !== 200) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
};

/**
 * 회원가입을 위한 인증 코드 발송
 */
export const getSignInAuthCode = async (data: SignUpData): Promise<APISuccessResult> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_IP}/account/signup/request-verification-code/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: data.email,
      }),
    },
  );

  if (response.status !== 200) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
};

/**
 * 회원가입 인증코드 확인
 */
export const getSignInIsAuthcodeVaild = async (data: SignUpData): Promise<APISuccessResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/signup/verify-code/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      email: data.email,
      verification_code: data.verification_code,
    }),
  });

  if (response.status !== 200) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
};

/**
 * 회원가입 요청
 */
export const postSignUpData = async (data: SignUpData): Promise<APISuccessResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/account/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
    }),
  });

  if (response.status !== 200) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
};
