'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function SimpleAuthTest() {
  const [email, setEmail] = useState('admin@test.se')
  const [password, setPassword] = useState('password123')
  const [result, setResult] = useState('')

  const testRegister = async () => {
    setResult('Registrerar...')
    const supabase = createClient()
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) {
      setResult(`Register fel: ${error.message}`)
    } else {
      setResult('✅ Registrering lyckades!')
    }
  }

  const testLogin = async () => {
    setResult('Loggar in...')
    const supabase = createClient()
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      setResult(`Login fel: ${error.message}`)
    } else {
      setResult('✅ Inloggning lyckades!')
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Enkel Auth Test</h1>
      
      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Lösenord"
          className="w-full p-2 border rounded"
        />
        
        <div className="space-x-2">
          <button 
            onClick={testRegister}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Registrera
          </button>
          
          <button 
            onClick={testLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Logga in
          </button>
        </div>
        
        {result && (
          <div className="p-4 bg-gray-100 rounded">
            {result}
          </div>
        )}
      </div>
    </div>
  )
}
