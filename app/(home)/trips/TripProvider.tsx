import { TripById, modeMap } from '@/types/types';
import React, { createContext, useState, ReactNode } from 'react';


export interface TripContext { //va a cambiar para mejorar performance
    origin: string,
    destination: string,
}

interface ContextType {
    selectingMode: modeMap
    trip: TripContext;
    setTrip: (value: TripContext) => void;
    setSelectingMode: (mode: modeMap) => void;
}

export const initialState: TripContext = {
    origin: '',
    destination: '',
}


// Create the context with a default value
export const TripContext = createContext<ContextType>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [trip, setTrip] = useState<TripContext>(initialState);
    const [selectingMode, setSelectingMode] = useState<modeMap>('iddle');
    return (
        <TripContext.Provider value={{ trip, setTrip, selectingMode, setSelectingMode }}>
            {children}
        </TripContext.Provider>
    );
};