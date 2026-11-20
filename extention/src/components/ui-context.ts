import { createContext, useContext } from 'react';

export type PanelKind = 'idea' | 'notes' | 'focus' | 'tools' | 'feedback';
export interface UiApi {
  openPanel: (k: PanelKind) => void;
  newProject: () => void;
  openMood: () => void;
  openFunding: () => void;
}
export const UiContext = createContext<UiApi>({ openPanel: () => {}, newProject: () => {}, openMood: () => {}, openFunding: () => {} });
export const useUi = () => useContext(UiContext);
