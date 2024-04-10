/* eslint-disable @typescript-eslint/no-unsafe-argument */
'use client'
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { api } from '@/trpc/react';
import { type UserType } from '../types/types';

export default function OtpPage() {
    const length = 8;
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));
    const [OTP, setOTP] = useState<string[]>(Array(length).fill(''));
    const [showError, setShowError] = useState<boolean>(false)
    const { setIsLoggedIn, setUser, user } = useData();

    const verifyOtp = api.user.verifyUser.useMutation({
        onSuccess: (user: { token: string; name: string; email: string; id: number; } | undefined) => {
            setUser && setUser(user as UserType);
            setIsLoggedIn && setIsLoggedIn(true);
            sessionStorage.setItem('auth-token', String(user?.token))
            sessionStorage.setItem('user', JSON.stringify(user))
            router?.push('/')
        }
    });

    const submitOtp = (pin: string) => {
        if (pin?.length === length) {
            verifyOtp.mutate({
                token: String(sessionStorage.getItem('auth-token')),
                otp: Number(pin)
            })
        }
        else {
            setShowError(true)
        }
    }

    const handleTextChange = (input: string, index: number) => {
        setShowError(false)
        const newPin = [...OTP];
        newPin[index] = input;
        setOTP(newPin);

        if (input.length === 1 && index < length - 1) {
            inputRef.current[index + 1]?.focus();
        }

        if (input.length === 0 && index > 0) {
            inputRef.current[index - 1]?.focus();
        }
    };

    return (
        <div className='w-full flex items-start justify-center border py-10'>
            <div className='w-[36rem] flex flex-col items-center justify-start p-16 rounded-[20px] border border-[#C1C1C1]'>
                <h3 className='font-semibold text-3xl mb-5'>Verify your email</h3>
                <p className='text-base'>Enter the 8 digit code you have received on</p>
                <p className='text-base font-medium'>{user?.email}</p>
                <div className='mt-5 w-full flex flex-col items-start'>
                    <p className='text-base'>Code</p>
                    <div className='w-full grid grid-cols-8 gap-x-4'>
                        {Array.from({ length }, (_, index) => (
                            <input
                                key={index}
                                type='text'
                                maxLength={1}
                                value={OTP[index]}
                                onChange={(e) => handleTextChange(e.target.value, index)}
                                ref={(ref: HTMLInputElement) => { inputRef.current[index] = ref }}
                                className={`border border-solid border-border-slate-500 focus:border-blue-600 px-3.5 py-2`}
                            />
                        ))}
                    </div>
                    {showError && <p className='text-sm text-red-700'>Provide all 8 values</p>}
                    <button
                        className='bg-black text-white text-center rounded-md w-full mt-10 py-4'
                        onClick={() => submitOtp(OTP?.join(''))}
                    >
                        VERIFY
                    </button>
                </div>
            </div>
        </div>
    )
}