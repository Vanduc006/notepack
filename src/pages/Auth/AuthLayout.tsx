import supabase from '@/services/ConnectSupbase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const AuthLayout = () => {
    const signUpGoogle = async() => {
        await supabase.auth.signInWithOAuth({
            provider : 'google'
        })
    }

    const signUpNotion = async() => {
        await supabase.auth.signInWithOAuth({
            provider : 'notion'
        })
    }
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-6'>
        <Card className='w-full max-w-md p-6 border-border/60'>
            <div className='flex items-center gap-3 mb-4 justify-center'>
                <img src='/vite.svg' className='w-8 h-8 rounded-md'/>
                <div className='text-2xl font-semibold tracking-tight'>NOTEPACK</div>
            </div>
            <p className='text-sm text-muted-foreground text-center mb-6'>Sign in to start packing your knowledge.</p>
            <Button className='w-full' variant='default' onClick={signUpGoogle}>
                Continue with Google
            </Button>

            <Button className='w-full' variant='default' onClick={signUpNotion}>
                Continue with Notion
            </Button>
        </Card>
    </div>
  )
}

export default AuthLayout