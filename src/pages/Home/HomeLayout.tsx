import supabase from '@/hooks/ConnectSupbase'
// import React from 'react'

const HomeLayout = () => {
  const signOut = async() => {
    await supabase.auth.signOut()
    console.log('ok')
  }
  return (
    <div className='min-h-screen bg-gray-200 w-full p-4'>
        <div className='mx-auto text-center'>NOTEPACK</div>
        <div className='flex gap-2'>
            <input type="text" className='shadow-md bg-white px-2 py-1 rounded-md outline-0'/>
            <button className='shadow-md bg-white px-5 py-1 rounded-md'>
                Create
            </button>
        </div>
        <div>
            Exist note
        </div>
        <div className='bg-black' onClick={() => {
          signOut()
          // console.log('ok')
        }}>
          Signout
        </div>
    </div>
    
  )
}

export default HomeLayout