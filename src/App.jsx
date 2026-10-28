import { useState, useEffect } from 'react'
import { PokemonCard } from './components/PokemonCard'
import { puedeAgregar } from './logic/equipoRules'
import { guardarPokemon, cargarEquipo } from './data/equipoStore'
import { buscarPokemon, listarPokemones } from './data/pokemonApi'

import './App.css'

const LIMITE = 25 // pokemones por página

function App() {
  const [pokemones, setPokemones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [equipo, setEquipo] = useState([])
  const [errorEquipo, setErrorEquipo] = useState(null)
  
  const [offset, setOffset] = useState(0)   // desde qué pokemon empieza la página
  const [total, setTotal] = useState(0)     // cuántos pokemones hay en la API

  const [texto, setTexto] = useState('')        // lo que se escribe
  const [consulta, setConsulta] = useState('')  // lo que se busca ('' = ver la lista)

  async function agregar(p){
    if (!puedeAgregar(equipo, p)) return 

    try {
      setErrorEquipo(null)
      await guardarPokemon(p)
      setEquipo([...equipo, p])
    } catch (err) {
      setErrorEquipo(`No se pudo guardar en el equipo: ${err.message}`)
    }
  }

  function buscar(e) {
    e.preventDefault()
    setConsulta(texto.trim().toLowerCase())
  }

  function verTodos() {
    setTexto('')
    setConsulta('')
  }

  useEffect(() => {
    let cancelado = false // evita mostrar una respuesta vieja si cambias de página rápido

    async function cargar() {
      setCargando(true)
      setError(null)
      try {
        if (consulta) {
          const pokemon = await buscarPokemon(consulta)
          if (!cancelado) setPokemones([pokemon])
        } else {
          // 1. La lista solo trae { name, url } de cada pokemon
          const resultado = await listarPokemones(offset, LIMITE)                

          if (!cancelado) {
            setTotal(resultado.total)
            setPokemones(resultado.pokemones)
          }
        }
      } catch (err) {
        if (!cancelado) setError(err.message)
      } finally {
        if (!cancelado) setCargando(false)
      }
    }
    cargar()

    return () => { cancelado = true }
  }, [offset, consulta])

  useEffect(() => {
    cargarEquipo()
    .then((pokemones) => setEquipo(pokemones))
    .catch((e) => setErrorEquipo(`No se pudo cargar el equipo: ${e.message}`))
  }, [])

  const desde = offset + 1
  const hasta = Math.min(offset + LIMITE, total)

  return (
    <main>
      <h1>Pokédex</h1>
      <form onSubmit={buscar}>
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Nombre o número"
        />
        <button type="submit">Buscar</button>
        {consulta && <button type="button" onClick={verTodos}>Ver todos</button>}
      </form>

      {!consulta && (
        <div className="navegacion">
          <button
            disabled={cargando || offset === 0}
            onClick={() => setOffset(offset - LIMITE)}
          >
            Anterior
          </button>
          <span>{total > 0 && `${desde}–${hasta} de ${total}`}</span>
          <button
            disabled={cargando || offset + LIMITE >= total}
            onClick={() => setOffset(offset + LIMITE)}
          >
            Siguiente
          </button>
        </div>
      )}

      <h2>Mi equipo ({equipo.length} / 6)</h2>
      {errorEquipo && <p className='error'>{errorEquipo}</p>}
      <section className='equipo'>
        {equipo.map((p) => <PokemonCard key={p.id} pokemon={p} />)}
      </section>


      {cargando && <p>Cargando...</p>}
      {error && <p className='error'>{error}</p>}
      {!cargando && !error && (
        <section className="grid">
          {pokemones.map(p => <PokemonCard key={p.id} pokemon={p} onAgregar={agregar} />)}
        </section>
      )}
    </main>
  )
}

export default App
