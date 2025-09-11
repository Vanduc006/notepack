// import React from 'react'

const RefreshToken = async(refreshToken : string | null):Promise<any> => {
  const respone = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notion-refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
  })
  const data = await respone.json()
  return data || ""
}
export default RefreshToken