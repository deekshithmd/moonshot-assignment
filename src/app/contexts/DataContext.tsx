'use client'
import React, { useContext, createContext, useState, useEffect } from 'react';

const DataContext = createContext({});

const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedin, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<any>();

    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            setUser(JSON.parse(sessionStorage.getItem('user') ?? ''))
            setIsLoggedIn(true)
        }
    }, [])

    return (
        <DataContext.Provider value={{ isLoggedin, setIsLoggedIn, user, setUser }}>
            {children}
        </DataContext.Provider>
    )
}

const useData = () => useContext(DataContext);

export { DataProvider, useData }