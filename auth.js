import { supabase } from './supabaseClient.js'

// ============================================
// LOGIN
// ============================================

window.login = async function () {
  const email = document.getElementById('email')
  const senha = document.getElementById('senha')
  const mensagemEl = document.getElementById('mensagem')
  const botao = document.getElementById('btn-login')

  if (!email || !senha || !mensagemEl || !botao) return

  email.classList.remove('input-error')
  senha.classList.remove('input-error')
  mensagemEl.innerHTML = ""

  if (!email.value || !senha.value) {
    mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-circle"></i><span>Preencha todos os campos</span></div>'
    if (typeof feather !== 'undefined') feather.replace()
    
    if (!email.value) {
      email.classList.add('input-error')
      email.focus()
    } else if (!senha.value) {
      senha.classList.add('input-error')
      senha.focus()
    }
    
    setTimeout(function() {
      email.classList.remove('input-error')
      senha.classList.remove('input-error')
    }, 2000)
    
    return
  }

  botao.classList.add('loading')
  botao.disabled = true

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: senha.value
  })

  if (error) {
    var errorMessage = "Erro ao fazer login"
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "E-mail ou senha incorretos"
    } else {
      errorMessage = error.message
    }
    
    mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>' + errorMessage + '</span></div>'
    if (typeof feather !== 'undefined') feather.replace()
    
    email.classList.add('input-error')
    senha.classList.add('input-error')
    
    setTimeout(function() {
      email.classList.remove('input-error')
      senha.classList.remove('input-error')
    }, 2000)

    botao.classList.remove('loading')
    botao.disabled = false
  } else {
    mensagemEl.innerHTML = '<div class="message success"><i data-feather="check-circle"></i><span>Login realizado! Redirecionando...</span></div>'
    if (typeof feather !== 'undefined') feather.replace()
    
    setTimeout(function() {
      window.location.href = 'index.html'
    }, 500)
  }
}

// ============================================
// CADASTRO
// ============================================

window.cadastro = async function () {
  const email = document.getElementById('email')
  const senha = document.getElementById('senha')
  const mensagemEl = document.getElementById('mensagem')
  const botao = document.querySelector('.btn-signup')

  if (!email || !senha || !mensagemEl || !botao) return

  email.classList.remove('input-error')
  senha.classList.remove('input-error')
  mensagemEl.innerHTML = ""

  if (!email.value || !senha.value) {
    mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-circle"></i><span>Preencha todos os campos</span></div>'
    if (typeof feather !== 'undefined') feather.replace()
    
    if (!email.value) {
      email.classList.add('input-error')
      email.focus()
    } else if (!senha.value) {
      senha.classList.add('input-error')
      senha.focus()
    }
    
    setTimeout(function() {
      email.classList.remove('input-error')
      senha.classList.remove('input-error')
    }, 2000)
    
    return
  }

  if (senha.value.length < 6) {
    mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>A senha deve ter pelo menos 6 caracteres</span></div>'
    if (typeof feather !== 'undefined') feather.replace()
    
    senha.classList.add('input-error')
    senha.focus()
    
    setTimeout(function() {
      senha.classList.remove('input-error')
    }, 2000)
    
    return
  }

  botao.classList.add('loading')
  botao.disabled = true

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: senha.value
  })

  botao.classList.remove('loading')
  botao.disabled = false

  if (error) {
    mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>' + error.message + '</span></div>'
    if (typeof feather !== 'undefined') feather.replace()
  } else {
    mensagemEl.innerHTML = '<div class="message success"><i data-feather="mail"></i><span>Cadastro realizado! Verifique seu e-mail.</span></div>'
    if (typeof feather !== 'undefined') feather.replace()
    
    email.value = ''
    senha.value = ''
  }
}

// ============================================
// RECUPERAÇÃO DE SENHA - ABRIR MODAL
// ============================================

window.abrirRecuperacao = function() {
  const modal = document.getElementById('modalOverlay')
  const recoveryEmail = document.getElementById('recoveryEmail')
  const recoveryMensagem = document.getElementById('recoveryMensagem')
  const emailInput = document.getElementById('email')
  
  if (!modal || !recoveryEmail || !recoveryMensagem) return
  
  if (emailInput && emailInput.value) {
    recoveryEmail.value = emailInput.value
  }
  
  recoveryMensagem.innerHTML = ''
  recoveryEmail.classList.remove('input-error')
  
  modal.style.display = 'flex'
  setTimeout(function() {
    modal.classList.add('active')
    recoveryEmail.focus()
  }, 10)
}

// ============================================
// RECUPERAÇÃO DE SENHA - FECHAR MODAL
// ============================================

window.fecharRecuperacao = function() {
  const modal = document.getElementById('modalOverlay')
  if (!modal) return
  
  modal.classList.remove('active')
  setTimeout(function() {
    modal.style.display = 'none'
    var recoveryMensagem = document.getElementById('recoveryMensagem')
    var recoveryEmail = document.getElementById('recoveryEmail')
    if (recoveryMensagem) recoveryMensagem.innerHTML = ''
    if (recoveryEmail) recoveryEmail.classList.remove('input-error')
  }, 300)
}

// ============================================
// RECUPERAÇÃO DE SENHA - ENVIAR EMAIL
// ============================================

window.enviarRecuperacao = async function() {
  const recoveryEmail = document.getElementById('recoveryEmail')
  const recoveryMensagem = document.getElementById('recoveryMensagem')
  const botao = document.getElementById('btnRecovery')
  
  if (!recoveryEmail || !recoveryMensagem || !botao) return
  
  recoveryEmail.classList.remove('input-error')
  recoveryMensagem.innerHTML = ''
  
  const email = recoveryEmail.value.trim()
  
  if (!email) {
    recoveryMensagem.innerHTML = '<div class="message error"><i data-feather="alert-circle"></i><span>Insira seu e-mail</span></div>'
    if (typeof feather !== 'undefined') feather.replace()
    recoveryEmail.classList.add('input-error')
    recoveryEmail.focus()
    setTimeout(function() { recoveryEmail.classList.remove('input-error') }, 2000)
    return
  }
  
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    recoveryMensagem.innerHTML = '<div class="message error"><i data-feather="alert-circle"></i><span>E-mail inválido</span></div>'
    if (typeof feather !== 'undefined') feather.replace()
    recoveryEmail.classList.add('input-error')
    recoveryEmail.focus()
    setTimeout(function() { recoveryEmail.classList.remove('input-error') }, 2000)
    return
  }
  
  botao.classList.add('loading')
  botao.disabled = true
  
  try {
    // URL para onde o usuário será redirecionado ao clicar no link do e-mail
    var redirectUrl = window.location.origin + '/atualizar-senha.html'
    console.log('URL de redirecionamento:', redirectUrl)
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    })
    
    if (error) {
      recoveryMensagem.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>' + error.message + '</span></div>'
      if (typeof feather !== 'undefined') feather.replace()
      botao.classList.remove('loading')
      botao.disabled = false
    } else {
      recoveryMensagem.innerHTML = '<div class="message success"><i data-feather="check-circle"></i><span>Link enviado! Verifique seu e-mail.</span></div>'
      if (typeof feather !== 'undefined') feather.replace()
      
      setTimeout(function() { recoveryEmail.value = '' }, 1000)
      setTimeout(function() { window.fecharRecuperacao() }, 3000)
    }
  } catch (err) {
    recoveryMensagem.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>Erro ao enviar. Tente novamente.</span></div>'
    if (typeof feather !== 'undefined') feather.replace()
    botao.classList.remove('loading')
    botao.disabled = false
  }
}