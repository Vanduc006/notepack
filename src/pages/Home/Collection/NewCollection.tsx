// import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"     
import { Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import QueryCollection from "@/services/QueryCollection"
import QueyCard from "@/services/QueyCard"

type Card = {
  index : string,
  question : string,
  hint : string,
  answer : string,
  collectionID : string,
  userID : string,
}

type NewCollectionProps = {
    userID : string,
    onUpdateCollection : () => void
}

const NewCollection = ({userID, onUpdateCollection} : NewCollectionProps) => {
  const CollectionMetadata = {
    title : '',
    // index : 0,
    pageID : null,
    pageURL : null,
    collectionID : '',
    userID : userID,
  }

  const Loading = {
    createNewCollection : false,

  }

  const [openingColletion,setOpeningCollection] = useState(false)
  const [newCardList,setNewCardList] = useState<Card[]>([])
  const [currentCollectionMetadata,setCurrentCollectionMetadata] = useState(CollectionMetadata)
  const [loadingTask,setLoadingTask] = useState(Loading)
//   const [currenIndex,setCurrentIndex] = useState<number>(0)
//   const [currentTile,setCurrentTitle] = useState<string>('')
//   const [current]


  const handleClosingCollection = () => {
    setOpeningCollection(!openingColletion)
  }
  const handleOpenningCollection = () => {
    setOpeningCollection(true)
  }

  const handleInputChange = (index ?: string, field ?: keyof Card, value ?: string) => {
    setNewCardList(prev => 
        prev.map(card => 
            card.index === index ? {...card, [field as string] : value} : card
        )
    )
  }
  const handleRemoveCard = (id: string) => {
    setNewCardList(prev => prev.filter(card => card.index !== id));
    };

    const handleCreate = async() => {
        console.log(newCardList)

        setLoadingTask(prev => ({
            ...prev,
            createNewCollection : true
        }))
        await QueryCollection('INSERT','',currentCollectionMetadata).then((data) => {
            if (data == 'OK') {

                newCardList.map(async(card) => {
                  // console.log(card)
                  await QueyCard('INSERT','user','collection','card',card)
                })

                setLoadingTask(prev => ({
                    ...prev,
                    createNewCollection : false
                }))

                setOpeningCollection(false)
                onUpdateCollection?.()
            }
            
        })



        
    }

    useEffect(() => {
      setCurrentCollectionMetadata(prev => ({
          ...prev,
          collectionID : crypto.randomUUID(),
      }))
    },[])

  return (
    <div>

      <Button
        className=""
        onClick={handleOpenningCollection}
      >
        Create new
      </Button>

      <Dialog open={openingColletion} onOpenChange={handleClosingCollection}>
        <DialogContent 
          className="[&>button[data-radix-dialog-close]]:hidden w-full max-w-[95vw] sm:max-w-lg"
        >
          <DialogHeader>
            <DialogTitle>Creating your new flashcard collection</DialogTitle>
            <DialogDescription>
              NOTEPACK provide 3 methods for you choose : Normal creating, Creating and connecting Notion, AI intergartion
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="normal" className="w-full">
            <TabsList className="w-full flex overflow-x-auto sm:justify-start">
              <TabsTrigger value="normal" className="flex-1 sm:flex-none">Normal</TabsTrigger>
              <TabsTrigger value="notion" className="flex-1 sm:flex-none">Notion</TabsTrigger>
              <TabsTrigger value="ai" className="flex-1 sm:flex-none">AI</TabsTrigger>
            </TabsList>

            <TabsContent value="normal" className="space-y-2 w-full rounded-ld">
              <Label>Title of collection</Label>
              <Input className="w-full" value={currentCollectionMetadata.title} 
              onChange={(e) => {
                setCurrentCollectionMetadata(prev => ({
                    ...prev,
                    title : e.target.value,
                }))
              }}/>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    // const newCard: Card = {
                    //   index: currentCollectionMetadata.index,
                    //   question: "",
                    //   hint: "",
                    //   answer: "",
                    // }

                    setNewCardList(prev => [
                        {
                          index: crypto.randomUUID(),
                          question: "",
                          hint: "",
                          answer: "",
                          userID : userID,
                          collectionID : currentCollectionMetadata.collectionID,
                        },
                        ...prev,

                    ])
                    // setCurrentCollectionMetadata((prev) => ({
                    //     ...prev,
                    //     index : currentCollectionMetadata.index + 1,
                    // }))
                  }}
                >
                  Add card
                </Button>
              </div>

              {newCardList.length !== 0 && (
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {newCardList.map((card,i) => (
                    <div 
                      key={card.index} 
                    //   className="space-y-2"
                      className="p-3 space-y-2 rounded-lg border bg-gray-50 text-sm sm:text-base"
                    >
                        <div className="flex"
                        onClick={() => handleRemoveCard(card.index)}>
                            <Label>Card {newCardList.length - i}</Label>
                            <div className="ml-auto p-1 bg-red-400 rounded-md flex text-white">

                                <Trash2 className="w-4 h-4 text-white"/>
                            </div>
                        </div>
                        <Textarea
                            value={card.question}
                            onChange={(e) => {
                                handleInputChange(card.index, "question", e.target.value)
                            }}
                            required placeholder="Question here" 
                            className="min-h-[40px] max-h-[150px] overflow-y-auto"/>
                        <Textarea 
                            value={card.answer}
                            onChange={(e) => {
                                handleInputChange(card.index,"answer", e.target.value)
                            }}
                            required placeholder="Answer here" 
                            className="min-h-[40px] max-h-[150px] overflow-y-auto"/>
                        {/* <Input required placeholder="Question here"></Input>
                        <Input required placeholder="Answer here"></Input> */}
                        <Input 
                        value={card.hint}
                        onChange={(e) => {
                            handleInputChange(card.index, "hint", e.target.value)
                        }}
                        placeholder="Hint (optional)"></Input>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="notion">
              Notion integration form here
            </TabsContent>
            <TabsContent value="ai">
              AI integration form here
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setOpeningCollection(false)}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
                disabled={loadingTask.createNewCollection}
              onClick={() => {
                // console.log(newCardList)
                handleCreate()
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Create
            </button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NewCollection
