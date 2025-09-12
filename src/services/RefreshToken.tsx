// import React from 'react'

import supabase from "./ConnectSupbase"

const RefreshToken = async(userID : string):Promise<any> => {
  const {data, error} = await supabase
  .from("appuser")
  .select("notion_refresh_token")
  .eq("userID",userID)
  .single()
  if (error) {
    return error
  }
  return data
  // const respone = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notion-refresh-token`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ refresh_token: refreshToken }),
  // })
  // const data = await respone.json()
  // return data || ""
}
export default RefreshToken