// import React from 'react'
import supabase from "./ConnectSupbase"

const QueyCard = async(
    statement : string,
    userID ?: string,
    collectionID ?: string | null,
    cardID ?: string,
    payload ?: any,
):Promise<any> => {
  switch (statement) {

    case 'UPDATE' : {
      const {error} = await supabase
      .from('card')
      .update(payload)
      .eq("index",cardID)
      .eq("collection",collectionID)
      .eq("userID",userID)

      if (error) {
        return error
      }
      return "OK"
    }

    case 'FETCH': {
      // if (!userID) {
      //   // throw new Error("userID is required for FETCH")
      //   return
      // }
      const { data, error } = await supabase
        .from('card')
        .select('*')
        // .eq('userID', userID)
        .eq('collectionID', collectionID)
        // .order("created_at", { ascending: true})

      if (error) {
        console.error("FETCH error:", error)
        return null
      }
      return data
    }

    case 'INSERT': {
        const {error} = await supabase
        .from('card')
        .insert(payload)
        if (error) {
            console.log(error)
            return 'FAIL'
        }
        return 'OK'
    }

    case 'DELETE': {
      if (!userID) {
        // throw new Error("userID is required for DELETE")
        return
      }
      const { data, error } = await supabase
        .from('card')
        .delete()
        .eq('userID', userID)
        .eq('collectionID',collectionID )
        .eq('cardID', cardID)
        
      if (error) {
        console.error("DELETE error:", error)
        return null
      }
      return data
    }
    default:
      throw new Error(`Unknown statement: ${statement}`)

  }
}

export default QueyCard