import { UserAccount } from '@/types/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';


interface UserContext {
    id?: number
    name: string;
    lastname: string;
    email: string;
    username: string;
}

interface ContextType {
    state: UserContext;
    setState: (value: UserAccount) => void;
}

const initialState = {
    id: 0,
    name: '',
    lastname: '',
    email: '',
    username: ''
}

// Create the context with a default value
export const GlobalContext = createContext<ContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<UserContext>(initialState);

    return (
        <GlobalContext.Provider value={{ state, setState }}>
            {children}
        </GlobalContext.Provider>
    );
};