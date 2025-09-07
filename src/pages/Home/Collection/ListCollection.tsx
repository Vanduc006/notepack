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
import { Star } from "lucide-react"
import { useNavigate } from 'react-router-dom'

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

    const [listCollection,setListCollection] = useState<any[]>([])
    const navigate = useNavigate()
    useEffect(() => {
        const getList = async() => {
            await QueryCollection('FETCH',userID).then((data) => {
                if (data) {
                    setListCollection([...data,]) // merge sample + fetched
                }
            })
        }
        getList()
    },[userID,refreshList])

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {listCollection.length !== 0 &&
            listCollection.map((collection,index) => (
            <div
                key={index}
                className="hover:scale-[1.02] cursor-pointer"
            >
            
                <Card onClick={() => {
                    navigate('/view?collect_id='+collection.collectionID)
                }}>
                    <CardHeader className="flex">
                        <CardTitle className="text-sm font-medium text-balance leading-tight">{collection.title}</CardTitle>
                        {/* <CardDescription>Card Description</CardDescription> */}
                        {/* <CardAction>Card Action</CardAction> */}
                        <Button
                            variant='ghost'
                            size='sm'
                            className="p-1 h-auto ml-auto"
                        >
                            <Star className="h-4 w-4 text-muted-foreground"/>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <p>5 Cards</p>
                    </CardContent>
                </Card>
                {/* {collection.title} */}
            </div>
            ))
        }
        
    </div>
  )
}

export default ListCollection