// import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BounceLoader from 'react-spinners/BounceLoader'
import { Flashcard } from './EmbeddCard'
import QueyCard from '@/services/QueyCard'
import supabase from '@/services/ConnectSupbase'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
const ListCard = () => {
    const [searchParams] = useSearchParams()
    const [loading,setLoading] = useState(false)
    const [currentCardList,setCurrentCardList] = useState([])
    const [userID,setUserID] = useState<string>('')
    // const [collectionID,setCollectionID] = useState<string | null>('')
    // const collectionID= searchParams.get('collect_id')
    // console.log(collectionID)
    const [viewMode,setViewMode] = useState<string | null>('')
    useEffect(() => {
        const fetchCard = async () => {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
              setUserID(session.user.id)
            }
            // const uid = session.user.id
            const cid = searchParams.get('collect_id')
            const vm = searchParams.get('vm')
            setViewMode(vm)
            // setUserID(uid)
            // setCollectionID(cid)

            await QueyCard('FETCH','', cid).then(data => {
                // setCurrentCardList(data)
                setCurrentCardList(data || [])
                setLoading(false)
            }) 
        }

        fetchCard()
    }, [searchParams])


    if (loading) {
        return (
        <div className='min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col'>
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-2xl font-bold flex items-center justify-center gap-2'>
              NOTEPACK
              <BounceLoader size={20} className='ml-2' color='#14b8a6'/> 
            </div>
          </div>
        </div>
        )
    }
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-5'>
        {viewMode == 'on_page' && userID &&
            <Link to='/' className='flex gap-2'>
                <Button variant='outline' className='gap-2'>
                  <ArrowLeft className='w-4 h-4'/> Back to home
                </Button>
            </Link> 
        }
        {currentCardList.length !== 0 && 
            <Flashcard cards={currentCardList} />
        }        
    </div>
  )
}

export default ListCard