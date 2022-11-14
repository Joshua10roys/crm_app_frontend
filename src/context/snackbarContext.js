import { createContext } from 'react';
import { useState } from 'react';

export const ContextSnackbar = createContext();

export default function SnackbatProvider({ children }) {

    const [snackbar, setSnackbar] = useState({ open: false, message: null, severity: 'info' });

    return (
        <ContextSnackbar.Provider value={{ snackbar, setSnackbar }} >
            {children}
        </ContextSnackbar.Provider>
    )
} 