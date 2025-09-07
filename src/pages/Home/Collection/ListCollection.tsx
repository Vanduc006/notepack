// import React from 'react'

import QueryCollection from "@/services/QueryCollection"
import { useEffect, useState } from "react"

type ListCollectionProps = {
    userID : string,
    refreshList ?: boolean,
}

type Collection = {
  id: number
  title: string
  created_at: string
}

const sample: Collection[] = [
  { id: 1, title: "Calculus", created_at: new Date().toISOString() },
  { id: 2, title: "Linear Algebra", created_at: new Date().toISOString() },
  { id: 3, title: "Physics", created_at: new Date().toISOString() },
  { id: 4, title: "Chemistry", created_at: new Date().toISOString() },
  { id: 5, title: "Computer Science", created_at: new Date().toISOString() },
  { id: 6, title: "Artificial Intelligence", created_at: new Date().toISOString() },
  { id: 7, title: "Data Structures", created_at: new Date().toISOString() },
  { id: 8, title: "Algorithms", created_at: new Date().toISOString() },
  { id: 9, title: "Database Systems", created_at: new Date().toISOString() },
  { id: 10, title: "Software Engineering", created_at: new Date().toISOString() },
]

const ListCollection = ({userID,refreshList} : ListCollectionProps) => {

    const [listCollection,setListCollection] = useState<Collection[]>([])

    useEffect(() => {
        const getList = async() => {
            await QueryCollection('FETCH',userID).then((data) => {
                if (data) {
                    setListCollection([...data, ...sample]) // merge sample + fetched
                } else {
                    setListCollection(sample) // fallback sample nếu supabase rỗng
                }
            })
        }
        getList()
    },[userID,refreshList])

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {listCollection.length !== 0 &&
            listCollection.map((collection) => (
            <div
                key={collection.id}
                className="bg-white rounded-3xl p-4 flex flex-col h-40 transition-transform hover:scale-[1.02] cursor-pointer"
            >
                {collection.title}
            </div>
            ))
        }
    </div>
  )
}

export default ListCollection