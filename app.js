import { supabase } from './supabaseClient.js'

async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) window.location.href = 'login.html'
  return user
}

const lista = document.getElementById('lista')
const input = document.getElementById('item')
const textoContador = document.getElementById('textoContador')
const badgeContador = document.getElementById('badgeContador')
const categoriaSelect = document.getElementById('categoriaSelect')

var categoriaAtual = 'todas'

// ============================================
// MENSAGEM
// ============================================

function mostrarMensagem(tipo, texto) {
  var msgAntiga = document.getElementById('mensagemErro')
  if (msgAntiga) msgAntiga.remove()
  
  var msg = document.createElement('div')
  msg.id = 'mensagemErro'
  msg.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 12px; font-size: 0.85rem; margin-bottom: 12px; animation: slideDown 0.3s ease;'
  
  if (tipo === 'erro') {
    msg.style.background = '#fef2f2'; msg.style.color = '#ef4444'; msg.style.border = '1px solid #fecaca'
    msg.innerHTML = '<i data-feather="alert-triangle" style="width:16px;height:16px;"></i><span>' + texto + '</span>'
  } else if (tipo === 'aviso') {
    msg.style.background = '#fffbeb'; msg.style.color = '#d97706'; msg.style.border = '1px solid #fde68a'
    msg.innerHTML = '<i data-feather="info" style="width:16px;height:16px;"></i><span>' + texto + '</span>'
  } else if (tipo === 'sucesso') {
    msg.style.background = '#f0fdf4'; msg.style.color = '#10b981'; msg.style.border = '1px solid #bbf7d0'
    msg.innerHTML = '<i data-feather="check-circle" style="width:16px;height:16px;"></i><span>' + texto + '</span>'
  }
  
  var inputGroup = document.querySelector('.input-group')
  if (inputGroup) inputGroup.parentNode.insertBefore(msg, inputGroup)
  if (typeof feather !== 'undefined') feather.replace()
  
  setTimeout(function() {
    if (msg && msg.parentNode) {
      msg.style.animation = 'slideUp 0.3s ease forwards'
      setTimeout(function() { if (msg && msg.parentNode) msg.remove() }, 300)
    }
  }, 3000)
}

// ============================================
// NOME DA CATEGORIA
// ============================================

function nomeCategoria(cat) {
  var nomes = {
    'hortifruti': '🥦 Hortifruti',
    'laticinios': '🥛 Laticínios',
    'padaria': '🍞 Padaria',
    'carnes': '🥩 Carnes',
    'limpeza': '🧹 Limpeza',
    'higiene': '🧴 Higiene',
    'bebidas': '🥤 Bebidas',
    'outros': '📦 Outros'
  }
  return nomes[cat] || '📦 Outros'
}

// ============================================
// CARREGAR LISTA
// ============================================

async function carregarLista() {
  var query = supabase.from('lista_compras').select('*').order('concluido', { ascending: true }).order('posicao', { ascending: true })
  
  if (categoriaAtual !== 'todas') {
    query = query.eq('categoria', categoriaAtual)
  }
  
  const { data, error } = await query
  
  if (error) { console.error('Erro ao carregar:', error); return }
  
  lista.innerHTML = ''
  
  if (!data || data.length === 0) {
    mostrarListaVazia()
    atualizarContador(0)
    return
  }
  
  atualizarContador(data.length)
  data.forEach(function(item, index) { criarItemLista(item, index, data.length) })
}

// ============================================
// CRIAR ITEM - NOVO LAYOUT (2 LINHAS)
// ============================================

function criarItemLista(item, index, total) {
  var li = document.createElement('li')
  li.setAttribute('data-id', item.id)
  li.setAttribute('draggable', 'true')
  li.setAttribute('data-posicao', index)
  
  if (item.concluido) li.classList.add('concluido')
  
  var qtd = item.quantidade || 1
  var cat = item.categoria || 'outros'
  
  li.innerHTML = `
    <!-- LINHA 1: Nome + Categoria -->
    <div class="item-row-top">
      <div class="item-info">
        <input type="checkbox" class="item-checkbox" id="check-${item.id}" ${item.concluido ? 'checked' : ''}>
        <i data-feather="shopping-bag" class="item-icon"></i>
        <span class="item-texto">${escapeHTML(item.item)}</span>
        <span class="item-qtd-badge">${qtd > 1 ? '(' + qtd + 'x)' : ''}</span>
      </div>
      <span class="item-categoria-badge">${nomeCategoria(cat)}</span>
    </div>
    
    <!-- LINHA 2: Ações -->
    <div class="item-row-actions">
      <div class="quantidade-group">
        <button class="btn-qtd btn-qtd-menos" data-id="${item.id}">−</button>
        <span class="qtd-numero">${qtd}</span>
        <button class="btn-qtd btn-qtd-mais" data-id="${item.id}">+</button>
      </div>
      <div class="mover-group">
        <button class="btn-mover btn-mover-cima" data-id="${item.id}" ${index === 0 ? 'disabled' : ''} title="Mover para cima">
          <i data-feather="chevron-up" class="mover-icon"></i>
        </button>
        <button class="btn-mover btn-mover-baixo" data-id="${item.id}" ${index === total - 1 ? 'disabled' : ''} title="Mover para baixo">
          <i data-feather="chevron-down" class="mover-icon"></i>
        </button>
      </div>
      <button class="btn-editar" data-id="${item.id}" title="Editar item">
        <i data-feather="edit-2" class="editar-icon"></i>
      </button>
      <button class="btn-remover" data-id="${item.id}" title="Remover item">
        <i data-feather="trash-2" class="remover-icon"></i>
      </button>
    </div>
  `
  
  lista.appendChild(li)
  if (typeof feather !== 'undefined') feather.replace()
  
  // Event listeners
  li.querySelector('.item-checkbox').addEventListener('change', function() {
    window.toggleConcluido(item.id, this.checked)
  })
  
  li.querySelector('.btn-remover').addEventListener('click', function() {
    window.removerItem(this.getAttribute('data-id'))
  })
  
  li.querySelector('.btn-editar').addEventListener('click', function() {
    window.iniciarEdicao(this.getAttribute('data-id'))
  })
  
  li.querySelector('.btn-qtd-menos').addEventListener('click', function() {
    window.alterarQuantidade(this.getAttribute('data-id'), -1)
  })
  
  li.querySelector('.btn-qtd-mais').addEventListener('click', function() {
    window.alterarQuantidade(this.getAttribute('data-id'), 1)
  })
  
  li.querySelector('.btn-mover-cima').addEventListener('click', function() {
    window.moverItem(this.getAttribute('data-id'), 'cima')
  })
  
  li.querySelector('.btn-mover-baixo').addEventListener('click', function() {
    window.moverItem(this.getAttribute('data-id'), 'baixo')
  })
  
  // Drag and drop
  li.addEventListener('dragstart', function(e) {
    this.classList.add('dragging')
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', item.id)
  })
  
  li.addEventListener('dragend', function() {
    this.classList.remove('dragging')
    document.querySelectorAll('#lista li').forEach(function(l) { l.classList.remove('drag-over') })
  })
  
  li.addEventListener('dragover', function(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!this.classList.contains('dragging')) this.classList.add('drag-over')
  })
  
  li.addEventListener('dragleave', function() { this.classList.remove('drag-over') })
  
  li.addEventListener('drop', function(e) {
    e.preventDefault()
    this.classList.remove('drag-over')
    var draggedId = e.dataTransfer.getData('text/plain')
    if (draggedId !== item.id) window.reordenarDrag(draggedId, item.id)
  })
}

// ============================================
// FILTRAR POR CATEGORIA
// ============================================

window.filtrarPorCategoria = function(categoria) {
  categoriaAtual = categoria
  carregarLista()
}

// ============================================
// TOGGLE CONCLUÍDO
// ============================================

window.toggleConcluido = async function(id, concluido) {
  var li = lista.querySelector('li[data-id="' + id + '"]')
  if (concluido) li.classList.add('concluido')
  else li.classList.remove('concluido')
  
  const { error } = await supabase.from('lista_compras').update({ concluido: concluido }).eq('id', id)
  if (error) { console.error('Erro:', error); return }
  
  setTimeout(function() { carregarLista() }, 300)
}

// ============================================
// MOVER ITEM
// ============================================

window.moverItem = async function(id, direcao) {
  var itens = Array.from(lista.querySelectorAll('li:not(.lista-vazia)'))
  var indexAtual = itens.findIndex(function(li) { return li.getAttribute('data-id') === id })
  var indexTrocar = direcao === 'cima' ? indexAtual - 1 : indexAtual + 1
  
  if (indexTrocar < 0 || indexTrocar >= itens.length) return
  
  var idTrocar = itens[indexTrocar].getAttribute('data-id')
  
  await supabase.from('lista_compras').update({ posicao: indexTrocar }).eq('id', id)
  await supabase.from('lista_compras').update({ posicao: indexAtual }).eq('id', idTrocar)
  
  carregarLista()
}

// ============================================
// REORDENAR DRAG
// ============================================

window.reordenarDrag = async function(draggedId, targetId) {
  var itens = Array.from(lista.querySelectorAll('li:not(.lista-vazia)'))
  
  for (var i = 0; i < itens.length; i++) {
    var id = itens[i].getAttribute('data-id')
    await supabase.from('lista_compras').update({ posicao: i }).eq('id', id)
  }
  
  carregarLista()
}

// ============================================
// ALTERAR QUANTIDADE
// ============================================

window.alterarQuantidade = async function(id, delta) {
  var li = lista.querySelector('li[data-id="' + id + '"]')
  var qtdNumero = li.querySelector('.qtd-numero')
  var qtdBadge = li.querySelector('.item-qtd-badge')
  
  var qtdAtual = parseInt(qtdNumero.textContent)
  var novaQtd = qtdAtual + delta
  if (novaQtd < 1) return
  
  const { error } = await supabase.from('lista_compras').update({ quantidade: novaQtd }).eq('id', id)
  if (error) return
  
  qtdNumero.textContent = novaQtd
  qtdBadge.textContent = novaQtd > 1 ? '(' + novaQtd + 'x)' : ''
}

// ============================================
// INICIAR EDIÇÃO (COM CATEGORIA)
// ============================================

window.iniciarEdicao = function(id) {
  var li = lista.querySelector('li[data-id="' + id + '"]')
  var textoSpan = li.querySelector('.item-texto')
  var textoAtual = textoSpan.textContent
  var categoriaBadge = li.querySelector('.item-categoria-badge')
  
  // Pega a categoria atual do item
  var categoriaAtualItem = 'outros'
  var categorias = ['hortifruti', 'laticinios', 'padaria', 'carnes', 'limpeza', 'higiene', 'bebidas', 'outros']
  for (var i = 0; i < categorias.length; i++) {
    var nomeCat = nomeCategoria(categorias[i])
    var textoBadge = categoriaBadge.textContent.trim()
    if (textoBadge === nomeCat || textoBadge.includes(nomeCat.split(' ')[1])) {
      categoriaAtualItem = categorias[i]
      break
    }
  }
  
  // Substitui o span por input de texto
  var inputEdicao = document.createElement('input')
  inputEdicao.type = 'text'
  inputEdicao.className = 'item-edit-input'
  inputEdicao.value = textoAtual
  inputEdicao.style.flex = '1'
  inputEdicao.style.minWidth = '0'
  
  textoSpan.parentNode.replaceChild(inputEdicao, textoSpan)
  
  // Substitui a badge por select de categoria
  var selectCategoria = document.createElement('select')
  selectCategoria.className = 'categoria-select'
  selectCategoria.style.cssText = 'padding: 6px 8px; font-size: 0.75rem; min-width: 110px; border-radius: 8px;'
  selectCategoria.innerHTML = `
    <option value="hortifruti" ${categoriaAtualItem === 'hortifruti' ? 'selected' : ''}>🥦 Hortifruti</option>
    <option value="laticinios" ${categoriaAtualItem === 'laticinios' ? 'selected' : ''}>🥛 Laticínios</option>
    <option value="padaria" ${categoriaAtualItem === 'padaria' ? 'selected' : ''}>🍞 Padaria</option>
    <option value="carnes" ${categoriaAtualItem === 'carnes' ? 'selected' : ''}>🥩 Carnes</option>
    <option value="limpeza" ${categoriaAtualItem === 'limpeza' ? 'selected' : ''}>🧹 Limpeza</option>
    <option value="higiene" ${categoriaAtualItem === 'higiene' ? 'selected' : ''}>🧴 Higiene</option>
    <option value="bebidas" ${categoriaAtualItem === 'bebidas' ? 'selected' : ''}>🥤 Bebidas</option>
    <option value="outros" ${categoriaAtualItem === 'outros' ? 'selected' : ''}>📦 Outros</option>
  `
  
  categoriaBadge.parentNode.replaceChild(selectCategoria, categoriaBadge)
  
  inputEdicao.focus()
  inputEdicao.select()
  
  // Esconde botão editar
  var btnEditar = li.querySelector('.btn-editar')
  btnEditar.style.display = 'none'
  
  // Cria botões salvar/cancelar
  var btnSalvar = document.createElement('button')
  btnSalvar.className = 'btn-salvar-edicao'
  btnSalvar.innerHTML = '<i data-feather="check" style="width:14px;height:14px;"></i>'
  btnSalvar.title = 'Salvar'
  
  var btnCancelar = document.createElement('button')
  btnCancelar.className = 'btn-cancelar-edicao'
  btnCancelar.innerHTML = '<i data-feather="x" style="width:14px;height:14px;"></i>'
  btnCancelar.title = 'Cancelar'
  
  btnEditar.parentNode.insertBefore(btnSalvar, btnEditar)
  btnEditar.parentNode.insertBefore(btnCancelar, btnEditar)
  
  if (typeof feather !== 'undefined') feather.replace()
  
  // Eventos
  inputEdicao.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { 
      e.preventDefault()
      window.salvarEdicao(id, inputEdicao.value.trim(), selectCategoria.value, li, inputEdicao, selectCategoria, btnSalvar, btnCancelar, btnEditar, textoSpan, categoriaBadge) 
    }
    if (e.key === 'Escape') { 
      window.cancelarEdicao(li, inputEdicao, selectCategoria, btnSalvar, btnCancelar, btnEditar, textoSpan, categoriaBadge) 
    }
  })
  
  btnSalvar.addEventListener('click', function() {
    window.salvarEdicao(id, inputEdicao.value.trim(), selectCategoria.value, li, inputEdicao, selectCategoria, btnSalvar, btnCancelar, btnEditar, textoSpan, categoriaBadge)
  })
  
  btnCancelar.addEventListener('click', function() {
    window.cancelarEdicao(li, inputEdicao, selectCategoria, btnSalvar, btnCancelar, btnEditar, textoSpan, categoriaBadge)
  })
}

// ============================================
// SALVAR EDIÇÃO (COM CATEGORIA)
// ============================================

window.salvarEdicao = async function(id, novoTexto, novaCategoria, li, inputEdicao, selectCategoria, btnSalvar, btnCancelar, btnEditar, textoSpan, categoriaBadge) {
  if (!novoTexto) { 
    mostrarMensagem('erro', 'O nome do item não pode ficar vazio.')
    inputEdicao.focus()
    return 
  }
  
  // Verifica duplicado (ignora o próprio item)
  var itens = lista.querySelectorAll('li:not(.lista-vazia) .item-texto')
  var valorLower = novoTexto.toLowerCase()
  for (var i = 0; i < itens.length; i++) {
    if (itens[i] !== textoSpan && itens[i].textContent.toLowerCase().trim() === valorLower) {
      mostrarMensagem('aviso', '"' + novoTexto + '" já está na sua lista.')
      inputEdicao.focus()
      return
    }
  }
  
  // Atualiza no banco (nome e categoria)
  const { error } = await supabase.from('lista_compras').update({ 
    item: novoTexto,
    categoria: novaCategoria
  }).eq('id', id)
  
  if (error) { 
    mostrarMensagem('erro', 'Erro ao editar.')
    return 
  }
  
  // Restaura o span com novo texto
  textoSpan.textContent = escapeHTML(novoTexto)
  inputEdicao.parentNode.replaceChild(textoSpan, inputEdicao)
  
  // Restaura a badge com nova categoria
  categoriaBadge.textContent = nomeCategoria(novaCategoria)
  selectCategoria.parentNode.replaceChild(categoriaBadge, selectCategoria)
  
  // Remove botões de edição
  btnSalvar.remove()
  btnCancelar.remove()
  btnEditar.style.display = ''
  
  mostrarMensagem('sucesso', 'Item atualizado!')
}

// ============================================
// CANCELAR EDIÇÃO
// ============================================

window.cancelarEdicao = function(li, inputEdicao, selectCategoria, btnSalvar, btnCancelar, btnEditar, textoSpan, categoriaBadge) {
  inputEdicao.parentNode.replaceChild(textoSpan, inputEdicao)
  selectCategoria.parentNode.replaceChild(categoriaBadge, selectCategoria)
  btnSalvar.remove()
  btnCancelar.remove()
  btnEditar.style.display = ''
}

// ============================================
// LISTA VAZIA
// ============================================

function mostrarListaVazia() {
  var msg = categoriaAtual !== 'todas' ? 'Nenhum item na categoria ' + nomeCategoria(categoriaAtual) : 'Sua lista está vazia'
  lista.innerHTML = '<li class="lista-vazia"><i data-feather="shopping-cart" class="lista-vazia-icon"></i><p class="lista-vazia-texto">' + msg + '</p><p class="lista-vazia-subtexto">Adicione itens para começar!</p></li>'
  if (typeof feather !== 'undefined') feather.replace()
}

// ============================================
// CONTADOR
// ============================================

function atualizarContador(total) {
  if (total === 0) { textoContador.textContent = 'Nenhum item na lista'; badgeContador.style.display = 'none' }
  else if (total === 1) { textoContador.textContent = 'item na lista'; badgeContador.textContent = total; badgeContador.style.display = 'inline-block' }
  else { textoContador.textContent = 'itens na lista'; badgeContador.textContent = total; badgeContador.style.display = 'inline-block' }
}

// ============================================
// DUPLICADO
// ============================================

function itemJaExiste(valor) {
  var itens = lista.querySelectorAll('li:not(.lista-vazia) .item-texto')
  var valorLower = valor.toLowerCase().trim()
  for (var i = 0; i < itens.length; i++) {
    if (itens[i].textContent.toLowerCase().trim() === valorLower) return true
  }
  return false
}

function destacarItemDuplicado(valor) {
  var itens = lista.querySelectorAll('li:not(.lista-vazia) .item-texto')
  var valorLower = valor.toLowerCase().trim()
  for (var i = 0; i < itens.length; i++) {
    if (itens[i].textContent.toLowerCase().trim() === valorLower) {
      var li = itens[i].closest('li')
      li.style.borderColor = '#ef4444'; li.style.backgroundColor = '#fef2f2'; li.style.boxShadow = '0 0 0 4px rgba(239,68,68,0.1)'
      li.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(function() { li.style.borderColor = '#e2e8f0'; li.style.backgroundColor = '#f8fafc'; li.style.boxShadow = '' }, 2500)
      break
    }
  }
}

// ============================================
// ADICIONAR
// ============================================

window.adicionarItem = async function () {
  var valor = input.value.trim()
  
  if (!valor) {
    input.classList.add('input-error'); input.focus()
    mostrarMensagem('erro', 'Digite o nome do item.')
    setTimeout(function() { input.classList.remove('input-error') }, 1500)
    return
  }
  
  if (itemJaExiste(valor)) {
    input.classList.add('input-error'); destacarItemDuplicado(valor)
    mostrarMensagem('aviso', '"' + valor + '" já está na sua lista.')
    input.style.borderColor = '#f59e0b'; input.style.backgroundColor = '#fffbeb'
    setTimeout(function() { input.classList.remove('input-error'); input.style.borderColor = ''; input.style.backgroundColor = ''; input.focus(); input.select() }, 2000)
    return
  }
  
  const user = await getUser()
  var categoria = categoriaSelect.value
  
  const { data: ultimo } = await supabase.from('lista_compras').select('posicao').order('posicao', { ascending: false }).limit(1)
  var novaPosicao = ultimo && ultimo.length > 0 ? ultimo[0].posicao + 1 : 0
  
  const { data, error } = await supabase.from('lista_compras').insert({
    item: valor, adicionado_por: user.id, quantidade: 1, concluido: false, categoria: categoria, posicao: novaPosicao
  }).select()
  
  if (error) { mostrarMensagem('erro', 'Erro ao adicionar.'); return }
  
  var msgAntiga = document.getElementById('mensagemErro')
  if (msgAntiga) msgAntiga.remove()
  
  var listaVazia = lista.querySelector('.lista-vazia')
  if (listaVazia) lista.innerHTML = ''
  
  if (data && data[0]) { criarItemLista(data[0], novaPosicao, novaPosicao + 1) }
  
  var totalItens = lista.querySelectorAll('li:not(.lista-vazia)').length
  atualizarContador(totalItens)
  input.value = ''
  input.focus()
}

// ============================================
// REMOVER
// ============================================

window.removerItem = async function (id) {
  var li = lista.querySelector('li[data-id="' + id + '"]')
  if (li) { li.classList.add('removing'); await new Promise(function(r) { setTimeout(r, 300) }) }
  
  const { error } = await supabase.from('lista_compras').delete().eq('id', id)
  if (error) { mostrarMensagem('erro', 'Erro ao remover.'); if (li) li.classList.remove('removing'); return }
  
  if (li) li.remove()
  
  var totalItens = lista.querySelectorAll('li:not(.lista-vazia)').length
  atualizarContador(totalItens)
  if (totalItens === 0) mostrarListaVazia()
}

// ============================================
// LIMPAR TUDO
// ============================================

window.limparTudo = function() {
  var totalItens = lista.querySelectorAll('li:not(.lista-vazia)').length
  if (totalItens === 0) { mostrarMensagem('aviso', 'A lista já está vazia.'); return }
  
  var overlay = document.createElement('div')
  overlay.className = 'modal-confirm-overlay'
  overlay.innerHTML = '<div class="modal-confirm-card"><i data-feather="alert-triangle" class="modal-confirm-icon"></i><h3 class="modal-confirm-title">Limpar lista?</h3><p class="modal-confirm-text">Tem certeza que deseja remover <strong>todos os ' + totalItens + ' itens</strong>?</p><div class="modal-confirm-botoes"><button class="btn-cancelar" id="btnCancelarLimpar">Cancelar</button><button class="btn-confirmar" id="btnConfirmarLimpar">Sim, limpar tudo</button></div></div>'
  
  document.body.appendChild(overlay)
  if (typeof feather !== 'undefined') feather.replace()
  
  document.getElementById('btnCancelarLimpar').addEventListener('click', function() { document.body.removeChild(overlay) })
  overlay.addEventListener('click', function(e) { if (e.target === overlay) document.body.removeChild(overlay) })
  
  document.getElementById('btnConfirmarLimpar').addEventListener('click', async function() {
    document.body.removeChild(overlay)
    const { error } = await supabase.from('lista_compras').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) { mostrarMensagem('erro', 'Erro ao limpar.'); return }
    lista.innerHTML = ''
    mostrarListaVazia()
    atualizarContador(0)
    mostrarMensagem('sucesso', 'Lista limpa!')
  })
}

// ============================================
// LOGOUT
// ============================================

window.logout = async function () {
  await supabase.auth.signOut()
  window.location.href = 'login.html'
}

// ============================================
// ESCAPAR HTML
// ============================================

function escapeHTML(texto) {
  var div = document.createElement('div')
  div.appendChild(document.createTextNode(texto))
  return div.innerHTML
}

// ============================================
// INIT
// ============================================

getUser().then(function(user) {
  console.log('Usuário:', user.email)
  carregarLista()
})

document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') { e.preventDefault(); window.adicionarItem() }
  if (e.key === 'Escape') { input.value = ''; input.focus() }
})

if (typeof feather !== 'undefined') feather.replace()