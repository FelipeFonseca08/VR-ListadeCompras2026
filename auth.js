import { supabase } from './supabaseClient.js'

window.login = async function () {
  const email = document.getElementById('email')
  const senha = document.getElementById('senha')
  const mensagemEl = document.getElementById('mensagem')
  const botao = document.getElementById('btn-login')
  const card = document.getElementById('loginCard')

  // Limpa mensagem anterior
  mensagemEl.innerHTML = ""

  // Validação
  if (!email.value || !senha.value) {
    mensagemEl.innerHTML = `
      <div class="message error">
        <i data-feather="alert-circle"></i>
        <span>Preencha todos os campos</span>
      </div>
    `
    feather.replace()
    card.classList.add('shake')
    setTimeout(() => card.classList.remove('shake'), 500)
    return
  }

  // Estado de loading
  botao.classList.add('loading')
  botao.disabled = true

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: senha.value
  })

  if (error) {
    let errorMessage = "Erro ao fazer login"
    
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "E-mail ou senha incorretos"
    } else {
      errorMessage = error.message
    }
    
    mensagemEl.innerHTML = `
      <div class="message error">
        <i data-feather="alert-triangle"></i>
        <span>${errorMessage}</span>
      </div>
    `
    feather.replace()
    card.classList.add('shake')
    
    setTimeout(() => {
      card.classList.remove('shake')
    }, 500)

    botao.classList.remove('loading')
    botao.disabled = false
  } else {
    // Login bem sucedido
    mensagemEl.innerHTML = `
      <div class="message success">
        <i data-feather="check-circle"></i>
        <span>Login realizado! Redirecionando...</span>
      </div>
    `
    feather.replace()
    
    setTimeout(() => {
      window.location.href = 'index.html'
    }, 500)
  }
}

window.cadastro = async function () {
  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value
  const mensagemEl = document.getElementById('mensagem')
  const botao = document.querySelector('.btn-signup')
  const card = document.getElementById('loginCard')

  mensagemEl.innerHTML = ""

  if (!email || !senha) {
    mensagemEl.innerHTML = `
      <div class="message error">
        <i data-feather="alert-circle"></i>
        <span>Preencha todos os campos para criar sua conta</span>
      </div>
    `
    feather.replace()
    card.classList.add('shake')
    setTimeout(() => card.classList.remove('shake'), 500)
    return
  }

  if (senha.length < 6) {
    mensagemEl.innerHTML = `
      <div class="message error">
        <i data-feather="alert-triangle"></i>
        <span>A senha deve ter pelo menos 6 caracteres</span>
      </div>
    `
    feather.replace()
    return
  }

  // Estado de loading
  botao.classList.add('loading')
  botao.disabled = true

  const { error } = await supabase.auth.signUp({
    email,
    password: senha
  })

  botao.classList.remove('loading')
  botao.disabled = false

  if (error) {
    mensagemEl.innerHTML = `
      <div class="message error">
        <i data-feather="alert-triangle"></i>
        <span>${error.message}</span>
      </div>
    `
    feather.replace()
  } else {
    mensagemEl.innerHTML = `
      <div class="message success">
        <i data-feather="mail"></i>
        <span>Cadastro realizado! Verifique seu e-mail para confirmar.</span>
      </div>
    `
    feather.replace()
    
    // Limpa os campos
    document.getElementById('email').value = ''
    document.getElementById('senha').value = ''
  }
}