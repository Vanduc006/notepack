// import React from 'react'

const AddCard = async(page_id : string, collection_id : string):Promise<any[]> => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer" + import.meta.env.VITE_NOTION_KEY);
    myHeaders.append("Notion-Version", "2022-06-28");
    myHeaders.append("Content-Type", "application/json");

    var raw = {   
      "children": [
        {
          "object": "block",
          "type": "embed",
          "embed": {
            "url": "https://notepack.vercel.app/" + collection_id,
          }
        }
      ]
    }

    const respone = await fetch('https://api.notion.com/v1/blocks/'+ page_id + '/children',{
      method : 'PATCH',
      headers : myHeaders,
      body : JSON.stringify(raw),
      redirect : 'follow'
    })
    const data = await respone.json()
    
  return data || []
}

export default AddCard