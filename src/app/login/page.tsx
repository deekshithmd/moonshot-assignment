'use client'
import { useState } from 'react';
import { api } from "@/trpc/react";
import Link from 'next/link';
import { useData } from '../contexts/DataContext';
import { useRouter } from 'next/navigation';
import { type UserType } from '../types/types';

export default function Login() {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState<string>('')
    const { setUser, setIsLoggedIn } = useData();
    const router = useRouter();

    const loginUser = api.user.loginUser.useMutation({
        onSuccess: (user: UserType) => {
            setUser(user);
            setIsLoggedIn(true);
            sessionStorage.setItem('auth-token', String(user?.token))
            sessionStorage.setItem('user', JSON.stringify(user))
            if (user?.verified) {
                router.push('/')
            }
            else {
                router.push('/otp')
            }
        },
        onError: (e) => {
            setError(e.message)
        }
    })

    return (
        <div className='w-full flex items-start justify-center border py-10'>
            <div className='w-[36rem] flex flex-col items-center justify-start p-16 rounded-[20px] border border-[#C1C1C1]'>
                <h3 className='font-semibold text-3xl mb-5'>Login</h3>
                <p className='font-medium text-2xl mb-2'>Welcome back to ECOMMERCE</p>
                <p className='text-base mb-4'>The next gen business marketplace</p>
                {error && <p className='text-sm text-red-500'>{error}</p>}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setError('')
                        loginUser.mutate(loginData)
                    }}
                    className='flex flex-col w-full'
                >
                    <label htmlFor="email">Email</label>
                    <input
                        type='email'
                        value={loginData?.email}
                        placeholder='Enter'
                        id="email"
                        className='w-full border rounded-md p-2 text-base placeholder:text-[#848484] mb-6'
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        required />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        value={loginData?.password}
                        placeholder='Enter'
                        id="password"
                        className='w-full border rounded-md p-2 text-base placeholder:text-[#848484]'
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        required />
                    <button type='submit' className='bg-black text-white text-center rounded-md w-full mt-8 mb-6 py-4'>LOGIN</button>
                </form>
                <hr />
                <p className='text-base text-[#333333] text-center mt-3'>
                    Don&apos;t have an Account?
                    <Link href="/signup" className="font-medium text-black ml-2">
                        SIGNUP
                    </Link>
                </p>

            </div>
        </div>
    )
}