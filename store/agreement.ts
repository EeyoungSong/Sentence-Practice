import { create } from 'zustand';

interface AgreementState {
  agreement: string;
  setAgreement: (data: string) => void;
}

const useAgreementStore = create<AgreementState>((set) => ({
  agreement: '',
  setAgreement: (agreement: string) => set({ agreement }),
}));

export default useAgreementStore;
