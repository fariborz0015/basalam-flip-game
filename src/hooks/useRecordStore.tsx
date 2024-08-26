import create from 'zustand';

interface Record {
  timeSpent: number;  // تایم صرف شده به ثانیه
  movesLeft: number;  // تعداد حرکت باقی‌مانده
  score: number;      // امتیاز
  date: string;       // تاریخ شرکت
}

interface RecordStore {
  records: Record[];
  addRecord: (record: Record) => void;
  loadRecords: () => void;
}

const useRecordStore = create<RecordStore>((set) => ({
  records: [],
  addRecord: (record) => set((state) => {
    if (typeof window !== 'undefined') {
      const updatedRecords = [...state.records, record];
      localStorage.setItem('records', JSON.stringify(updatedRecords));
      return { records: updatedRecords };
    }
    return state;
  }),
  loadRecords: () => {
    if (typeof window !== 'undefined') {
      const storedRecords = localStorage.getItem('records');
      const parsedRecords = storedRecords ? JSON.parse(storedRecords) : [];
      set({ records: parsedRecords });
    }
  },
}));

 

export default useRecordStore;
