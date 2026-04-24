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
    
    // Pelo menos 6 caracteres
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
    
    // Senhas iguais
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
    
    // Validações
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
    
    // Loading
    botao.classList.add('loading')
    botao.disabled = true
    
    try {
        const { error } = await supabase.auth.updateUser({ password: senha })
        
        if (error) {
            // TRADUÇÃO DAS MENSAGENS DE ERRO
            var mensagemErro = error.message
            
            if (error.message.includes('New password should be different from the old password')) {
                mensagemErro = 'A nova senha deve ser diferente da senha atual.'
            } else if (error.message.includes('Password should be at least 6 characters')) {
                mensagemErro = 'A senha deve ter pelo menos 6 caracteres.'
            } else if (error.message.includes('Invalid login credentials')) {
                mensagemErro = 'Credenciais inválidas.'
            }
            
            mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>' + mensagemErro + '</span></div>'
            if (typeof feather !== 'undefined') feather.replace()
            
            novaSenha.classList.add('input-error')
            novaSenha.focus()
            
            setTimeout(function() {
                novaSenha.classList.remove('input-error')
            }, 2000)
            
            botao.classList.remove('loading')
            botao.disabled = false
        } else {
            // Sucesso
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
        console.log('Erro:', err)
        mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>Erro ao atualizar. Tente novamente.</span></div>'
        if (typeof feather !== 'undefined') feather.replace()
        botao.classList.remove('loading')
        botao.disabled = false
    }
}

// ============================================
// INICIALIZAÇÃO - VERIFICA TOKEN
// ============================================

function init() {
    supabase.auth.getUser().then(function(result) {
        var user = result.data.user
        var error = result.error
        
        if (error || !user) {
            var mensagemEl = document.getElementById('mensagem')
            if (mensagemEl) {
                mensagemEl.innerHTML = '<div class="message error"><i data-feather="alert-triangle"></i><span>Link expirado ou inválido.<br>Solicite uma nova recuperação de senha.</span></div>'
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