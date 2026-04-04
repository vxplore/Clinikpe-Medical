import { create } from 'zustand';

interface RegistrationStore {
    // Form data
    storeName: string;
    ownerName: string;
    phoneNumber: string;
    address: {
        name: string;
        lat: number;
        lng: number;
    } | null;

    // Actions
    setFormData: (data: { storeName: string; ownerName: string; phoneNumber: string }) => void;
    setPhoneNumber: (phoneNumber: string) => void;
    setAddress: (address: { name: string; lat: number; lng: number }) => void;
    getFormData: () => { storeName: string; ownerName: string; phoneNumber: string; address: { name: string; lat: number; lng: number } | null };
    resetStore: () => void;
}

export const useRegistrationStore = create<RegistrationStore>((set, get) => ({
    storeName: '',
    ownerName: '',
    phoneNumber: '',
    address: null,

    setFormData: (data) => {
        set({
            storeName: data.storeName,
            ownerName: data.ownerName,
            phoneNumber: data.phoneNumber,
        });
    },

    setPhoneNumber: (phoneNumber) => {
        set({ phoneNumber });
    },

    setAddress: (address) => {
        set({ address });
    },

    getFormData: () => {
        const state = get();
        return {
            storeName: state.storeName,
            ownerName: state.ownerName,
            phoneNumber: state.phoneNumber,
            address: state.address,
        };
    },

    resetStore: () => {
        set({
            storeName: '',
            ownerName: '',
            phoneNumber: '',
            address: null,
        });
    },
}));
