// import React from 'react'
import supabase from "@/services/ConnectSupbase"
import QueryAppUser from "@/services/QueryAppUser"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import BounceLoader from "react-spinners/BounceLoader"

//   const redirectTarget = "https://notepack.vercel.app/call-back
// ?access_toke=" + access_token + "&refresh_token=" + refresh_token + 
// "&workspace_id=" + workspace_id + 
// "&workspace_name=" + encodeURIComponent(workspace_name);
const CallBack = () => {
  const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [userID,setUserID] = useState<string>('')

    const [searchParams] = useSearchParams()
    // console.log(encodeURIComponent('Ducvan :D'))
    // const CallbackData = {
    //     notion_access_token : '',
    //     notion_refresh_token : '',
    //     notion_workspace_id : '',
    //     notion_workspace_name : '',
    // }
    // const [callBack,setCallBack] = useState(CallbackData)

    const setAppUser = async(userID : string,payload : any) => {
        await QueryAppUser('UPDATE',userID,payload)
    }

    useEffect(() => {
        setLoading(true)

        // setCallBack({
        //     notion_access_token: searchParams.get("notion_access_token") ?? "",
        //     notion_refresh_token: searchParams.get("notion_refresh_token") ?? "",
        //     notion_workspace_id: searchParams.get("notion_workspace_id") ?? "",
        //     notion_workspace_name: searchParams.get("notion_workspace_name") ?? "",
        // })
        const getUser = async() => {
            const { data: { session } } = await supabase.auth.getSession()
            // const { data: { user } } = await supabase.auth.getUser()

            // console.log(user?.identities)
            // console.log()
            if (session?.user) {
                setUserID(session.user.id)
                setAppUser(session.user.id,{
                  notion_access_token : searchParams.get('notion_access_token') ?? "",
                  notion_refresh_token : searchParams.get('notion_refresh_token') ?? "",
                  notion_workspace_id : searchParams.get('notion_workspace_id') ?? "",
                  notion_workspace_name : searchParams.get('notion_workspace_name') ?? "",
                  // notion : true,
                })
                console.log("UserID from session:", session.user.id) // log trực tiếp ở đây
                navigate('/')

            }   
        }
        getUser()
        // setAppUser(CallbackData)

        setLoading(false)
    }, [searchParams])

    if (loading) {
        return (
        <div className='min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col'>
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-2xl font-bold flex items-center justify-center gap-2'>
              NOTEPACK
              <BounceLoader size={20} className='ml-2' color='#14b8a6'/> 
            </div>
          </div>
        </div>
        )
    }

  return (
    <div className="p-4 min-h-screen">
      <h2>OAuth Callback Data</h2>
      <p>ID {userID}</p>
      {/* <pre>{JSON.stringify(callBack, null, 2)}</pre> */}
    </div>
  )
}

export default CallBack