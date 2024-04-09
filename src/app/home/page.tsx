'use client'
import { useState } from 'react';
import { api } from "@/trpc/react";
import { CheckAuth } from '../_components/CheckAuth';

export default function HomePage() {
    const [page, setPage] = useState<number>(0)
    const itemsPerPage = 6;

    const userData = api.user.getUser.useQuery({ token: sessionStorage.getItem('auth-token') })

    const allCategories = api.categories.getCategories.useInfiniteQuery(
        {
            limit: itemsPerPage,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    );

    const updateInterest = api.user.updateInterests.useMutation({
        onSuccess: async () => {
            await userData.refetch();
        },
        onError: (e) => {
            console.log('Error', e.message)
        }
    })

    const handleFetchNextPage = async () => {
        if (Number(allCategories?.data?.pages?.length) - 1 === page) {
            await allCategories?.fetchNextPage();
        }
        setPage(prev => prev + 1);
    }

    const handleFetchPreviousPage = () => {
        setPage(prev => prev > 1 ? prev - 1 : 0);
    }

    return (
        <CheckAuth>
            <div
                className='w-[36rem] flex flex-col items-center justify-start p-16 rounded-[20px] border border-[#C1C1C1]'
            >
                <h3 className='font-semibold text-3xl mb-5'>Please mark your interests!</h3>
                <p className='text-base mb-4'>We will keep you notified.</p>
                <div className='w-full flex flex-col items-start justify-start gap-y-4'>
                    <p className='text-xl font-medium'>My saved interests!</p>
                    {
                        allCategories?.isLoading ?
                            <p>Loading...</p>
                            :
                            allCategories?.data?.pages[page]?.categories?.map(item => {
                                return (
                                    <div key={item?.id} className='flex items-center gap-x-2'>
                                        <input
                                            type="checkbox"
                                            checked={userData?.data?.interests?.includes(item?.id)}
                                            onChange={e => updateInterest.mutate({ categoryId: item?.id, token: sessionStorage.getItem('auth-token') })}
                                            className='accent-neutral-800'
                                        />
                                        <span>{item?.category}</span>
                                    </div>
                                )
                            })
                    }
                    <div className='flex items-center flex-start gap-x-2 text-xl text-[#ACACAC] mt-8'>
                        <button onClick={handleFetchPreviousPage}>{`<`}</button>
                        {
                            Array(page).fill(0)?.map((_, i) => {
                                return (
                                    <span key={i} className='cursor-pointer' onClick={() => setPage(i)}>{i + 1}</span>
                                )
                            })
                        }
                        <span className='font-semibold cursor-pointer text-black'>{page + 1}</span>
                        {
                            Number(allCategories?.data?.pages?.length) > 1 && Array(Number(allCategories?.data?.pages?.length) - 1 - page).fill(0)?.map((_, i) => {
                                return (
                                    <span key={i} className='cursor-pointer' onClick={() => setPage(i + page + 1)}>{i + page + 2}</span>
                                )
                            })
                        }
                        <button onClick={handleFetchNextPage}>{`>`}</button>
                    </div>
                </div>
            </div>
        </CheckAuth>
    );
}