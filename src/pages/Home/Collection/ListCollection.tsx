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
import { Play, Edit, Trash2, Calendar, Hash, ArrowRight, Link2 } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import BounceLoader from 'react-spinners/BounceLoader'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import EmbeddCollection from "./EmbeddCollection"


type ListCollectionProps = {
  userID: string,
  refreshList?: boolean,
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

const ListCollection = ({ userID, refreshList }: ListCollectionProps) => {

  const [loading, setLoading] = useState(false)
  const [listCollection, setListCollection] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    const getList = async () => {
      await QueryCollection('FETCH','',userID).then((data) => {
        if (data) {
          setListCollection([...data,]) // merge sample + fetched
          setLoading(false)
        }
      })
    }
    getList()
  }, [userID, refreshList])


  const collectionDialog = {
    current_selected_collection_id : "",
    current_selected_collection_title : "",
    embed : false,
    delete : false,
    edit : false,
    emebed_notion_page_url : "",
  }
  const [collectionDialogState,setCollectionDialogState] = useState(collectionDialog)

  const handleClosingDialog = (key: keyof typeof collectionDialog) =>
  (open: boolean) => {
    setCollectionDialogState(prev => ({
      ...prev,
      [key]: open,
    }))
  }

  const handleOpeningDialog = (collectionTitle : string ,collectionID : string, item : keyof typeof collectionDialog) => {
    setCollectionDialogState(prev => ({
        ...prev,
        [item]: true,
        current_selected_collection_id : collectionID,
        current_selected_collection_title : collectionTitle,
    }))
  }

  const getPageID = () => {
    const url = collectionDialogState.emebed_notion_page_url
    const match = url.match(/-([0-9a-f]{32})(?:\?|$)/);
    if (match) {
        return match[1]
    }
    else return
  }
 
  const updateClientsCollection = (pageID : string,notion_block_id : any[]) => {
    setListCollection(prev => (
      prev.map(collection => 
        collection.collectionID === collectionDialogState.current_selected_collection_id ? 
        {...collection, 
          pageID : pageID, 
          pageURL : collectionDialogState.emebed_notion_page_url,
          notion_block_id : notion_block_id,
         } : collection,
      )
    ))
  }

  const handleEmbed = async() => {
    const pageID = getPageID()
    if (!pageID) {
      alert("Wrong URL or clients error")
      return
    }
    console.log(pageID)

    const data = await EmbeddCollection(pageID,collectionDialogState.current_selected_collection_id,userID)
    await QueryCollection('UPDATE',collectionDialogState.current_selected_collection_id,userID,{
      pageID : pageID,
      pageURL : collectionDialogState.emebed_notion_page_url,
      notion_block_id : data,
    })

    updateClientsCollection(pageID,data)
  }



  // const handleEdit = async(payload : any) => {
  //   await QueryCollection('UPDATE',userID,payload).then(data => {
  //     if (data == 'OK') {

  //     }
  //   })
  // }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {loading && (
        <Card className="col-span-full">
          <CardHeader className="flex">
            <CardTitle className="text-base">Delivering your pack</CardTitle>
          </CardHeader>
          <CardContent className="pb-6 text-sm text-muted-foreground flex items-center gap-1">
            It's take few seconds for preparing
            <BounceLoader size={10} className='ml-2' color='#4871f7' />

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
        listCollection.map((collection, index) =>
          <div className="group relative" key={index}>
            <div className="absolute inset-0 bg-white border border-border rounded-lg transform translate-x-1 translate-y-1 opacity-60"></div>
            <div className="absolute inset-0 bg-white border border-border rounded-lg transform translate-x-0.5 translate-y-0.5 opacity-80"></div>

            <div className="relative bg-white border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 p-6 min-h-[200px] flex flex-col">
              <div className="flex-1 space-y-4">
                <div className="space-y-2 flex items-center">
                  <h3 className="font-semibold text-lg text-foreground text-balance oveflow-x-auto">
                    {collection.title}
                  </h3>

                  {collection.notion_block_id &&
                  <a
                  
                  href={collection.pageURL} 
                  target="_blank"
                  // onClick={() => window.location.href(collection.pageURL as String)}
                  className="ml-2 p-1 bg-secondary rounded-md flex items-center text-xs gap-1  ">
                    <Link2 className="w-4 h-4"/>
                  </a>
                  }


                  <div className="flex items-center ml-auto gap-1">
                    <div className="p-1 bg-green-500 rounded-md">
                      
                      <Edit className="w-4 h-4 text-white" />
                    </div>

                    <div className="p-1 bg-red-500 rounded-md">
                      <Trash2 className="w-4 h-4 text-white" />
                    </div>

                  </div>
                </div>

                <div className="h-px bg-border"></div>


                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{collection.created_at}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    <span className="font-mono text-xs">{collection.collectionID.slice(0, 8)}</span>
                  </div>
                </div>
              </div>

              <div className="sm:flex block items-center">
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/view?vm=on_page&collect_id=${collection.collectionID}`)
                    }}
                  >
                    <Play className="h-4 w-4" /> Study
                  </Button>

                </div>

                <div className="mt-3 flex items-center gap-2 sm:ml-auto m-0">
                  {!collection.notion_block_id &&
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleOpeningDialog(collection.title,collection.collectionID,"embed")}
                  >
                    Add to Notion Page
                  </Button>
                  }

                </div>
              </div>

            </div>
          </div>
        )
      }

      {/* dialog */}
      <Dialog open={collectionDialogState.embed} onOpenChange={handleClosingDialog("embed")}>
        <DialogContent 
          className="[&>button[data-radix-dialog-close]]:hidden w-full max-w-[95vw] sm:max-w-lg"
        > 
          <DialogHeader className="items-center">
            {/* {collectionDialogState.current_selected_collection} */}
            <DialogTitle className="flex gap-1">
              Add 
              <div className="text-blue-500 font-bold ">
                {collectionDialogState.current_selected_collection_title}
              </div>
              collection to your Notion Page</DialogTitle>
            <DialogDescription className="flex gap-1 items-center justify-content-center"> 
              Go to Notion page <ArrowRight className="w-4 h-4"/> Copy page link !
            </DialogDescription>
          </DialogHeader>

          <Label>Paste your Notion Page link</Label>
            <Input placeholder="Eg. https://www.notion.so/dunv2808/Student-Dashboard-2307e2da03a18073bbfbca2523355643?source=copy_link" value={collectionDialogState.emebed_notion_page_url} 
            onChange={(e) => setCollectionDialogState(prev => ({
              ...prev,
              emebed_notion_page_url : e.target.value,
            }))}>

            </Input>
          <Button 
          onClick={() => handleEmbed()}
          >Deliver</Button>


          <DialogFooter className="flex flex-col sm:flex-row gap-2">


          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* 
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
                      navigate(`/view?vm=on_page&collect_id=${collection.collectionID}`)
                    }}
                  >
                    <Play className="h-4 w-4" /> Study
                  </Button>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        ))} */}


    </div>
  )
}

export default ListCollection