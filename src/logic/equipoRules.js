

export function puedeAgregar(equipo, pokemon){
  if (equipo.length >= 6) return false
  if (equipo.some((e) => e.id === pokemon.id)) return false
  return true
}

