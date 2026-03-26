import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ConfigState {
    rpcUrl: string;
    username: string;
    password: string;
    setConfig: (config: Partial<Omit<ConfigState, 'setConfig'>>) => void;
    clearConfig?: (config: any) => void;
}
export const useUserConfigStore = create<ConfigState>()(
    persist(
        (set) => ({
            rpcUrl: 'http://192.168.1.109:49092/transmission/rpc',
            username: '',
            password: '',
            setConfig: (newConfig) => set((state) => ({ ...state, ...newConfig })),
            clearConfig: () => set({ rpcUrl: '', username: '', password: '' }),
        }),
        {
            name: 'user-config-storage',
        }
    ))