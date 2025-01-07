import { create } from 'zustand';

// 팝업이 열렸을 때 검증식 backspace와 겹치지 않을 용도
interface PopupState {
  isOpen: boolean;
  popup: 'modify' | 'delete';
  setIsOpen: (isOpen: boolean) => void;
  setPopup: (popup: 'modify' | 'delete') => void;
}

const usePopupStore = create<PopupState>((set) => ({
  isOpen: false,
  popup: 'delete',
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  setPopup: (popup: 'modify' | 'delete') => set({ popup }),
}));

export default usePopupStore;
