import { useState, useEffect } from 'react'
import {PokemonCard} from './components/PokemonCard.jsx'
import './App.css'

const API = "https://pokeapi.co/api/v2"

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  console.log("render")


  useEffect(() => {
    async function cargar() {
      setCargando(true)
      setError(null)
      try{
        const res = await fetch(`${API}/pokemon/pikachu`)
        if (!res.ok) throw new Error(`Pokemon no encontrado (${res.status})`)
        const data = await res.json()
        setPokemon(data)
      } catch (err){
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }


    console.log("Effect rendered")
    fetch("https://pokeapi.co/api/v2/pokemon/249")
        .then(res => res.json())
        .then(data => setPokemon(data));
  }, [])
  
  
  return (
    <>
      <h1>Pokedex</h1>
      {cargando && <p>Cargando...</p>}
      {error && <p className='error'>{error}</p>}
      {pokemon && !cargando && !error && (<PokemonCard pokemon={pokemon}/>)}
    </>
  )
}

export default App
