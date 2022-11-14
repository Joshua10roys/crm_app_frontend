import { createContext } from 'react';
import { useState } from 'react';

export const ContextAuth = createContext();

export default function AuthProvider({ children }) {

    const [auth, setAuth] = useState(false);

    return (
        <ContextAuth.Provider value={{ auth, setAuth }} >
            {children}
        </ContextAuth.Provider>
    )
} 