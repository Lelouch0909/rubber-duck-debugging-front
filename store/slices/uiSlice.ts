import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    isSidebarOpen: boolean;
    isRightSidebarOpen: boolean;
    theme: 'light' | 'dark';
    isSending: boolean;
}

const initialState: UIState = {
    isSidebarOpen: true,
    isRightSidebarOpen: true,
    theme: 'dark',
    isSending: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },

        toggleRightSidebar: (state) => {
            state.isRightSidebarOpen = !state.isRightSidebarOpen;
        },

        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },

        setIsSending: (state, action: PayloadAction<boolean>) => {
            state.isSending = action.payload;
        },
    },
});

export const {
    toggleSidebar,
    toggleRightSidebar,
    setTheme,
    setIsSending,
} = uiSlice.actions;

export default uiSlice.reducer;

