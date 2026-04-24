import { supabase } from './supabaseClient.js'

// ============================================
// VALIDAÇÃO EM TEMPO REAL
// ============================================

window.validarRequisitos = function() {
    const novaSenha = document.getElementById('novaSenha')
    const confirmarSenha = document.getElementById('confirmarSenha')
    const reqLength = document.getElementById('reqLength')
    const reqMatch = document.getElementById('reqMatch')
    
    if (!novaSenha || !confirmarSenha || !reqLength || !reqMatch) return
    
    const senha = novaSenha.value
    const confirmacao = confirmarSenha.value
    
    if (senha.length >= 6) {
        reqLength.classList.add('valid')
        reqLength.classList.remove('invalid')
        reqLength.querySelector('.req-icon').setAttribute('data-feather', 'check-circle')
    } else if (senha.length > 0) {
        reqLength.classList.add('invalid')
        reqLength.classList.remove('valid')
        reqLength.querySelector('.req-icon').setAttribute('data-feather', 'x-circle')
    } else {
        reqLength.classList.remove('valid', 'invalid')
        reqLength.querySelector('.req-icon').setAttribute('data-feather', 'circle')
    }
    
    if (confirmacao.length > 0 && senha === confirmacao) {
        reqMatch.classList.add('valid')
        reqMatch.classList.remove('invalid')
        reqMatch.querySelector('.req-icon').setAttribute('data-feather', 'check-circle')
    } else if (confirmacao.length > 0 && senha !== confirmacao) {
        reqMatch.classList.add('invalid')
        reqMatch.classList.remove('valid')
        reqMatch.querySelector('.req-icon').setAttribute('data-feather', 'x-circle')
    } else {
        reqMatch.classList.remove('valid', 'invalid')
        reqMatch.querySelector('.req-icon').setAttribute('data-feather', 'circle')
    }
    
    if (typeof feather !== 'undefined') feather.replace()
}

// ============================================
// TRADUZIR TODOS OS ERROS DO SUPABASE
// ============================================

function traduzirErro(mensagem) {
    var msg = mensagem.toLowerCase()
    
    // Senha igual à anterior
    if (msg.includes('new password') && msg.includes('different') && msg.includes('old password')) {
        return 'A nova senha deve ser diferente da senha atual.'
    }
    if (msg.includes('new password') && msg.includes('same as') && msg.includes('old password')) {
        return 'A nova senha deve ser diferente da senha atual.'
    }
    if (msg.includes('password') && msg.includes('different')) {
        return 'A nova senha deve ser diferente da senha atual.'
    }
    if (msg.includes('password') && msg.includes('same')) {
        return 'A nova senha deve ser diferente da senha atual.'
    }
    
    // Senha muito curta
    if (msg.includes('password') && msg.includes('at least 6 characters')) {
        return 'A senha deve ter pelo menos 6 caracteres.'
    }
    if (msg.includes('password') && msg.includes('minimum')) {
        return 'A senha deve ter pelo menos 6 caracteres.'
    }
    if (msg.includes('password') && msg.includes('too short')) {
        return 'A senha é muito curta. Use pelo menos 6 caracteres.'
    }
    
    // Senha muito comum/fácil
    if (msg.includes('password') && msg.includes('common')) {
        return 'Essa senha é muito comum. Escolha uma senha mais segura.'
    }
    if (msg.includes('password') && msg.includes('weak')) {
        return 'Essa senha é muito fraca. Escolha uma senha mais segura.'
    }
    if (msg.includes('password') && msg.includes('easy')) {
        return 'Essa senha é muito fácil. Escolha uma senha mais segura.'
    }
    
    // Token expirado
    if (msg.includes('token') && msg.includes('expired')) {
        return 'Link expirado. Solicite uma nova recuperação de senha.'
    }
    if (msg.includes('token') && msg.includes('invalid')) {
        return 'Link inválido. Solicite uma nova recuperação de senha.'
    }
    
    // Usuário não encontrado
    if (msg.includes('user') && msg.includes('not found')) {
        return 'Usuário não encontrado.'
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
    
    // Login inválido
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
    
    // Rate limit (muitas tentativas)
    if (msg.includes('rate limit') || msg.includes('too many requests')) {
        return 'Muitas tentativas. Aguarde um momento e tente novamente.'
    }
    if (msg.includes('try again later')) {
        return 'Muitas tentativas. Aguarde um momento e tente novamente.'
    }
    
    // Sessão expirada
    if (msg.includes('session') && msg.includes('expired')) {
        return 'Sessão expirada. Faça login novamente.'
    }
    if (msg.includes('session') && msg.includes('not found')) {
        return 'Sessão não encontrada. Faça login novamente.'
    }
    
    // Rede/Internet
    if (msg.includes('network') || msg.includes('fetch failed')) {
        return 'Erro de conexão. Verifique sua internet e tente novamente.'
    }
    if (msg.includes('timeout') || msg.includes('timed out')) {
        return 'Tempo de conexão esgotado. Tente novamente.'
    }
    if (msg.includes('offline') || msg.includes('disconnected')) {
        return 'Você está offline. Verifique sua conexão com a internet.'
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
    
    // Se não encontrou tradução, retorna a mensagem original
    console.log('Mensagem não traduzida:', mensagem)
    return mensagem
}

// ============================================
// ATUALIZAR SENHA
// ============================================

window.atualizarSenha = async function() {
    const novaSenha = document.getElementById('novaSenha')
    const confirmarSenha = document.getElementById('confirmarSenha')
    const mensagemEl = document.getElementById('mensagem')
    const botao = document.getElementById('btn-reset')
    
    if (!novaSenha || !confirmarSenha || !mensagemEl || !botao) return
    
    novaSenha.classList.remove('input-error')
    confirmarSenha.classList.remove('input-error')
    mensagemEl.innerHTML = ''
    
    const senha = novaSenha.value
    const confirmacao = confirmarSenha.value
    
    if (!senha || !confirmacao) {
        mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-circle"></i><span>Preencha todos os campos</span></div>'
        if (typeof feather !== 'undefined') feather.replace()
        
        if (!senha) {
            novaSenha.classList.add('input-error')
            novaSenha.focus()
        } else {
            confirmarSenha.classList.add('input-error')
            confirmarSenha.focus()
        }
        
        setTimeout(function() {
            novaSenha.classList.remove('input-error')
            confirmarSenha.classList.remove('input-error')
        }, 2000)
        return
    }
    
    if (senha.length < 6) {
        mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>A senha deve ter pelo menos 6 caracteres</span></div>'
        if (typeof feather !== 'undefined') feather.replace()
        novaSenha.classList.add('input-error')
        novaSenha.focus()
        setTimeout(function() { novaSenha.classList.remove('input-error') }, 2000)
        return
    }
    
    if (senha !== confirmacao) {
        mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>As senhas não conferem</span></div>'
        if (typeof feather !== 'undefined') feather.replace()
        confirmarSenha.classList.add('input-error')
        confirmarSenha.focus()
        setTimeout(function() { confirmarSenha.classList.remove('input-error') }, 2000)
        return
    }
    
    botao.classList.add('loading')
    botao.disabled = true
    
    try {
        const { error } = await supabase.auth.updateUser({ password: senha })
        
        if (error) {
            console.log('Erro original:', error.message)
            var mensagemErro = traduzirErro(error.message)
            console.log('Erro traduzido:', mensagemErro)
            
            mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>' + mensagemErro + '</span></div>'
            if (typeof feather !== 'undefined') feather.replace()
            
            novaSenha.classList.add('input-error')
            novaSenha.focus()
            novaSenha.select()
            
            setTimeout(function() {
                novaSenha.classList.remove('input-error')
            }, 3000)
            
            botao.classList.remove('loading')
            botao.disabled = false
        } else {
            mensagemEl.innerHTML = '<div class="message success"><i data-feather="check-circle"></i><span>Senha atualizada com sucesso!</span></div>'
            if (typeof feather !== 'undefined') feather.replace()
            
            setTimeout(function() {
                var segundaMsg = document.createElement('div')
                segundaMsg.className = 'message success'
                segundaMsg.style.marginTop = '8px'
                segundaMsg.innerHTML = '<i data-feather="log-in"></i><span>Redirecionando para o login...</span>'
                mensagemEl.appendChild(segundaMsg)
                if (typeof feather !== 'undefined') feather.replace()
            }, 800)
            
            setTimeout(function() {
                supabase.auth.signOut().then(function() {
                    window.location.href = 'login.html'
                }).catch(function(err) {
                    console.log('Erro ao fazer logout:', err)
                    window.location.href = 'login.html'
                })
            }, 2000)
        }
    } catch (err) {
        console.log('Erro inesperado:', err)
        var mensagemErro = traduzirErro(err.message || 'Erro desconhecido')
        
        mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>' + mensagemErro + '</span></div>'
        if (typeof feather !== 'undefined') feather.replace()
        botao.classList.remove('loading')
        botao.disabled = false
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function init() {
    supabase.auth.getUser().then(function(result) {
        var user = result.data.user
        var error = result.error
        
        if (error || !user) {
            var mensagemEl = document.getElementById('mensagem')
            if (mensagemEl) {
                var mensagemErro = error ? traduzirErro(error.message) : 'Link expirado ou inválido.'
                mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>' + mensagemErro + '<br>Solicite uma nova recuperação de senha.</span></div>'
                if (typeof feather !== 'undefined') feather.replace()
            }
            
            var botao = document.getElementById('btn-reset')
            if (botao) {
                botao.disabled = true
                botao.style.opacity = '0.5'
                botao.style.cursor = 'not-allowed'
            }
        } else {
            var novaSenha = document.getElementById('novaSenha')
            if (novaSenha) novaSenha.focus()
        }
    }).catch(function(err) {
        console.log('Erro ao verificar sessão:', err)
    })
}

init()