'use client'
import { useData } from '@/app/contexts/DataContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export const CheckAuth = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedin } = useData();
    const router = useRouter();

    useEffect(() => {
        if (isLoggedin || sessionStorage.getItem('auth-token')) {
            router.push('/')
        }
        else {
            router.push('/login')
        }
    }, [])

    return <>{children}</>
}