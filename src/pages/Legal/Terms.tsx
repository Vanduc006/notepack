import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Terms = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-5'>
      <Card className='max-w-3xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-2xl'>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-sm leading-6 text-muted-foreground'>
          <p>
            These Terms govern your use of NOTEPACK. By using the app, you agree to these Terms. This page includes details relevant to platform reviews for external integrations (e.g., Notion).
          </p>

          <h2 className='text-base font-semibold text-foreground'>Use of the Service</h2>
          <ul className='list-disc pl-5 space-y-1'>
            <li>You must be at least 13 years old to use NOTEPACK.</li>
            <li>You are responsible for the content you create, upload, or sync.</li>
            <li>Do not use the service to violate applicable laws or third-party rights.</li>
          </ul>

          <h2 className='text-base font-semibold text-foreground'>Notion integration</h2>
          <ul className='list-disc pl-5 space-y-1'>
            <li>
              Authorization: If you connect your Notion account, you authorize NOTEPACK to access selected pages and insert blocks as needed to provide requested features.
            </li>
            <li>
              Scope and revocation: We request minimal scopes and you may revoke access any time in Notion.
            </li>
            <li>
              Responsibility: You must ensure you have the right to import, modify, or write content to the Notion pages you select.
            </li>
          </ul>

          <h2 className='text-base font-semibold text-foreground'>Content and Intellectual Property</h2>
          <ul className='list-disc pl-5 space-y-1'>
            <li>You retain ownership of the content you create in NOTEPACK.</li>
            <li>You grant NOTEPACK the limited rights necessary to operate the service (e.g., storage and processing of your content).</li>
          </ul>

          <h2 className='text-base font-semibold text-foreground'>Disclaimer</h2>
          <p>
            The service is provided “as is” without warranties of any kind. NOTEPACK does not guarantee accuracy, reliability, or availability.
          </p>

          <h2 className='text-base font-semibold text-foreground'>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, NOTEPACK will not be liable for any indirect, incidental, or consequential damages arising from your use of the service.
          </p>

          <h2 className='text-base font-semibold text-foreground'>Termination</h2>
          <p>
            You may stop using NOTEPACK at any time. We may suspend or terminate access if you violate these Terms or abuse the service.
          </p>

          <h2 className='text-base font-semibold text-foreground'>Changes</h2>
          <p>
            We may update these Terms from time to time. Material changes will be announced in-app or via the website.
          </p>

          <h2 className='text-base font-semibold text-foreground'>Contact</h2>
          <p>
            For questions about these Terms, contact: support@notepack.app
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Terms