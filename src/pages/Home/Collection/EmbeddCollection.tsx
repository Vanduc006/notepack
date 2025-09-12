// import React from 'react'

// import supabase from "@/services/ConnectSupbase";
// import QueryAppUser from "@/services/QueryAppUser";
// import RefreshToken from "@/services/RefreshToken";
// import { useState } from "react";

const EmbeddCollection = async(page_id : string, collectionID : string,userID : string):Promise<any[]> => {
    // const [currentRefreshToken,setCurrentRefreshToken] = useState("")
    // const [currentAccessToken,setCurrentAccessToken] = useState("")
    // // const [currentUserID,setCurrentUserID] = useState("")
    // const getRefreshToken = async() => {
    //   const { data: { session } } = await supabase.auth.getSession()
    //   if (session) {
    //     // setCurrentRefreshToken(session.user.id)
    //     await QueryAppUser('FETCH',session.user.id,"").then(data => 
    //       setCurrentRefreshToken(data[0].notion_refresh_token)
    //     )

    //     await RefreshToken(currentRefreshToken).then(data => 
    //       setCurrentAccessToken(data.access_token)
    //     )
    //   }

    // }

    // getRefreshToken()

    // const { data: { session } } = await supabase.auth.getSession()
    // if (!session) {
    //   throw new Error("No session")
    // }

    const respone = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notion-page-emded`, // sai teen :))
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: page_id,
        collection_id: collectionID,
        user_id: userID,
      })
    }
    )
    const data = await respone.json()
    console.log(data)
    return data.results[0].id || ""

    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer" + accessToken);
    // myHeaders.append("Notion-Version", "2022-06-28");
    // myHeaders.append("Content-Type", "application/json");
    
    // var raw = {   
    //   "children": [
    //     {
    //       "object": "block",
    //       "type": "embed",
    //       "embed": {
    //         "url": `https://notepack.vercel.app/view?vm=embed&collect_id=${collectionID}`,
    //       }
    //     }
    //   ]
    // }

    // const respone = await fetch('https://api.notion.com/v1/blocks/'+ page_id + '/children',{
    //   method : 'PATCH',
    //   headers : myHeaders,
    //   body : JSON.stringify(raw),
    //   redirect : 'follow'
    // })
    // const data = await respone.json()
    
  // return data || []
}

export default EmbeddCollection