// import React from 'react'
import supabase from "./ConnectSupbase"

const QueryAppUser = async(
    statement : string,
    userID ?: string,
    payload ?: string,
):Promise<any> => {
    switch (statement) {
        case 'FETCH': {
            if (!userID) {
                // throw new Error("userID is required for FETCH")
                return
            }
            const { data, error } = await supabase
                .from('appuser')
                .select('*')
                .eq('userID', userID)

            if (error) {
                console.error("FETCH error:", error)
                return null
            }
            return data
            }

        case 'UPDATE': {
            const {error} = await supabase
            .from('appuser')
            .update(payload)
            .eq('userID',userID)
            if (error) {
                console.log(error)
                return 'FAIL'
            }
            return 'OK'
        }
        
        default:
        throw new Error(`Unknown statement: ${statement}`)

    }
}

export default QueryAppUser