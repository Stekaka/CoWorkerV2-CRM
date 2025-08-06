'use client'

export default function TestDashboard() {
  console.log('TestDashboard: Component rendered!')
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">TEST DASHBOARD</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test sida</h2>
          <p className="text-gray-600">Om du ser detta meddelande, så laddas dashboard-sidan korrekt!</p>
          <p className="text-gray-600">Problem ligger då i auth-logiken, inte i routing.</p>
        </div>
      </div>
    </div>
  )
}
