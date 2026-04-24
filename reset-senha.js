import { supabase } from './supabaseClient.js'

// ============================================
// VALIDAÇÃO EM TEMPO REAL DOS REQUISITOS
// ============================================

window.validarRequisitos = function() {
    const novaSenha = document.getElementById('novaSenha').value
    const confirmarSenha = document.getElementById('confirmarSenha').value
    
    const reqLength = document.getElementById('reqLength')
    const reqMatch = document.getElementById('reqMatch')
    
    // Requisito: Pelo menos 6 caracteres
    if (novaSenha.length >= 6) {
        reqLength.classList.add('valid')
        reqLength.classList.remove('invalid')
        reqLength.querySelector('.req-icon').setAttribute('data-feather', 'check-circle')
    } else if (novaSenha.length > 0) {
        reqLength.classList.add('invalid')
        reqLength.classList.remove('valid')
        reqLength.querySelector('.req-icon').setAttribute('data-feather', 'x-circle')
    } else {
        reqLength.classList.remove('valid', 'invalid')
        reqLength.querySelector('.req-icon').setAttribute('data-feather', 'circle')
    }
    
    // Requisito: Senhas iguais
    if (confirmarSenha.length > 0 && novaSenha === confirmarSenha) {
        reqMatch.classList.add('valid')
        reqMatch.classList.remove('invalid')
        reqMatch.querySelector('.req-icon').setAttribute('data-feather', 'check-circle')
    } else if (confirmarSenha.length > 0 && novaSenha !== confirmarSenha) {
        reqMatch.classList.add('invalid')
        reqMatch.classList.remove('valid')
        reqMatch.querySelector('.req-icon').setAttribute('data-feather', 'x-circle')
    } else {
        reqMatch.classList.remove('valid', 'invalid')
        reqMatch.querySelector('.req-icon').setAttribute('data-feather', 'circle')
    }
    
    // Atualiza os ícones
    feather.replace()
}

// ============================================
// ATUALIZAR SENHA
// ============================================

window.atualizarSenha = async function() {
    const novaSenha = document.getElementById('novaSenha')
    const confirmarSenha = document.getElementById('confirmarSenha')
    const mensagemEl = document.getElementById('mensagem')
    const botao = document.getElementById('btn-reset')
    
    // Remove estados anteriores
    novaSenha.classList.remove('input-error')
    confirmarSenha.classList.remove('input-error')
    mensagemEl.innerHTML = ''
    
    const senha = novaSenha.value
    const confirmacao = confirmarSenha.value
    
    // Validações
    if (!senha || !confirmacao) {
        mensagemEl.innerHTML = `
            <div class="message error">
                <i data-feather="alert-circle"></i>
                <span>Preencha todos os campos</span>
            </div>
        `
        feather.replace()
        
        if (!senha) {
            novaSenha.classList.add('input-error')
            novaSenha.focus()
        }
        if (!confirmacao) {
            confirmarSenha.classList.add('input-error')
            if (senha) confirmarSenha.focus()
        }
        
        setTimeout(() => {
            novaSenha.classList.remove('input-error')
            confirmarSenha.classList.remove('input-error')
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
        
        novaSenha.classList.add('input-error')
        novaSenha.focus()
        
        setTimeout(() => {
            novaSenha.classList.remove('input-error')
        }, 2000)
        
        return
    }
    
    if (senha !== confirmacao) {
        mensagemEl.innerHTML = `
            <div class="message error">
                <i data-feather="alert-triangle"></i>
                <span>As senhas não conferem</span>
            </div>
        `
        feather.replace()
        
        confirmarSenha.classList.add('input-error')
        confirmarSenha.focus()
        
        setTimeout(() => {
            confirmarSenha.classList.remove('input-error')
        }, 2000)
        
        return
    }
    
    // Estado de loading
    botao.classList.add('loading')
    botao.disabled = true
    
    try {
        const { error } = await supabase.auth.updateUser({
            password: senha
        })
        
        if (error) {
            mensagemEl.innerHTML = `
                <div class="message error">
                    <i data-feather="alert-triangle"></i>
                    <span>${error.message}</span>
                </div>
            `
            feather.replace()
            
            botao.classList.remove('loading')
            botao.disabled = false
        } else {
            // Sucesso!
            mensagemEl.innerHTML = `
                <div class="message success">
                    <i data-feather="check-circle"></i>
                    <span>Senha atualizada com sucesso!</span>
                </div>
            `
            feather.replace()
            
            // Mostra mensagem adicional
            setTimeout(() => {
                mensagemEl.innerHTML += `
                    <div class="message success" style="margin-top: 8px;">
                        <i data-feather="log-in"></i>
                        <span>Redirecionando para o login...</span>
                    </div>
                `
                feather.replace()
            }, 800)
            
            // Redireciona para o login após 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html'
            }, 2000)
        }
    } catch (err) {
        mensagemEl.innerHTML = `
            <div class="message error">
                <i data-feather="alert-triangle"></i>
                <span>Erro ao atualizar senha. Tente novamente.</span>
            </div>
        `
        feather.replace()
        
        botao.classList.remove('loading')
        botao.disabled = false
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

// Verifica se o usuário está autenticado (veio do link de recuperação)
async function verificarSessao() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        // Se não estiver autenticado, pode ser que o link tenha expirado
        const mensagemEl = document.getElementById('mensagem')
        if (mensagemEl) {
            mensagemEl.innerHTML = `
                <div class="message error">
                    <i data-feather="alert-triangle"></i>
                    <span>Link expirado ou inválido. Solicite uma nova recuperação de senha.</span>
                </div>
            `
            feather.replace()
        }
        
        // Desabilita o botão de redefinir
        const botao = document.getElementById('btn-reset')
        if (botao) {
            botao.disabled = true
            botao.style.opacity = '0.5'
            botao.style.cursor = 'not-allowed'
        }
    }
}

// Executa ao carregar
verificarSessao()