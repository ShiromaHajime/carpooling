import { UserAccount } from '@/types/types';
import React, { createContext, useState, ReactNode } from 'react';

interface UserContext {
    id?: number
    name: string;
    lastname: string;
    email: string;
    username: string;
}

type Role = "Passenger" | "Driver"

interface ContextType {
    user: UserContext;
    role: Role
    setUser: (value: UserAccount) => void;
    setRole: (value: Role) => void;
}

const initialState = {
    id: 0,
    name: '',
    lastname: '',
    email: '',
    username: '',
}


// Create the context with a default value
export const GlobalContext = createContext<ContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserContext>(initialState);
    const [role, setRole] = useState<Role>("Passenger");

    return (
        <GlobalContext.Provider value={{ user, role, setUser, setRole }}>
            {children}
        </GlobalContext.Provider>
    );
};