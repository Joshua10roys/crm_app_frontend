import { createContext } from 'react';
import { useState } from 'react';

export const ContextUser = createContext();

export default function UserProvider({ children }) {

    const [user, setUser] = useState({});

    return (
        <ContextUser.Provider value={{ user, setUser }} >
            {children}
        </ContextUser.Provider>
    )
} 