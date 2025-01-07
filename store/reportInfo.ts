import { ReportData } from '@/types/data';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReportState {
  id: number;
  name: string;
  year: number;
  month: number;
  stage: number;
  is_corrective: boolean;
  is_active: boolean;
  status: number;
  admin: string;
  parent_workspace: string | null;
  setReportInfo: (data: Partial<ReportData>) => void;
}

const useReportInfoState = create(
  persist<ReportState>(
    (set) => ({
      id: 0,
      name: '',
      year: 0,
      month: 0,
      stage: 0,
      is_corrective: false,
      is_active: false,
      status: 0,
      admin: '',
      parent_workspace: null,
      setReportInfo: (data: Partial<ReportData>) => set(data),
    }),
    {
      name: 'ReportInfo',
    },
  ),
);

export default useReportInfoState;
