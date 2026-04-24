import { supabase } from './supabaseClient.js'

// ============================================
// FUNÇÕES DE LOGIN E CADASTRO
// ============================================

window.login = async function () {
  const email = document.getElementById('email')
  const senha = document.getElementById('senha')
  const mensagemEl = document.getElementById('mensagem')
  const botao = document.getElementById('btn-login')

  // Remove classes de erro anteriores
  email.classList.remove('input-error')
  senha.classList.remove('input-error')
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
    
    // Destaca os campos vazios com animação suave
    if (!email.value) {
      email.classList.add('input-error')
      email.focus()
    }
    if (!senha.value) {
      senha.classList.add('input-error')
      if (email.value) senha.focus()
    }
    
    // Remove o destaque após 2 segundos
    setTimeout(() => {
      email.classList.remove('input-error')
      senha.classList.remove('input-error')
    }, 2000)
    
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
    
    // Destaca ambos os campos com animação suave
    email.classList.add('input-error')
    senha.classList.add('input-error')
    
    // Remove o destaque após 2 segundos
    setTimeout(() => {
      email.classList.remove('input-error')
      senha.classList.remove('input-error')
    }, 2000)

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
  const emailInput = document.getElementById('email')
  const senhaInput = document.getElementById('senha')

  // Remove classes de erro anteriores
  emailInput.classList.remove('input-error')
  senhaInput.classList.remove('input-error')
  mensagemEl.innerHTML = ""

  if (!email || !senha) {
    mensagemEl.innerHTML = `
      <div class="message error">
        <i data-feather="alert-circle"></i>
        <span>Preencha todos os campos para criar sua conta</span>
      </div>
    `
    feather.replace()
    
    // Destaca os campos vazios com animação suave
    if (!email) {
      emailInput.classList.add('input-error')
      emailInput.focus()
    }
    if (!senha) {
      senhaInput.classList.add('input-error')
      if (email) senhaInput.focus()
    }
    
    setTimeout(() => {
      emailInput.classList.remove('input-error')
      senhaInput.classList.remove('input-error')
    }, 2000)
    
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
    
    senhaInput.classList.add('input-error')
    senhaInput.focus()
    
    setTimeout(() => {
      senhaInput.classList.remove('input-error')
    }, 2000)
    
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
    emailInput.value = ''
    senhaInput.value = ''
  }
}

// ============================================
// FUNÇÕES DE RECUPERAÇÃO DE SENHA
// ============================================

window.abrirRecuperacao = function() {
  const modal = document.getElementById('modalOverlay')
  const recoveryEmail = document.getElementById('recoveryEmail')
  const recoveryMensagem = document.getElementById('recoveryMensagem')
  const emailInput = document.getElementById('email')
  
  // Preenche o email do modal com o email do formulário principal (se existir)
  if (emailInput.value) {
    recoveryEmail.value = emailInput.value
  }
  
  // Limpa mensagens anteriores
  recoveryMensagem.innerHTML = ''
  recoveryEmail.classList.remove('input-error')
  
  // Mostra o modal com animação
  modal.style.display = 'flex'
  setTimeout(() => {
    modal.classList.add('active')
    recoveryEmail.focus()
  }, 10)
}

window.fecharRecuperacao = function() {
  const modal = document.getElementById('modalOverlay')
  
  modal.classList.remove('active')
  setTimeout(() => {
    modal.style.display = 'none'
    document.getElementById('recoveryMensagem').innerHTML = ''
    document.getElementById('recoveryEmail').classList.remove('input-error')
  }, 300)
}

window.enviarRecuperacao = async function() {
  const recoveryEmail = document.getElementById('recoveryEmail')
  const recoveryMensagem = document.getElementById('recoveryMensagem')
  const botao = document.getElementById('btnRecovery')
  
  // Remove classes de erro anteriores
  recoveryEmail.classList.remove('input-error')
  recoveryMensagem.innerHTML = ''
  
  const email = recoveryEmail.value.trim()
  
  // Validação
  if (!email) {
    recoveryMensagem.innerHTML = `
      <div class="message error">
        <i data-feather="alert-circle"></i>
        <span>Por favor, insira seu e-mail</span>
      </div>
    `
    feather.replace()
    recoveryEmail.classList.add('input-error')
    recoveryEmail.focus()
    
    setTimeout(() => {
      recoveryEmail.classList.remove('input-error')
    }, 2000)
    
    return
  }
  
  // Validação básica de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    recoveryMensagem.innerHTML = `
      <div class="message error">
        <i data-feather="alert-circle"></i>
        <span>Por favor, insira um e-mail válido</span>
      </div>
    `
    feather.replace()
    recoveryEmail.classList.add('input-error')
    recoveryEmail.focus()
    
    setTimeout(() => {
      recoveryEmail.classList.remove('input-error')
    }, 2000)
    
    return
  }
  
  // Estado de loading
  botao.classList.add('loading')
  botao.disabled = true
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/atualizar-senha.html'
    })
    
    if (error) {
      recoveryMensagem.innerHTML = `
        <div class="message error">
          <i data-feather="alert-triangle"></i>
          <span>${error.message}</span>
        </div>
      `
      feather.replace()
    } else {
      recoveryMensagem.innerHTML = `
        <div class="message success">
          <i data-feather="check-circle"></i>
          <span>Link de recuperação enviado! Verifique seu e-mail.</span>
        </div>
      `
      feather.replace()
      
      // Limpa o campo após 1 segundo
      setTimeout(() => {
        recoveryEmail.value = ''
      }, 1000)
      
      // Fecha o modal após 3 segundos
      setTimeout(() => {
        window.fecharRecuperacao()
      }, 3000)
    }
  } catch (err) {
    recoveryMensagem.innerHTML = `
      <div class="message error">
        <i data-feather="alert-triangle"></i>
        <span>Erro ao enviar. Tente novamente mais tarde.</span>
      </div>
    `
    feather.replace()
  } finally {
    botao.classList.remove('loading')
    botao.disabled = false
  }
}