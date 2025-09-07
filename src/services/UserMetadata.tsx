// import React from 'react'
// import type { UserMetadata } from "@supabase/supabase-js"
import supabase from "./ConnectSupbase"

const UserMetadata = async():Promise<any> => {
    try {
        const {data : {user}} = await supabase.auth.getUser()
        const metadata =  user?.user_metadata
        return metadata
    } catch (error) {
        console.log(error)
        return
    }
}

export default UserMetadata