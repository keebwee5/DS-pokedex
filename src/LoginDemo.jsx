import { useState, useEffect } from 'react'
import { registrar, iniciarSesion, escucharSesion, cerrarSesion } from './data/auth'

function LoginDemo(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [usuario, setUsuario] = useState(null)
  const [revisando, setRevisando] = useState(true)

  useEffect(() => {
    const dejarDeEscuchar = escucharSesion((user) => {
      setUsuario(user)
      setRevisando(false)
    })
    return dejarDeEscuchar
  }, [])


  async function entrar(e) {
    e.preventDefault()
    setError('')
    try{
      await iniciarSesion(email, password)
    } catch (err){
      setError(err.code)
    }
  }

  async function crearCuenta() {
    setError('')
    try {
      await registrar(email, password)
    } catch (err){
      setError(err.code)
    }
  }

  if(revisando) return <p>Cargando...</p>

  if (usuario) {
    return (
      <main>
        <h1>Hola, {usuario.email}</h1>
        <p>Tu uid: {usuario.uid}</p>
        <button onClick={cerrarSesion}>Cerrar Sesion</button>
      </main>
    )
  }

  return(
    
    
    <main>
      <h1>Login</h1>
      <form onSubmit={entrar}>
        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Correo'/>
        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Contrasena'/>

        <button type="submit">Entrar</button>
        <button type="button" onClick={crearCuenta}>crear cuenta</button>
      </form>
      {error && <p className='error'>{error}</p>}
    </main>

  )
}

export default LoginDemo
