import supabase from '@/services/ConnectSupbase'
// import AddPages from './Collection/AddPages'
import { useEffect, useState } from 'react'
import UserMetadata from '@/services/UserMetadata'
import ListCollection from './Collection/ListCollection'
import NewCollection from './Collection/NewCollection'
import { Button } from '@/components/ui/button'
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
    <div className='min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-5'>
        <div className='flex mb-4 gap-2 justify-content items-center'>
          <div className='text-2xl font-bold text-foreground'>NOTEPACK</div>
          <div className='ml-auto'>
            {userMetadata?.username && 
              <div>Good day {userMetadata.username}</div>
            }
          </div>
          <Button
          onClick={() => {
            signOut()
            // console.log('ok')
          }}
          >SignOut</Button>

        </div>

        {/* <AddPages/> */}
        <div className='text-xl font-bold text-foreground'>[PACK] FLASHCARD</div>
        {userID && (
          <div className='space-y-2'>
            <NewCollection 
            onUpdateCollection={() => setRefreshList(prev => !prev)}
            userID={userID}/>
            <ListCollection userID={userID} refreshList={refreshList}/>
          </div>
        )}
        
    </div>
    
  )
}

export default HomeLayout