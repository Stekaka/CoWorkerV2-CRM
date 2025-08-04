import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Mail, Calendar, FileText } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            CoWorker CRM
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Hantera dina leads, kunder och försäljning på ett enkelt och effektivt sätt. 
            Allt du behöver för att växa ditt företag.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/login">Logga in</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Kom igång</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-lg">Lead-hantering</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Organisera och spåra alla dina potentiella kunder på ett ställe
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Mail className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <CardTitle className="text-lg">E-postutskick</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Skicka personliga e-postmeddelanden till dina leads och kunder
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="w-12 h-12 mx-auto text-orange-600 mb-4" />
              <CardTitle className="text-lg">Påminnelser</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Håll koll på viktiga datum och uppföljningar
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <CardTitle className="text-lg">Filhantering</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Ladda upp och organisera dokument kopplade till dina leads
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Redo att komma igång?
          </h2>
          <p className="text-gray-600 mb-6">
            Skapa ditt konto idag och börja hantera dina leads mer effektivt
          </p>
          <Button asChild size="lg">
            <Link href="/register">Starta din kostnadsfria testperiod</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
