import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [resources, setResources] = useState<string[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadResources() {
      const { data, error } = await supabase
        .from('resources')
        .select('name')

      if (error) {
        setError(error.message)
        return
      }

      setResources(data.map((resource) => resource.name))
    }

    loadResources()
  }, [])

  return (
    <div>
      <h1>Riverside Community Hub</h1>

      {error && <p>{error}</p>}

      <ul>
        {resources.map((resource) => (
          <li key={resource}>{resource}</li>
        ))}
      </ul>
    </div>
  )
}

export default App