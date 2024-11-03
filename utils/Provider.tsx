import { UserAccount } from '@/types/types';
import React, { createContext, useState, ReactNode } from 'react';

export interface UserContext {
    id: string,
    name: string,
    lastname: string,
    email: string,
    username: string,
    creation_date: string,
}

type Role = "Passenger" | "Driver"

interface ContextType {
    user: UserContext;
    role: Role
    setUser: (value: UserContext) => void;
    setRole: (value: Role) => void;
}

export const initialState: UserContext = {
    id: '',
    name: '',
    lastname: '',
    email: '',
    username: '',
    creation_date: '',
}


// Create the context with a default value
export const GlobalContext = createContext<ContextType>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserContext>(initialState);
    const [role, setRole] = useState<Role>("Passenger");

    return (
        <GlobalContext.Provider value={{ user, role, setUser, setRole }}>
            {children}
        </GlobalContext.Provider>
    );
};