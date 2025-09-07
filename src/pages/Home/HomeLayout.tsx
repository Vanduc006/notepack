import supabase from '@/services/ConnectSupbase'
// import AddPages from './Collection/AddPages'
import { useEffect, useState } from 'react'
import UserMetadata from '@/services/UserMetadata'
import ListCollection from './Collection/ListCollection'
import NewCollection from './Collection/NewCollection'
// import React from 'react'

const HomeLayout = () => {
  
  const signOut = async() => {
    await supabase.auth.signOut()
    console.log('ok')
  }

  const metadata = {
    username : null,
    email : null,
    avatarURL : null,
    userID : null,
  }
  
  const [userMetadata,setUserMetadata] = useState(metadata)
  const [userID,setUserID] = useState<string>('')
  const [refreshList, setRefreshList] = useState(false)
  // console.log(refreshList)
  useEffect(() => {
    const getUser = async() => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserID(session.user.id)
        // console.log("UserID from session:", session.user.id) // log trực tiếp ở đây
      }

      await UserMetadata().then((data) => {
        // console.log(data)
        setUserMetadata(prev => ({
          ...prev,
          username : data.full_name,
        }))
      })
    }

    getUser()
  },[userID])

  return (
    <div className='min-h-screen bg-gray-200 w-full p-4'>
        <div className='mx-auto text-center'>NOTEPACK</div>
        <div>
          {userMetadata?.username && 
            <div>Good day {userMetadata.username}</div>
          }
        </div>
        {/* <AddPages/> */}
        {userID && (
          <>
            <NewCollection 
            onUpdateCollection={() => setRefreshList(prev => !prev)}
            userID={userID}/>
            <ListCollection userID={userID} refreshList={refreshList}/>
          </>
        )}
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