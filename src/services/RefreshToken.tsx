// import React from 'react'

const RefreshToken = async(
  // refreshToken : string | null
) => {
  const clientID = import.meta.env.VITE_NOTION_APPID
  const secret = import.meta.env.VITE_NOTION_SECRET
  const encode = btoa(`${clientID} : ${secret}`)
  console.log(encode)
  return encode
  // const respone = await fetch("https://api.notion.com/v1/oauth/token", {
  //   method : 'POST',
  //   headers : {
  //     "Accept" : "application/json",
  //     "Content-Type" : "application/json",
  //     "Authorization" : `Basic ${encode}`,
  //   },
  //   body : JSON.stringify({
  //     grant_type : "refresh_token",
  //     refresh_token : `${refreshToken}`
  //   })
  // })

  // const data = await respone.json()
  // return data
}

export default RefreshToken