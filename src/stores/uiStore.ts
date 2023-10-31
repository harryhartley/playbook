import { create } from "zustand";

type UIStore = {
  fullWidthSearch: boolean;
  showFullWidthSearch: () => void;
  hideFullWidthSearch: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  fullWidthSearch: false,
  showFullWidthSearch: () => set({ fullWidthSearch: true }),
  hideFullWidthSearch: () => set({ fullWidthSearch: false }),
}));
