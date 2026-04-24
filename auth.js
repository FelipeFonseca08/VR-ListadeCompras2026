import { supabase } from './supabaseClient.js'

// ============================================
// TRADUZIR TODOS OS ERROS DO SUPABASE
// ============================================

function traduzirErro(mensagem) {
    var msg = mensagem.toLowerCase()
    
    // Senha igual à anterior
    if (msg.includes('new password') && msg.includes('different')) {
        return 'A nova senha deve ser diferente da senha atual.'
    }
    if (msg.includes('password') && msg.includes('same')) {
        return 'A nova senha deve ser diferente da senha atual.'
    }
    
    // Senha muito curta
    if (msg.includes('password') && msg.includes('at least 6')) {
        return 'A senha deve ter pelo menos 6 caracteres.'
    }
    if (msg.includes('password') && msg.includes('too short')) {
        return 'A senha é muito curta. Use pelo menos 6 caracteres.'
    }
    
    // Senha muito comum
    if (msg.includes('password') && msg.includes('common')) {
        return 'Essa senha é muito comum. Escolha uma mais segura.'
    }
    if (msg.includes('password') && msg.includes('weak')) {
        return 'Essa senha é muito fraca. Escolha uma mais segura.'
    }
    
    // Login
    if (msg.includes('invalid login credentials')) {
        return 'E-mail ou senha incorretos.'
    }
    if (msg.includes('invalid credentials')) {
        return 'E-mail ou senha incorretos.'
    }
    if (msg.includes('wrong password')) {
        return 'Senha incorreta.'
    }
    if (msg.includes('wrong email')) {
        return 'E-mail não encontrado.'
    }
    
    // Email já cadastrado
    if (msg.includes('already') && msg.includes('registered')) {
        return 'Este e-mail já está cadastrado.'
    }
    if (msg.includes('already') && msg.includes('exists')) {
        return 'Este e-mail já está cadastrado.'
    }
    if (msg.includes('duplicate')) {
        return 'Este e-mail já está cadastrado.'
    }
    
    // Email não confirmado
    if (msg.includes('email') && msg.includes('not confirmed')) {
        return 'E-mail não confirmado. Verifique sua caixa de entrada.'
    }
    if (msg.includes('email') && msg.includes('not verified')) {
        return 'E-mail não verificado. Verifique sua caixa de entrada.'
    }
    
    // Token
    if (msg.includes('token') && msg.includes('expired')) {
        return 'Link expirado. Solicite uma nova recuperação.'
    }
    if (msg.includes('token') && msg.includes('invalid')) {
        return 'Link inválido. Solicite uma nova recuperação.'
    }
    
    // Rate limit
    if (msg.includes('rate limit') || msg.includes('too many requests')) {
        return 'Muitas tentativas. Aguarde um momento.'
    }
    
    // Sessão
    if (msg.includes('session') && msg.includes('expired')) {
        return 'Sessão expirada. Faça login novamente.'
    }
    
    // Rede
    if (msg.includes('network') || msg.includes('fetch failed')) {
        return 'Erro de conexão. Verifique sua internet.'
    }
    if (msg.includes('timeout') || msg.includes('timed out')) {
        return 'Tempo esgotado. Tente novamente.'
    }
    if (msg.includes('offline') || msg.includes('disconnected')) {
        return 'Você está offline. Verifique sua conexão.'
    }
    
    // Servidor
    if (msg.includes('server') && msg.includes('error')) {
        return 'Erro no servidor. Tente novamente mais tarde.'
    }
    if (msg.includes('internal') && msg.includes('error')) {
        return 'Erro interno. Tente novamente mais tarde.'
    }
    if (msg.includes('service') && msg.includes('unavailable')) {
        return 'Serviço indisponível. Tente novamente mais tarde.'
    }
    
    // Recuperação de senha
    if (msg.includes('reset') && msg.includes('email')) {
        return 'Erro ao enviar e-mail de recuperação.'
    }
    if (msg.includes('email') && msg.includes('send')) {
        return 'Erro ao enviar e-mail. Tente novamente.'
    }
    
    // Email inválido
    if (msg.includes('email') && msg.includes('invalid')) {
        return 'E-mail inválido. Verifique o endereço.'
    }
    if (msg.includes('valid email')) {
        return 'Insira um e-mail válido.'
    }
    
    // Se não encontrou tradução
    console.log('Mensagem não traduzida:', mensagem)
    return mensagem
}

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
    var errorMessage = traduzirErro(error.message)
    
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
    var errorMessage = traduzirErro(error.message)
    mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>' + errorMessage + '</span></div>'
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
    var redirectUrl = window.location.origin + '/atualizar-senha.html'
    console.log('URL de redirecionamento:', redirectUrl)
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    })
    
    if (error) {
      var errorMessage = traduzirErro(error.message)
      recoveryMensagem.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>' + errorMessage + '</span></div>'
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
    var errorMessage = traduzirErro(err.message || 'Erro ao enviar')
    recoveryMensagem.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>' + errorMessage + '</span></div>'
    if (typeof feather !== 'undefined') feather.replace()
    botao.classList.remove('loading')
    botao.disabled = false
  }
}