import { collection, doc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../firebase"

export async function guardarPokemon(pokemon){
  await setDoc(doc(db, 'equipo', String(pokemon.id)), pokemon)
}

export async function cargarEquipo(){
  const snap = await getDocs(collection(db, 'equipo'))

  return snap.docs.map((d) => ({
    tipos: [], 
    ...d.data(),
    id: Number(d.id)
  }))
}
