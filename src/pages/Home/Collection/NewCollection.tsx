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
import EmbeddCollection from "./EmbeddCollection"
import pageData, { cardAI } from "./testPage"
import Extractor from "../Extractor"

// import { title } from "process"
// import RefreshToken from "@/services/RefreshToken"

export type Card = {
  index: string,
  question: string,
  hint: string,
  answer: string,
  collectionID: string,
  userID: string,
}

type NewCollectionProps = {
  refreshToken: string | null,
  userID: string,
  onUpdateCollection: () => void
}

interface CollectionMetadata {
  title: string
  pageID: string
  pageURL: string
  collectionID: string
  userID: string
  notion_block_id: string | string[] | null
}

const NewCollection = ({ refreshToken, userID, onUpdateCollection }: NewCollectionProps) => {
  const CollectionMetadata = {
    title: '',
    // index : 0,
    pageID: "",
    pageURL: "",
    collectionID: '',
    userID: userID,
    notion_block_id: null,
  }

  const Loading = {
    createNewCollection: false,
    generateCard: false,
  }

  const [openingColletion, setOpeningCollection] = useState(false)
  const [newCardList, setNewCardList] = useState<Card[]>([])
  const [currentCollectionMetadata, setCurrentCollectionMetadata] = useState<CollectionMetadata>(CollectionMetadata)
  const [loadingTask, setLoadingTask] = useState(Loading)
  // const [currentRefreshToken,setCurrentRefreshToken] = useState("")

  const collectionNotion = {
    connect_notion_url: "",
  }
  const [collectionNotionState, setCollectionNotionState] = useState(collectionNotion)
  //   const [currenIndex,setCurrentIndex] = useState<number>(0)
  //   const [currentTile,setCurrentTitle] = useState<string>('')
  //   const [current]



  // const [collectionAIState, setCollectionAIState] = useState(collectionAI);

  const handleClosingCollection = () => {
    setOpeningCollection(!openingColletion)
  }
  const handleOpenningCollection = () => {
    setOpeningCollection(true)
  }

  const handleInputChange = (index?: string, field?: keyof Card, value?: string) => {
    setNewCardList(prev =>
      prev.map(card =>
        card.index === index ? { ...card, [field as string]: value } : card
      )
    )
  }

  const handleRemoveCard = (id: string) => {
    setNewCardList(prev => prev.filter(card => card.index !== id));
  };

  const handleCreate = async (type: string) => {

    setLoadingTask(prev => ({
      ...prev,
      createNewCollection: true
    }))

    if (type == "notion") {
      const pageID = getPageID()
      if (!pageID) {
        alert("Wrong URL or clients error")
        setLoadingTask(prev => ({
          ...prev,
          createNewCollection: false
        }))

        setOpeningCollection(false)
        return
      }
      console.log(newCardList)

      const data = await EmbeddCollection(pageID, currentCollectionMetadata.collectionID, userID)

      const insertData = {
        title: currentCollectionMetadata.title,
        pageID: pageID,
        pageURL: collectionNotionState.connect_notion_url,
        collectionID: currentCollectionMetadata.collectionID,
        userID: userID,
        notion_block_id: data,
      }
      await QueryCollection('INSERT', '', '', insertData).then((data) => {
        if (data == 'OK') {

          newCardList.map(async (card) => {
            // console.log(card)
            await QueyCard('INSERT', 'user', 'collection', 'card', card)
          })

          setLoadingTask(prev => ({
            ...prev,
            createNewCollection: false
          }))

          setOpeningCollection(false)
          onUpdateCollection?.()
        }

      })
    }

    if (type == "normal") {
      const insertData = {
        title: currentCollectionMetadata.title,
        pageID: "",
        pageURL: "",
        collectionID: currentCollectionMetadata.collectionID,
        userID: userID,
        notion_block_id: "",
      }

      await QueryCollection('INSERT', '', '', insertData).then((data) => {
        if (data == 'OK') {

          newCardList.map(async (card) => {
            // console.log(card)
            await QueyCard('INSERT', 'user', 'collection', 'card', card)
          })

          setLoadingTask(prev => ({
            ...prev,
            createNewCollection: false
          }))

          setOpeningCollection(false)
          onUpdateCollection?.()
        }

      })
    }
    setCurrentCollectionMetadata(CollectionMetadata)
    setCollectionNotionState(collectionNotion)
    setNewCardList([])

    // setCurrentCollectionMetadata(prev => ({
    //   ...prev,
    //   pageID : pageID,
    //   pageURL : collectionNotionState.connect_notion_url,
    //   notion_block_id : data,
    // }))


  }

  const getPageID = () => {
    const url = collectionNotionState.connect_notion_url
    const match = url.match(/-([0-9a-f]{32})(?:\?|$)/);
    if (match) {
      return match[1]
    }
    else return
  }

  const fetchAI = async() => {
    const test = pageData.results
    .filter(b => Extractor[b.type])
    .map(b => Extractor[b.type](b));
    console.log(test)
    setNewCardList(cardAI)
  }
  // const handleNotionConnect = async() => {
  //   const data = await RefreshToken(userID)
  //   console.log(data)
  // }

  useEffect(() => {
    setCurrentCollectionMetadata(prev => ({
      ...prev,
      collectionID: crypto.randomUUID(),
    }))
  }, [])

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
              NOTEPACK provides 3 methods for you to choose: normal creating, creating from Notion, or AI integration.
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
                    title: e.target.value,
                  }))
                }} />

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
                        userID: userID,
                        collectionID: currentCollectionMetadata.collectionID,
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
                  {newCardList.map((card, i) => (
                    <div
                      key={card.index}
                      //   className="space-y-2"
                      className="p-3 space-y-2 rounded-lg border bg-gray-50 text-sm sm:text-base"
                    >
                      <div className="flex"
                        onClick={() => handleRemoveCard(card.index)}>
                        <Label>Card {newCardList.length - i}</Label>
                        <div className="ml-auto p-1 bg-red-400 rounded-md flex text-white">

                          <Trash2 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <Textarea
                        value={card.question}
                        onChange={(e) => {
                          handleInputChange(card.index, "question", e.target.value)
                        }}
                        required placeholder="Question here"
                        className="min-h-[40px] max-h-[150px] overflow-y-auto" />
                      <Textarea
                        value={card.answer}
                        onChange={(e) => {
                          handleInputChange(card.index, "answer", e.target.value)
                        }}
                        required placeholder="Answer here"
                        className="min-h-[40px] max-h-[150px] overflow-y-auto" />
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
                    handleCreate("normal")
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Create
                </button>

              </DialogFooter>
            </TabsContent>

            <TabsContent value="notion" className="space-y-2">
              {refreshToken ?
                <div className="space-y-2">
                  <Label>Your Notion page link</Label>
                  <Input
                    value={collectionNotionState.connect_notion_url}
                    onChange={(e) =>
                      setCollectionNotionState(prev => ({
                        ...prev,
                        connect_notion_url: e.target.value
                      }))
                    }
                    placeholder="URL here"></Input>

                  <Label>Title of collection</Label>
                  <Input className="w-full" value={currentCollectionMetadata.title}
                    onChange={(e) => {
                      setCurrentCollectionMetadata(prev => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }} />

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
                            userID: userID,
                            collectionID: currentCollectionMetadata.collectionID,
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
                      {newCardList.map((card, i) => (
                        <div
                          key={card.index}
                          //   className="space-y-2"
                          className="p-3 space-y-2 rounded-lg border bg-gray-50 text-sm sm:text-base"
                        >
                          <div className="flex"
                            onClick={() => handleRemoveCard(card.index)}>
                            <Label>Card {newCardList.length - i}</Label>
                            <div className="ml-auto p-1 bg-red-400 rounded-md flex text-white">

                              <Trash2 className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <Textarea
                            value={card.question}
                            onChange={(e) => {
                              handleInputChange(card.index, "question", e.target.value)
                            }}
                            required placeholder="Question here"
                            className="min-h-[40px] max-h-[150px] overflow-y-auto" />
                          <Textarea
                            value={card.answer}
                            onChange={(e) => {
                              handleInputChange(card.index, "answer", e.target.value)
                            }}
                            required placeholder="Answer here"
                            className="min-h-[40px] max-h-[150px] overflow-y-auto" />
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

                </div> :

                <div>
                  <Label>You must connect to Notion</Label>
                  <p>Go to HOME page, click to your avatar then authorization with Notion</p>


                </div>
              }

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
                    handleCreate("notion")
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Create
                </button>

              </DialogFooter>
            </TabsContent>


            <TabsContent value="ai">
              {refreshToken ?
                <div className="space-y-2">
                  <Label>Your Notion page link</Label>
                  <Input
                    value={collectionNotionState.connect_notion_url}
                    onChange={(e) =>
                      setCollectionNotionState(prev => ({
                        ...prev,
                        connect_notion_url: e.target.value
                      }))
                    }
                    placeholder="URL here"></Input>

                  <Button className="w-full"
                  onClick={() => fetchAI()}
                  >Generate AI card</Button>

                  {currentCollectionMetadata.title !== "" &&
                    <div>
                      <Label>Title of collection</Label>
                      <Input className="w-full" value={currentCollectionMetadata.title}
                        onChange={(e) => {
                          setCurrentCollectionMetadata(prev => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }} />

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
                                userID: userID,
                                collectionID: currentCollectionMetadata.collectionID,
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
                    </div>
                  }


                  {newCardList.length !== 0 && (
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                      {newCardList.map((card, i) => (
                        <div
                          key={card.index}
                          //   className="space-y-2"
                          className="p-3 space-y-2 rounded-lg border bg-gray-50 text-sm sm:text-base"
                        >
                          <div className="flex"
                            onClick={() => handleRemoveCard(card.index)}>
                            <Label>Card {newCardList.length - i}</Label>
                            <div className="ml-auto p-1 bg-red-400 rounded-md flex text-white">

                              <Trash2 className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <Textarea
                            value={card.question}
                            onChange={(e) => {
                              handleInputChange(card.index, "question", e.target.value)
                            }}
                            required placeholder="Question here"
                            className="min-h-[40px] max-h-[150px] overflow-y-auto" />
                          <Textarea
                            value={card.answer}
                            onChange={(e) => {
                              handleInputChange(card.index, "answer", e.target.value)
                            }}
                            required placeholder="Answer here"
                            className="min-h-[40px] max-h-[150px] overflow-y-auto" />
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

                </div> :

                <div>
                  <Label>You must connect to Notion</Label>
                  <p>Go to HOME page, click to your avatar then authorization with Notion</p>


                </div>
              }

              {/* <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
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
                    handleCreate("notion")
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Create
                </button>

              </DialogFooter> */}
            </TabsContent>
          </Tabs>


        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NewCollection
