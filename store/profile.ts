import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  username: string;
  email: string;
  employeeNumber: number;
  grade: string;
  department: string;
  $authType: string;
  roleType: { [key: string]: string[] };
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setEmployeeNumber: (employeeNumber: number) => void;
  setGrade: (grade: string) => void;
  setDepartment: (department: string) => void;
  setAuthType: (type: string) => void;
  setRoleType: (type: { [key: string]: string[] }) => void;
}

const useProfileStore = create(
  persist<ProfileState>(
    (set) => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () =>
        set({
          username: '',
          email: '',
          employeeNumber: -1,
          grade: '',
          department: '',
          $authType: '',
          roleType: {},
          isLoggedIn: false,
        }),
      username: '',
      email: '',
      employeeNumber: -1,
      grade: '',
      department: '',
      $authType: '',
      roleType: {},
      setUsername: (username: string) => set({ username }),
      setEmployeeNumber: (employeeNumber: number) => set({ employeeNumber }),
      setEmail: (email: string) => set({ email }),
      setGrade: (grade: string) => set({ grade }),
      setDepartment: (department: string) => set({ department }),
      setAuthType: ($authType: string) => set({ $authType }),
      setRoleType: (roleType: { [key: string]: string[] }) => set({ roleType }),
    }),
    {
      name: 'ProfileState',
    },
  ),
);

export default useProfileStore;
