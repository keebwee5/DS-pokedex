import { normalizar } from '../pokemon'

const API = 'https://pokeapi.co/api/v2'

export async function buscarPokemon(consulta){
  const res = await fetch(`${API}/pokemon/${consulta}`)

  if (!res.ok) {
    throw new Error(`Pokemon no encontrado (${res.status})`)
  }

  const data = await res.json()
  return normalizar(data)
}

export async function listarPokemones(offset, limite) {
  const res = await fetch(
    `${API}/pokemon?limit=${limite}&offset=${offset}`
  )

  if (!res.ok) {
    throw new Error(`Error al cargar la lista (${res.status})`)
  }

  const lista = await res.json()

  const pokemones = await Promise.all(
    lista.results.map((p) => buscarPokemon(p.name))
  )

  return {
    pokemones,
    total: lista.count
  }
}
