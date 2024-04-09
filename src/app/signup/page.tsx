'use client'
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type SignupDataType = {
    name: string; email: string; password: string
}

export default function Signup() {
    const [userData, setUserData] = useState<SignupDataType>({
        name: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState<string>('')
    const router = useRouter();

    const signupUser = api.user.create.useMutation({
        onSuccess: ({ token }) => {
            setUserData({
                name: '',
                email: '',
                password: ''
            });
            sessionStorage.setItem('auth-token', token)
            router?.push('/otp')
        },
    });

    const isPasswordValid = (password: string) => {
        const isValid = /[a-zA-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)
        return isValid;
    }

    return <div className='w-full flex items-start justify-center border py-10'>
        <div
            className='w-[36rem] flex flex-col items-center justify-start p-16 rounded-[20px] border border-[#C1C1C1]'
        >
            <h3 className='font-semibold text-3xl mb-5'>Create your account</h3>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (isPasswordValid(userData?.password)) {
                        signupUser.mutate(userData);
                    }
                    else {
                        setError('Password must contain characters, numbers and special characters')
                    }

                }}
                className='flex flex-col w-full'
            >
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    value={userData?.name}
                    placeholder='Enter'
                    id="name"
                    className='w-full border rounded-md p-2 text-base placeholder:text-[#848484] mb-6'
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    required
                />
                <label htmlFor="email">Email</label>
                <input
                    type='email'
                    value={userData?.email}
                    placeholder='Enter'
                    id="email"
                    className='w-full border rounded-md p-2 text-base placeholder:text-[#848484] mb-6'
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                    required />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    value={userData?.password}
                    placeholder='Enter'
                    id="password"
                    className='border rounded-md p-2'
                    onChange={(e) => {
                        if (error) {
                            setError('')
                        }
                        setUserData(prev => ({ ...prev, password: e.target.value }))
                    }}
                    required
                />
                {error && <p className='text-sm text-red-500'>{error}</p>}
                <button type='submit' className='bg-black text-white text-center rounded-md w-full mt-8 mb-6 py-4'>CREATE ACCOUNT</button>
            </form>
            <p className='text-base text-[#333333] text-center mt-3'>
                Have an Account?
                <Link href="/login" className="font-medium text-black ml-2">
                    LOGIN
                </Link>
            </p>
        </div>
    </div>
}