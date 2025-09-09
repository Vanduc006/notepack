// import React from 'react'

import QueryCollection from "@/services/QueryCollection"
import { useEffect, useState } from "react"
import {
  Card,
//   CardAction,
  CardContent,
//   CardDescription,
//   CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Folder } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import BounceLoader from 'react-spinners/BounceLoader'

type ListCollectionProps = {
    userID : string,
    refreshList ?: boolean,
}

// type Collection = {
//   id: number
//   title: string
//   created_at: string

// }

// const sample: Collection[] = [
//   { id: 1, title: "Calculus", created_at: new Date().toISOString() },
//   { id: 2, title: "Linear Algebra", created_at: new Date().toISOString() },
//   { id: 3, title: "Physics", created_at: new Date().toISOString() },
//   { id: 4, title: "Chemistry", created_at: new Date().toISOString() },
//   { id: 5, title: "Computer Science", created_at: new Date().toISOString() },
//   { id: 6, title: "Artificial Intelligence", created_at: new Date().toISOString() },
//   { id: 7, title: "Data Structures", created_at: new Date().toISOString() },
//   { id: 8, title: "Algorithms", created_at: new Date().toISOString() },
//   { id: 9, title: "Database Systems", created_at: new Date().toISOString() },
//   { id: 10, title: "Software Engineering", created_at: new Date().toISOString() },
// ]

const ListCollection = ({userID,refreshList} : ListCollectionProps) => {
    const [loading,setLoading] = useState(false)
    const [listCollection,setListCollection] = useState<any[]>([])
    const navigate = useNavigate()
    useEffect(() => {
        setLoading(true)
        const getList = async() => {
            await QueryCollection('FETCH',userID).then((data) => {
                if (data) {
                    setListCollection([...data,]) // merge sample + fetched
                    setLoading(false)
                }
            })
        }
        getList()
    },[userID,refreshList])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {loading && (
        <Card className="col-span-full">
          <CardHeader className="flex">
            <CardTitle className="text-base">Delivering your pack</CardTitle>
          </CardHeader>
          <CardContent className="pb-6 text-sm text-muted-foreground flex items-center gap-1">
            It's take few seconds for preparing 
            <BounceLoader size={10} className='ml-2' color='#4871f7'/> 

          </CardContent>
        </Card>
      )}

      {!loading && listCollection.length == 0 && (
        <Card className="col-span-full">
          <CardHeader className="flex">
            <CardTitle className="text-base">You're have no pack</CardTitle>
          </CardHeader>
          <CardContent className="pb-6 text-sm text-muted-foreground flex items-center gap-1">
            Let's create new one ?

          </CardContent>
        </Card>
      )}


      {listCollection.length !== 0 &&
        listCollection.map((collection, index) => (
          <div key={index} className="group">
            <Card
              className="transition-all duration-200 hover:shadow-md cursor-pointer"
            //   onClick={() => {
            //     navigate('/view?collect_id=' + collection.collectionID)
            //   }}
            >
              <div className="px-6">
                <div className="h-1 w-full rounded bg-accent" />
              </div>
              <CardHeader className="flex">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-sm font-semibold leading-tight text-balance">
                    {collection.title || 'Untitled collection'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/view?collect_id=' + collection.collectionID)
                    }}
                  >
                    <Play className="h-4 w-4" /> Study
                  </Button>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
    </div>
  )
}

export default ListCollection