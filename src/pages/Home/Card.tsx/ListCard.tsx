// import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BounceLoader from 'react-spinners/BounceLoader'
import { Flashcard } from './EmbeddCard'
import QueyCard from '@/services/QueyCard'
import supabase from '@/services/ConnectSupbase'
import { Button } from '@/components/ui/button'
const ListCard = () => {
    const [searchParams] = useSearchParams()
    const [loading,setLoading] = useState(false)
    const [currentCardList,setCurrentCardList] = useState([])
    // const [userID,setUserID] = useState<string>('')
    // const [collectionID,setCollectionID] = useState<string | null>('')
    // const collectionID= searchParams.get('collect_id')
    // console.log(collectionID)
    const [viewMode,setViewMode] = useState<string | null>('')
    useEffect(() => {
        const fetchCard = async () => {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.user) return
            const uid = session.user.id
            const cid = searchParams.get('collect_id')
            const vm = searchParams.get('vm')
            setViewMode(vm)
            // setUserID(uid)
            // setCollectionID(cid)

            await QueyCard('FETCH', uid, cid).then(data => {
                // setCurrentCardList(data)
                setCurrentCardList(data || [])
                setLoading(false)
            }) 
        }

        fetchCard()
    }, [searchParams])


    if (loading) {
        return (
        <div className='min-h-screen bg-black flex flex-col'>
        <div className='flex-1 flex items-center justify-center bg-gray-200 text-black'>
          {/* <img src="/favicon.svg" className="w-8 h-8 rounded-md mr-2"/> */}
          <div className='text-2xl font-bold flex items-center justify-center'>
            NOTEPACK
            <BounceLoader size={20} className='ml-2' color='#4871f7'/> 
          </div>
        </div>
      </div>
        )
    }
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-5'>
        {viewMode !== 'embed' && 
            <Link to='/' className='flex gap-2'>
                <Button>Turn back</Button>
            </Link> 
        }
        {currentCardList.length !== 0 && 
            <Flashcard cards={currentCardList} />
        }        
    </div>
  )
}

export default ListCard