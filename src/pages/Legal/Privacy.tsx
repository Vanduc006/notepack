import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Privacy = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-5'>
      <Card className='max-w-3xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-2xl'>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-sm leading-6 text-muted-foreground'>
          <p>
            NOTEPACK respects your privacy. This policy explains what information we collect, how we use it, and your choices. This page is intended to satisfy platform review requirements for external integrations, including Notion.
          </p>

          <h2 className='text-base font-semibold text-foreground'>Information we collect</h2>
          <ul className='list-disc pl-5 space-y-1'>
            <li>
              Account data: We use Supabase Authentication to sign you in. We receive basic profile data from your identity provider (e.g., Google), such as name, email, and avatar.
            </li>
            <li>
              App data: Collections and flashcards you create inside NOTEPACK are stored in our database and associated with your user ID.
            </li>
            <li>
              Notion data (optional): If you connect your Notion account, we store an access token granted by you to perform the actions you request. We only access the specific pages/blocks you select for import or update.
            </li>
          </ul>

          <h2 className='text-base font-semibold text-foreground'>How we use information</h2>
          <ul className='list-disc pl-5 space-y-1'>
            <li>Provide and improve NOTEPACK features, including creating and reviewing flashcards.</li>
            <li>With your permission, interact with your Notion workspace to read selected page content and insert blocks you explicitly request (e.g., writing flashcards back to a page).</li>
            <li>Maintain account security, prevent abuse, and comply with legal obligations.</li>
          </ul>

          <h2 className='text-base font-semibold text-foreground'>Notion integration specifics</h2>
          <ul className='list-disc pl-5 space-y-1'>
            <li>
              Scope: We request the minimal OAuth scopes required to read page content you choose and insert/update blocks on those pages.
            </li>
            <li>
              Storage: The Notion access token is stored securely and is used only on your behalf to fulfill your requests. You can revoke access at any time from your Notion settings.
            </li>
            <li>
              Data handling: We do not sell or share your Notion data. Content pulled from Notion is used only to generate or sync your study materials.
            </li>
          </ul>

          <h2 className='text-base font-semibold text-foreground'>Data retention and deletion</h2>
          <ul className='list-disc pl-5 space-y-1'>
            <li>You can delete your collections and cards at any time from within the app.</li>
            <li>You can disconnect Notion at any time; this revokes our access token and prevents any future access.</li>
            <li>If you need your account and associated data deleted, contact us at the email below.</li>
          </ul>

          <h2 className='text-base font-semibold text-foreground'>Contact</h2>
          <p>
            For privacy questions or data requests, contact: support@notepack.app
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Privacy