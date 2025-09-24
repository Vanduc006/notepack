// import React from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import supabase from "@/services/ConnectSupbase"
import QueryCollection from "@/services/QueryCollection"
import QueyCard from "@/services/QueyCard"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
// import BounceLoader from "react-spinners/BounceLoader"
import { type Card } from "./NewCollection"
import { SquarePlus, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
// import { Dialog, DialogContent } from "@radix-ui/react-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog"

const EditCollection = () => {
    const editCollectionMetadata = {
        collectionID: "",
        loading_edit: false,
        edit_diaglog: false,
        loading_disconnect: false,
        reconnect: "",
        reset: false,
        // edit_collection_title : "",
        // edit_collection_notion : "",
        // edit_collection_block : "",
        // edit_collection_page_id : "",
    }
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [Collection, setCollection] = useState({
        collectionID: "",
        created_at: "",
        pageID: "",
        userID: "",
        title: "",
        pageURL: "",
        notion_block_id: "",
    })
    const [listCard, setListCard] = useState<Card[]>([])
    const [listDeletedCard, setListDeleteCard] = useState<Card[]>([])
    const [listNewCard, setListNewCard] = useState<Card[]>([])

    const [collectionID, setCollectionID] = useState<string>("")
    const [userID, setUserID] = useState<string>("")
    // const [loading, setLoading] = useState(false)
    const [editCollectionState, setEditCollectionState] = useState(editCollectionMetadata)

    const handleClosingDialog = (key: keyof typeof editCollectionMetadata) =>
        (open: boolean) => {
            setEditCollectionState(prev => (
                {
                    ...prev,
                    [key]: open,
                }
            ))
        }

    const handleOpeningDialog = (item: keyof typeof editCollectionMetadata) => {
        setEditCollectionState(prev => ({
            ...prev,
            [item]: true,
            // current_selected_collection_id: collectionID,
            // current_selected_collection_title: collectionTitle,
        }))
    }

    const handleInputChange = (index?: string, field?: keyof Card, value?: string) => {
        setListCard(prev =>
            prev.map(card =>
                card.index === index ? { ...card, [field as string]: value } : card
            )
        )
        // console.log(value)
    }

    const handleRemoveCard = (cardID: string, collectionID: string, userID: string) => {
        setListCard(prev => prev.filter(card => card.index !== cardID));
        // console.log(id)
        setListDeleteCard(prev => [
            {
                "index": cardID,
                "collectionID": collectionID,
                "userID": userID,
            } as Card
            , ...prev
        ])
    };

    const handleRemoveListNewCard = (id: string) => {
        setListNewCard(prev => prev.filter(card => card.index !== id));
    };

    const handleInputChangeNewCard = (index?: string, field?: keyof Card, value?: string) => {
        setListNewCard(prev =>
            prev.map(card =>
                card.index === index ? { ...card, [field as string]: value } : card
            )
        )
        // console.log(value)
    }

    const handleSaveChange = async () => {
        console.log(listDeletedCard)
        console.log(listNewCard)

        listCard.map((card) => {
            console.log(card)
        })

        await QueryCollection("UPDATE",collectionID,userID,Collection);

        if (listDeletedCard.length !== 0) {
            listDeletedCard.map(async (card) => {
                await QueyCard("DELETE", card.userID, card.collectionID, card.index, {

                })
            })
        }

        //   index: string,
        //   question: string,
        //   hint: string,
        //   answer: string,
        //   collectionID: string,
        //   userID: string,

        listCard.map(async (card) => { // should be chaneg to update only field change
            await QueyCard("UPDATE", card.userID, card.collectionID, card.index, {
                "question": card.question,
                "hint": card.hint,
                "answer": card.answer,
                // "page"
            })
        })

        if (listNewCard.length !== 0) {
            listNewCard.map(async (card) => {
                await QueyCard("INSERT", card.userID, card.collectionID, card.index, {
                    "index": card.index,
                    "userID": card.userID,
                    "collectionID": card.collectionID,
                    "question": card.question,
                    "hint": card.hint,
                    "answer": card.answer,
                })
            })
        }

        // navigate('/')


    }

    const handleDisconnect = () => {
        setCollection(prev => ({
            ...prev,
            "pageURL": "",
            "pageID": "",
            "notion_block_id": "",
        }))
    }

    const fetchData = useCallback(async () => {
        // setLoading(true)
        // console.log("ok")
        const collectionID = searchParams.get('collect_id')
        if (collectionID) {
            setCollectionID(collectionID)
        }
        // getUserID()
        const getCollection = async () => {

            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setUserID(session.user.id)
                // return session.user.id
            }

            await QueryCollection("FETCHTOEDIT", collectionID, session?.user.id, {}).then(data => {
                // console.log(data)
                setCollection(data)
            })
            await QueyCard("FETCH", session?.user.id, collectionID, "", {}).then((data) => {
                setListCard(data)
            })
            // setLoading(false)
        }
        getCollection()
    }, [searchParams])

    useEffect(() => {
        fetchData()
        // console.log(Collection)
        // const collectionID

    }, [fetchData])

    // if (loading) {
    //     return (
    //         <div className='min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col'>
    //             <div className='flex-1 flex items-center justify-center'>
    //                 <div className='text-2xl font-bold flex items-center justify-center gap-2'>
    //                     NOTEPACK
    //                     <BounceLoader size={20} className='ml-2' color='#14b8a6' />
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }
    return (
        <div className="min-h-screen bg-secondary p-5">
            <div className="flex gap-2 mb-5">
                <Button
                    onClick={() => navigate('/')}
                    className="bg-gray-400 hover:bg-gray-500">Back to homepage</Button>

                <Button
                    onClick={() => handleSaveChange()}
                >Save</Button>
                <Button
                    onClick={() => handleOpeningDialog("reset")}
                >Reset</Button>

                <Dialog open={editCollectionState.reset} onOpenChange={() => handleClosingDialog("reset")}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure to reset evrey thing ?</DialogTitle>
                            <DialogDescription>Which means this collection and cards are rollback</DialogDescription>
                        </DialogHeader>
                        <Button
                            onClick={() => {
                                // setLoading(true)
                                setCollection({
                                    collectionID: "",
                                    created_at: "",
                                    pageID: "",
                                    userID: "",
                                    title: "",
                                    pageURL: "",
                                    notion_block_id: "",
                                })
                                setListCard([])
                                setListNewCard([])
                                setListDeleteCard([])
                                fetchData()
                                setEditCollectionState(prev => ({
                                    ...prev,
                                    "reset": false,
                                }))
                            }}
                            variant="destructive">
                            Yes, do it's
                        </Button>
                        <Button
                            onClick={() => setEditCollectionState(prev => ({
                                ...prev,
                                "reset": false,
                            }))}>
                            Cancel
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

            {Collection.collectionID !== "" &&
                <div className='mb-6 rounded-xl border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50'>
                    <div className='flex items-center gap-3 p-4'>
                        <div className='items-center gap-2 space-y-2 w-full'>

                            {/* <div className='text-2xl font-extrabold tracking-tight'>NOTEPACK</div> */}
                            {/* <div>Collection name : {Collection.title} </div> */}

                            <Label>Collection name</Label>
                            <div className="flex gap-2">
                                <Input className="w-full" value={Collection.title}></Input>
                            </div>

                            {Collection.pageURL !== "" ?
                                <div className="space-y-2">
                                    <Label>Connected page</Label>
                                    <div className="flex gap-2">
                                        <Input className="w-full" value={Collection.pageURL}></Input>
                                        <Button
                                            onClick={() => handleDisconnect()}
                                        >Disconnect</Button>
                                    </div>
                                </div>
                                :
                                <div className="mt-2">
                                    {/* <Button></Button> */}
                                    <Label>This connection not connected with Notion</Label>
                                    {/* <Dialog>

                                    </Dialog> */}
                                </div>
                            }

                        </div>
                    </div>

                </div>
            }


            {listCard.length !== 0 &&
                <div className="space-y-2">
                    {listCard.map((card, i) => {
                        return (
                            <div
                                key={card.index}
                                //   className="space-y-2"
                                className="space-y-2 p-3 rounded-lg border bg-gray-50 text-sm sm:text-base"
                            >
                                <div className="flex">
                                    <Label>Card {i + 1}</Label>
                                    <div
                                        onClick={() => handleRemoveCard(card.index, collectionID, userID)}

                                        className="ml-auto p-1 bg-red-400 rounded-md flex text-white">
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

                        )
                    })}
                </div>
            }

            {
                listNewCard.length !== 0 &&
                <div className="mt-2 space-y-2">
                    {listNewCard.map((card, i) => {
                        return (
                            <div key={card.index}
                                className="space-y-2 p-3 rounded-lg border bg-gray-50 text-sm sm:text-base"
                            >
                                <div className="flex">
                                    {/* {card.index} */}
                                    <Label className="flex">Card {listCard.length + 1 + i}
                                        <div className="bg-primary font-medium text-white px-2 py-1 rounded-lg">New</div>
                                    </Label>

                                    <div
                                        onClick={() => handleRemoveListNewCard(card.index)}
                                        className="ml-auto p-1 bg-red-400 rounded-md flex text-white">
                                        <Trash2 className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                <Textarea
                                    value={card.question}
                                    onChange={(e) => {
                                        handleInputChangeNewCard(card.index, "question", e.target.value)
                                    }}
                                    required placeholder="Question here"
                                    className="min-h-[40px] max-h-[150px] overflow-y-auto" />
                                <Textarea
                                    value={card.answer}
                                    onChange={(e) => {
                                        handleInputChangeNewCard(card.index, "answer", e.target.value)
                                    }}
                                    required placeholder="Answer here"
                                    className="min-h-[40px] max-h-[150px] overflow-y-auto" />
                                {/* <Input required placeholder="Question here"></Input>
                        <Input required placeholder="Answer here"></Input> */}
                                <Input
                                    value={card.hint}
                                    onChange={(e) => {
                                        handleInputChangeNewCard(card.index, "hint", e.target.value)
                                    }}
                                    placeholder="Hint (optional)">

                                </Input>
                            </div>
                        )
                    })}
                </div>
            }


            {listCard.length !== 0 &&

                <div
                    onClick={() => {
                        setListNewCard(prev => [
                            {
                                index: crypto.randomUUID(),
                                question: "",
                                hint: "",
                                answer: "",
                                userID: userID ?? "",                // đảm bảo string
                                collectionID: collectionID, // ép về string
                            } as Card,
                            ...prev,
                        ])
                    }}
                    className="cursor-pointer mt-2 p-3 rounded-lg border bg-gray-50 text-sm sm:text-base w-full flex items-center justify-content-center">
                    <div className="font-medium text-sm mx-auto flex items-center gap-1">
                        Add more cards
                        <SquarePlus className="w-4 h-4" />
                    </div>
                </div>
            }

        </div>
    )
}

export default EditCollection