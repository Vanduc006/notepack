// import React from 'react'
import supabase from './ConnectSupbase'

const QueryCollection = async(
    statement : string,
    userID ?: string,
    playload ?: any,
):Promise<any> => {
  switch (statement) {

    case 'UPDATE' : {
      const {error} = await supabase
      .from('collection')
      .update(playload)
      .eq('userID',userID)
      
      if (error) {
        return error
      }
      return 'OK'
    }

    case 'FETCH': {
      if (!userID) {
        // throw new Error("userID is required for FETCH")
        return
      }
      const { data, error } = await supabase
        .from('collection')
        .select('*')
        .eq('userID', userID)
        .order("created_at", { ascending: false})


      if (error) {
        console.error("FETCH error:", error)
        return null
      }
      return data
    }

    case 'INSERT': {
        const {error} = await supabase
        .from('collection')
        .insert(playload)
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
        .from('collection')
        .delete()
        .eq('userID', userID)

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

export default QueryCollection
