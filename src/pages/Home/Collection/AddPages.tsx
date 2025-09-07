// import React from 'react'

import { useState } from "react"

const AddPages = () => {
    const [pageURL,setPageURL] = useState('')
    
    const pageID = (pageURL : string) => {
        const match = pageURL.match(/-([0-9a-f]{32})(?:\?|$)/);
        if (match) {
            return match[1]
        }
        else return
    }
  return (
    <div>
        <div className=''>
            <input 
            value={pageURL} onChange={(e) => {
                setPageURL(e.target.value)
            }} type="text" 
            className='w-full shadow-md bg-white px-2 rounded-md outline-0'/>
            <button 
            onClick={() => {
                console.log(pageID(pageURL))
            }}
            className='shadow-md bg-white px-5 py-1 rounded-md'>
                Add Notion page
            </button>
        </div>
    </div>
  )
}

export default AddPages