import { useEffect, useState} from 'react'
import './index.css'
import { Route, Routes} from 'react-router-dom'
import Privacy from './pages/Legal/Privacy'
import Terms from './pages/Legal/Terms'
import HomeLayout from './pages/Home/HomeLayout'
// import { Auth } from '@supabase/auth-ui-react'
// import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from './services/ConnectSupbase'
import { Navigate , useNavigate} from 'react-router-dom'
import AuthLayout from './pages/Auth/AuthLayout'
import BounceLoader from 'react-spinners/BounceLoader'
import ListCard from './pages/Home/Card.tsx/ListCard'
import CallBack from './pages/Auth/CallBack'
import EditCollection from './pages/Home/Collection/EditCollection'

function ProtectedRoute({ session,children }: {session :any,children: React.ReactNode }) {
  
  if (!session) {
    // return (
    //   <div className='min-h-screen bg-gray-200 flex flex-col'>
    //     <div className='flex-1 flex items-center justify-center bg-gray-200 text-black'>
    //       <img src="/favicon.svg" className="w-8 h-8 rounded-md mr-2"/>
    //       <div className='text-2xl font-bold flex items-center justify-center'>MIND 
    //         <BounceLoader size={20} className='ml-2' color='#4871f7'/> 
    //       </div>
    //     </div>
    //   </div>
    // )
    return <Navigate to="/auth" replace />
  }
  return <>{children}</>
}

function App() {
  const navigate = useNavigate()
  const [session,setSession] = useState<any>(null)
  const [loading,setLoading] = useState(true)
  useEffect(() => {
    // const initSession = async () => {
    //     const { data, error } = await supabase.auth.getSession()
    //     console.log("Initial session:", data.session, error)
    //     setSession(data.session)
    //   }

    // initSession()
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session)
      setSession(session)
      setTimeout(() => {
        setLoading(false)
      }, 1500)
    })

    const {data : {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
        if (event === "SIGNED_IN") {
          const currentPath = window.location.pathname;
          if (currentPath === "/auth") {
            navigate("/"); // chỉ redirect từ /auth
          }
        }
        
        if (event === "SIGNED_OUT") {
          navigate("/auth")
        }
    })

    return () => subscription.unsubscribe()
  },[navigate])

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
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute session={session}>
              <HomeLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit"
          element={
            <ProtectedRoute session={session}>
              <EditCollection />
            </ProtectedRoute>
          }
        />
        

        
        <Route path="/view" element={<ListCard />} />
        <Route path="/auth" element={<AuthLayout />} />
        <Route path="/notion-call-back" element={<CallBack />} />

        {/* Public legal pages for platform review */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>

      {/* <footer className='mt-10 border-t'>
        <div className='max-w-5xl mx-auto px-4 py-6 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center'>
          <div>© {new Date().getFullYear()} NOTEPACK</div>
          <div className='flex items-center gap-4'>
            <Link to="/privacy" className='hover:text-foreground'>Privacy</Link>
            <Link to="/terms" className='hover:text-foreground'>Terms</Link>
          </div>
        </div>
      </footer> */}
    </>
  )
}

export default App
