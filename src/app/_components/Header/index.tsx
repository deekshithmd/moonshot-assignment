'use client'
import { IoIosSearch } from "react-icons/io";
import { LuLogOut } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { useData } from '@/app/contexts/DataContext';
import { PiShoppingCartSimple } from "react-icons/pi";
import { LiaAngleRightSolid } from "react-icons/lia";

export const Header = () => {
    const { user } = useData();
    const router = useRouter();

    return (
        <nav className='w-full max-w-[1440px] sticky top-0 bg-white'>
            <div className='w-full flex items-center justify-end text-xs text-[#333333] gap-x-5 py-3 px-10'>
                <span>Help</span>
                <span>Orders&Returns</span>
                <span>Hi,{user?.name || 'John'}</span>
                <LuLogOut className='cursor-pointer' onClick={() => {
                    sessionStorage.removeItem('auth-token');
                    sessionStorage.removeItem('user');
                    router.push('/login');
                }} />
            </div>
            <div className='w-full flex items-center justify-between px-10 relative pb-3'>
                <span className='text-3xl font-bold'>ECOMMERCE</span>
                <div className='flex items-center justify-center gap-x-5 font-semibold text-base absolute bottom-3.5 left-1/2 transform -translate-x-1/2'>
                    <span>Categories</span>
                    <span>Sale</span>
                    <span>Clearance</span>
                    <span>New stock</span>
                    <span>Trending</span>
                </div>
                <div className='flex items-center justify-end gap-x-5'>
                    <IoIosSearch className='w-5 h-5 text-[#333333]' />
                    <PiShoppingCartSimple className="w-5 h-auto" />
                </div>
            </div>
            <div className='w-full flex items-center justify-center bg-[#F4F4F4] py-2 gap-x-5'>
                <LiaAngleRightSolid className="w-4 h-auto" />
                <span className='font-medium text-sm text-black'>Get 10% off on business sign up</span>
                <LiaAngleRightSolid className="w-4 h-auto rotate-180" />

            </div>
        </nav>
    )
}