import supabase from '@/hooks/ConnectSupbase'
// import React from 'react'

const AuthLayout = () => {
    const signUp = async() => {
        await supabase.auth.signInWithOAuth({
            provider : 'google'
        })
    }
  return (
    <div className='min-h-screen bg-gray-200 flex flex-col'>
        <div className='flex-1 flex items-center justify-center bg-gray-200 text-black'>
          {/* <img src="/favicon.svg" className="w-8 h-8 rounded-md mr-2"/> */}
            <div onClick={() => {
                signUp()
            }}>Continue with Google</div>
        </div>
      </div>
  )
}

export default AuthLayout