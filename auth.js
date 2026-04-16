import { supabase } from './supabaseClient.js'

// LOGIN NORMAL
window.login = async function () {
  const btn = document.getElementById('btn-login')
  const erro = document.getElementById('erro')

  erro.textContent = ''
  btn.innerText = 'Entrando...'
  btn.disabled = true

  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  })

  if (error) {
    erro.textContent = error.message
    btn.innerText = 'Entrar'
    btn.disabled = false
  } else {
    window.location.href = 'index.html'
  }
}

// LOGIN COM GOOGLE
window.loginGoogle = async function () {
  await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
}

// CADASTRO
window.cadastro = async function () {
  const erro = document.getElementById('erro')
  erro.textContent = ''

  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value

  const { error } = await supabase.auth.signUp({
    email,
    password: senha
  })

  if (error) {
    erro.textContent = error.message
  } else {
    erro.textContent = 'Cadastro feito. Verifique seu e-mail.'
  }
}

// ENTER PARA LOGIN
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    login()
  }
})

// FOCO AUTOMÁTICO
window.onload = () => {
  document.getElementById('email').focus()
}