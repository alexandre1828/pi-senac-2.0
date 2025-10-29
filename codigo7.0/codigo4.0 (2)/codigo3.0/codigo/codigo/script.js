
// Funções para a Seção de Dúvidas Gerais
function initializeFAQ() {
    // Filtro de categorias
    document.querySelectorAll('.faq-category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class de todos os botões
            document.querySelectorAll('.faq-category-btn').forEach(b => b.classList.remove('active'));
            // Adiciona active class ao botão clicado
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterFAQs(category);
        });
    });

    // Toggle das respostas
    document.querySelectorAll('.toggle-answer').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const faqItem = this.closest('.faq-item');
            toggleFAQAnswer(faqItem);
        });
    });

    // Também permitir clicar na pergunta inteira
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            toggleFAQAnswer(faqItem);
        });
    });

    // Botões de "foi útil"
    document.querySelectorAll('.helpful-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            markHelpful(this);
        });
    });

    // Busca de FAQs
    const searchInput = document.getElementById('faqSearch');
    const searchBtn = document.querySelector('.search-btn-large');
    
    searchBtn.addEventListener('click', performFAQSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performFAQSearch();
        }
    });

    // Formulário de nova pergunta
    document.getElementById('newQuestionForm').addEventListener('submit', submitNewQuestion);
}

function filterFAQs(category) {
    const faqCategories = document.querySelectorAll('.faq-category');
    
    if (category === 'all') {
        // Mostrar todas as categorias
        faqCategories.forEach(cat => {
            cat.style.display = 'block';
        });
    } else {
        // Mostrar apenas a categoria selecionada
        faqCategories.forEach(cat => {
            if (cat.getAttribute('data-category') === category) {
                cat.style.display = 'block';
            } else {
                cat.style.display = 'none';
            }
        });
    }
    
    // Fechar todas as respostas abertas
    closeAllFAQAnswers();
    
    // Animação de entrada
    setTimeout(() => {
        document.querySelectorAll('.faq-item').forEach((item, index) => {
            if (item.closest('.faq-category').style.display !== 'none') {
                item.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
            }
        });
    }, 100);
}

function toggleFAQAnswer(faqItem) {
    const isActive = faqItem.classList.contains('active');
    
    // Fechar todas as outras respostas
    if (!isActive) {
        closeAllFAQAnswers();
    }
    
    // Toggle da resposta atual
    faqItem.classList.toggle('active');
    
    // Atualizar o ícone
    const toggleBtn = faqItem.querySelector('.toggle-answer');
    if (faqItem.classList.contains('active')) {
        toggleBtn.textContent = '↑';
    } else {
        toggleBtn.textContent = '↓';
    }
}

function closeAllFAQAnswers() {
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.toggle-answer').textContent = '↓';
    });
}

function markHelpful(button) {
    const helpfulCount = button.previousElementSibling;
    const currentCount = parseInt(helpfulCount.textContent.match(/\d+/)[0]);
    const newCount = currentCount + 1;
    
    helpfulCount.textContent = `👍 ${newCount} pessoas acharam útil`;
    button.textContent = '✅ Obrigado!';
    button.disabled = true;
    button.style.background = '#27ae60';
    
    // Aqui você poderia enviar para o backend
    console.log('Resposta marcada como útil');
}

function performFAQSearch() {
    const searchTerm = document.getElementById('faqSearch').value.trim().toLowerCase();
    
    if (!searchTerm) {
        // Se busca vazia, mostrar todas as categorias
        filterFAQs('all');
        document.querySelectorAll('.faq-category-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
        return;
    }
    
    // Fechar todas as respostas
    closeAllFAQAnswers();
    
    // Buscar em todas as categorias
    let foundResults = false;
    
    document.querySelectorAll('.faq-category').forEach(category => {
        let categoryHasResults = false;
        
        category.querySelectorAll('.faq-item').forEach(item => {
            const question = item.querySelector('h4').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                item.style.background = '#fff3cd'; // Destacar resultados
                categoryHasResults = true;
                foundResults = true;
            } else {
                item.style.display = 'none';
                item.style.background = '';
            }
        });
        
        // Mostrar/ocultar categoria baseado nos resultados
        category.style.display = categoryHasResults ? 'block' : 'none';
    });
    
    // Mostrar mensagem se não encontrar resultados
    showSearchResultsMessage(foundResults, searchTerm);
    
    // Atualizar botões de categoria
    document.querySelectorAll('.faq-category-btn').forEach(btn => btn.classList.remove('active'));
}

function showSearchResultsMessage(foundResults, searchTerm) {
    // Remover mensagem anterior se existir
    const existingMessage = document.querySelector('.search-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (!foundResults) {
        const message = document.createElement('div');
        message.className = 'search-results-message';
        message.innerHTML = `
            <div style="text-align: center; padding: 30px; background: #f8f9fa; border-radius: 12px; margin: 20px 0;">
                <h4>🔍 Nenhum resultado encontrado para "${searchTerm}"</h4>
                <p>Tente usar outras palavras-chave ou <a href="#" onclick="document.querySelector('.new-question-section').scrollIntoView({behavior: 'smooth'})">faça uma nova pergunta</a>.</p>
            </div>
        `;
        
        const faqGrid = document.querySelector('.faq-grid');
        faqGrid.parentNode.insertBefore(message, faqGrid);
    }
}

function submitNewQuestion(e) {
    e.preventDefault();
    
    const category = document.getElementById('questionCategory').value;
    const title = document.getElementById('questionTitle').value;
    const detail = document.getElementById('questionDetail').value;
    
    // Simular envio
    const submitBtn = document.querySelector('.submit-question-btn');
    submitBtn.innerHTML = '⏳ Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = '✅ Dúvida Enviada!';
        submitBtn.style.background = '#27ae60';
        
        // Resetar formulário
        setTimeout(() => {
            document.getElementById('newQuestionForm').reset();
            submitBtn.innerHTML = '📤 Enviar Dúvida';
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            
            // Mostrar mensagem de sucesso
            alert('🎉 Sua dúvida foi enviada com sucesso! Nossa comunidade responderá em até 2 horas.');
        }, 2000);
    }, 1500);
    
    // Aqui você enviaria os dados para o backend
    console.log('Nova dúvida:', { category, title, detail });
}









// Sistema de Autenticação
let dadosUsuario = {
    nome: '',
    email: '',
    dataRegistro: new Date(),
    ultimoAcesso: new Date(),
    estaLogado: false
};

const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados')) || [
    'admin@email.com',
    'usuario@email.com',
    'teste@email.com'
];

// Verificar se usuário já está logado ao carregar a página
function verificarLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        dadosUsuario = JSON.parse(usuarioLogado);
        dadosUsuario.estaLogado = true;
        mostrarAplicacao();
    } else {
        mostrarSistemaLogin();
    }
}

function mostrarSistemaLogin() {
    document.getElementById('authSystem').style.display = 'block';
    document.querySelector('.main-container').style.display = 'none';
    mostrarLogin();
}

function mostrarAplicacao() {
    document.getElementById('authSystem').style.display = 'none';
    document.querySelector('.main-container').style.display = 'block';
    
    // Atualizar informações do usuário na interface
    const userMenu = document.querySelector('.user-menu');
    if (userMenu && dadosUsuario.estaLogado) {
        userMenu.textContent = `👤 ${dadosUsuario.nome.split(' ')[0]}`;
    }
}

// Gerenciamento de telas
function mostrarLogin() {
    ocultarTodasSecoes();
    document.getElementById('secaoLogin').classList.remove('oculto');
    limparFormularios();
}

function mostrarRegistro() {
    ocultarTodasSecoes();
    document.getElementById('secaoRegistro').classList.remove('oculto');
}

function mostrarEsqueciSenha() {
    ocultarTodasSecoes();
    document.getElementById('secaoEsqueciSenha').classList.remove('oculto');
}

function mostrarAcessoBloqueado() {
    ocultarTodasSecoes();
    document.getElementById('secaoAcessoBloqueado').classList.remove('oculto');
}

function ocultarTodasSecoes() {
    const secoes = ['secaoLogin', 'secaoRegistro', 'secaoEsqueciSenha', 'secaoAcessoBloqueado'];
    secoes.forEach(id => {
        document.getElementById(id).classList.add('oculto');
    });
}

function limparFormularios() {
    document.getElementById('formularioLogin').reset();
    document.getElementById('formularioRegistro').reset();
    document.getElementById('formularioEsqueciSenha').reset();
    limparErros();
}

function limparErros() {
    const elementosErro = document.querySelectorAll('.mensagem-erro');
    elementosErro.forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });
    
    const entradas = document.querySelectorAll('.entrada-formulario');
    entradas.forEach(entrada => entrada.classList.remove('erro'));
}

// Validação de email
function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Verificar se usuário está cadastrado
function usuarioCadastrado(email) {
    return usuariosCadastrados.includes(email.toLowerCase());
}

// Validação de senha
function obterForcaSenha(senha) {
    let pontuacao = 0;
    if (senha.length >= 8) pontuacao++;
    if (/[a-z]/.test(senha)) pontuacao++;
    if (/[A-Z]/.test(senha)) pontuacao++;
    if (/[0-9]/.test(senha)) pontuacao++;
    if (/[^A-Za-z0-9]/.test(senha)) pontuacao++;
    
    const forcas = ['Muito fraca', 'Fraca', 'Regular', 'Boa', 'Muito forte'];
    const cores = ['#e53e3e', '#fd9801', '#fbb042', '#48bb78', '#38a169'];
    
    return {
        pontuacao: pontuacao,
        texto: forcas[pontuacao - 1] || 'Muito fraca',
        cor: cores[pontuacao - 1] || '#e53e3e',
        porcentagem: (pontuacao / 5) * 100
    };
}

// Mostrar erro
function mostrarErro(idEntrada, mensagem) {
    const entrada = document.getElementById(idEntrada);
    const elementoErro = document.getElementById('erro' + idEntrada.charAt(0).toUpperCase() + idEntrada.slice(1));
    
    entrada.classList.add('erro');
    elementoErro.textContent = mensagem;
    elementoErro.style.display = 'block';
}

// Animação de loading no botão
function definirBotaoCarregando(idBotao, carregando) {
    const botao = document.getElementById(idBotao);
    if (carregando) {
        botao.classList.add('botao-carregando');
        botao.disabled = true;
        botao.textContent = '';
    } else {
        botao.classList.remove('botao-carregando');
        botao.disabled = false;
    }
}

// Função de logout
function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    dadosUsuario = {
        nome: '',
        email: '',
        dataRegistro: new Date(),
        ultimoAcesso: new Date(),
        estaLogado: false
    };
    mostrarSistemaLogin();
}

// Event Listeners para formulários de autenticação
function inicializarAutenticacao() {
    // Login form
    document.getElementById('formularioLogin').addEventListener('submit', function(e) {
        e.preventDefault();
        limparErros();
        
        const email = document.getElementById('emailLogin').value;
        const senha = document.getElementById('senhaLogin').value;
        
        let temErro = false;
        
        if (!email) {
            mostrarErro('emailLogin', 'Email é obrigatório');
            temErro = true;
        } else if (!emailValido(email)) {
            mostrarErro('emailLogin', 'Email inválido');
            temErro = true;
        }
        
        if (!senha) {
            mostrarErro('senhaLogin', 'Senha é obrigatória');
            temErro = true;
        }
        
        if (!temErro) {
            // Verificar se o usuário está cadastrado
            if (!usuarioCadastrado(email)) {
                mostrarAcessoBloqueado();
                return;
            }
            
            definirBotaoCarregando('botaoLogin', true);
            
            // Simular requisição
            setTimeout(() => {
                definirBotaoCarregando('botaoLogin', false);
                document.getElementById('botaoLogin').textContent = 'Entrar';
                
                // Atualizar dados do usuário
                dadosUsuario.email = email;
                dadosUsuario.nome = email.split('@')[0]; // Nome baseado no email
                dadosUsuario.ultimoAcesso = new Date();
                dadosUsuario.estaLogado = true;
                
                // Salvar no localStorage
                localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
                
                mostrarAplicacao();
            }, 1500);
        }
    });

    // Register form
    document.getElementById('formularioRegistro').addEventListener('submit', function(e) {
        e.preventDefault();
        limparErros();
        
        const nome = document.getElementById('nomeRegistro').value;
        const email = document.getElementById('emailRegistro').value;
        const senha = document.getElementById('senhaRegistro').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        const concordarTermos = document.getElementById('concordarTermos').checked;
        
        let temErro = false;
        
        if (!nome || nome.length < 2) {
            mostrarErro('nomeRegistro', 'Nome deve ter pelo menos 2 caracteres');
            temErro = true;
        }
        
        if (!email) {
            mostrarErro('emailRegistro', 'Email é obrigatório');
            temErro = true;
        } else if (!emailValido(email)) {
            mostrarErro('emailRegistro', 'Email inválido');
            temErro = true;
        }
        
        if (!senha) {
            mostrarErro('senhaRegistro', 'Senha é obrigatória');
            temErro = true;
        } else if (senha.length < 6) {
            mostrarErro('senhaRegistro', 'Senha deve ter pelo menos 6 caracteres');
            temErro = true;
        }
        
        if (senha !== confirmarSenha) {
            mostrarErro('confirmarSenha', 'Senhas não coincidem');
            temErro = true;
        }
        
        if (!concordarTermos) {
            mostrarErro('concordarTermos', 'Você deve concordar com os termos');
            temErro = true;
        }
        
        if (!temErro) {
            definirBotaoCarregando('botaoRegistro', true);
            
            // Simular requisição
            setTimeout(() => {
                definirBotaoCarregando('botaoRegistro', false);
                document.getElementById('botaoRegistro').textContent = 'Criar conta';
                
                // Adicionar usuário à base de cadastrados
                usuariosCadastrados.push(email.toLowerCase());
                localStorage.setItem('usuariosCadastrados', JSON.stringify(usuariosCadastrados));
                
                // Atualizar dados do usuário
                dadosUsuario.nome = nome;
                dadosUsuario.email = email;
                dadosUsuario.dataRegistro = new Date();
                dadosUsuario.ultimoAcesso = new Date();
                dadosUsuario.estaLogado = true;
                
                // Salvar no localStorage
                localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
                
                mostrarAplicacao();
            }, 2000);
        }
    });

    // Forgot password form
    document.getElementById('formularioEsqueciSenha').addEventListener('submit', function(e) {
        e.preventDefault();
        limparErros();
        
        const email = document.getElementById('emailEsqueci').value;
        
        if (!email) {
            mostrarErro('emailEsqueci', 'Email é obrigatório');
            return;
        }
        
        if (!emailValido(email)) {
            mostrarErro('emailEsqueci', 'Email inválido');
            return;
        }

        // Verificar se o usuário está cadastrado
        if (!usuarioCadastrado(email)) {
            mostrarErro('emailEsqueci', 'Email não cadastrado no sistema');
            return;
        }
        
        definirBotaoCarregando('botaoEsqueci', true);
        
        // Simular envio
        setTimeout(() => {
            definirBotaoCarregando('botaoEsqueci', false);
            document.getElementById('botaoEsqueci').textContent = 'Instruções enviadas!';
            document.getElementById('botaoEsqueci').style.background = '#48bb78';
            
            setTimeout(() => {
                document.getElementById('botaoEsqueci').textContent = 'Enviar instruções';
                document.getElementById('botaoEsqueci').style.background = '';
                mostrarLogin();
            }, 2000);
        }, 1500);
    });

    // Event listener para força da senha
    document.getElementById('senhaRegistro').addEventListener('input', function() {
        const senha = this.value;
        const elementoForca = document.getElementById('forcaSenha');
        
        if (senha.length > 0) {
            elementoForca.style.display = 'block';
            const forca = obterForcaSenha(senha);
            
            document.getElementById('preenchimentoForca').style.width = forca.porcentagem + '%';
            document.getElementById('preenchimentoForca').style.background = forca.cor;
            document.getElementById('textoForca').textContent = forca.texto;
            document.getElementById('textoForca').style.color = forca.cor;
        } else {
            elementoForca.style.display = 'none';
        }
    });

    // Event listener para menu do usuário
    document.querySelector('.user-menu').addEventListener('click', function() {
        if (dadosUsuario.estaLogado) {
            if (confirm(`Deseja sair da conta de ${dadosUsuario.nome}?`)) {
                fazerLogout();
            }
        }
    });
}



// Navegação entre seções
function showSection(sectionId) {
    // Remove active class from all nav items and sections
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.section-content').forEach(section => section.classList.remove('active'));
    
    // Add active class to clicked nav item and corresponding section
    event.target.classList.add('active');
    document.getElementById(sectionId).classList.add('active');
}

// Event listeners para navegação
document.addEventListener('DOMContentLoaded', function() {

     // Inicializar sistema de autenticação
    inicializarAutenticacao();
    verificarLogin();

    // Navegação principal (só funciona se estiver logado)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (!dadosUsuario.estaLogado) {
                mostrarSistemaLogin();
                return;
            }
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    

    // Tópicos
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', function() {
            const topicId = this.getAttribute('data-topic');
            openTopic(topicId);
        });
    });

    // Botão de nova conversa
    document.getElementById('newPostBtn').addEventListener('click', createNewPost);

    // Funcionalidade de busca
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Inicializar funcionalidades do chat
    initializeChat();

    // Inicializar funcionalidades do e-book
    initializeEbook();

    // Inicializar animações de entrada
    initializeAnimations();

    // Inicializar funcionalidades da central de ajuda
    initializeVideoHelp();

    // Inicializar funcionalidades dos anúncios
    initializeAnnouncements();

     // Inicializar funcionalidades das dúvidas gerais
    initializeFAQ();

    // Inicializar animações de entrada
    initializeAnimations();


});

function openTopic(topicId) {
    alert(`Abrindo tópico: ${topicId}`);
    // Aqui você implementaria a navegação para o tópico específico
}

function createNewPost() {
    alert('Abrindo chat para iniciar nova conversa! 💬');
    // Aqui você implementaria o modal ou página para criar novo post
}

function performSearch() {
    const searchTerm = document.querySelector('.search-input').value.trim();
    if (searchTerm) {
        alert(`Buscando por: "${searchTerm}"`);
        // Aqui você implementaria a funcionalidade de busca
    }
}

// Funcionalidades do Chat
let currentUser = 'Você';
let messageCount = 0;

function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Enable/disable send button based on input
    chatInput.addEventListener('input', function() {
        sendButton.disabled = this.value.trim() === '';
    });
    
    // Initial state
    sendButton.disabled = true;
}

function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
}

function addMessage(text, isMyMessage = true, author = 'Você') {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isMyMessage ? 'my-message' : 'other-message'}`;
    
    const avatarInitials = author.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatarInitials}</div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-author">${author}</span>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
            <div class="message-text">${text}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    messageCount++;
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message) {
        addMessage(message, true, currentUser);
        chatInput.value = '';
        
        // Simulate typing indicator
        showTypingIndicator();
        
        // Simulate response after 2-3 seconds
        setTimeout(() => {
            hideTypingIndicator();
            simulateResponse(message);
        }, Math.random() * 2000 + 1000);
    }
}

function simulateResponse(originalMessage) {
    const responses = [
        "Interessante! Pode me dar mais detalhes sobre isso?",
        "Já passei por algo similar. Vou te ajudar!",
        "Boa pergunta! Alguém mais pode contribuir?",
        "Obrigado por compartilhar essa informação!",
        "Vou verificar isso e te retorno em breve.",
        "Excelente ponto! Concordo totalmente.",
        "Isso pode ser resolvido nas configurações do sistema."
    ];
    
    const authors = ['Admin Suporte', 'Tech Helper', 'SuperHelper', 'Community Star'];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    
    addMessage(randomResponse, false, randomAuthor);
}

function showTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'flex';
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
}

// Funcionalidades do E-book
let moduleProgress = {
    1: { currentStep: 1, completed: false },
    2: { currentStep: 1, completed: false },
    3: { currentStep: 1, completed: false },
    4: { currentStep: 1, completed: false },
    5: { currentStep: 1, completed: false },
    6: { currentStep: 1, completed: false },
    7: { currentStep: 1, completed: false },
     8: { currentStep: 1, completed: false }

};

let completedModules = 0;

function initializeEbook() {
    // Navegação entre módulos
    document.querySelectorAll('.module-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const moduleNumber = this.getAttribute('data-module');
            showModule(moduleNumber);
        });
    });

    // Botões de próximo passo
    document.querySelectorAll('.next-step-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const step = parseInt(this.getAttribute('data-step'));
            const moduleNumber = parseInt(this.getAttribute('data-module'));
            nextStep(step, moduleNumber);
        });
    });

    // Botões de conclusão de módulo
    document.querySelectorAll('.complete-module-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const moduleNumber = parseInt(this.getAttribute('data-module'));
            completeModule(moduleNumber);
        });
    });

    // Botão de download do certificado
    document.getElementById('downloadCertificate').addEventListener('click', downloadCertificate);

    // Funcionalidade dos checkboxes
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                this.parentElement.style.background = 'rgba(39, 174, 96, 0.1)';
                this.parentElement.style.color = '#27ae60';
            } else {
                this.parentElement.style.background = '';
                this.parentElement.style.color = '';
            }
        });
    });
}

function showModule(moduleNumber) {
    // Update navigation
    document.querySelectorAll('.module-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show module content
    document.querySelectorAll('.module-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`module${moduleNumber}`).classList.add('active');
    
    // Update progress display
    updateProgressDisplay(moduleNumber);
}

function nextStep(currentStep, moduleNumber = 1) {
    const module = document.getElementById(`module${moduleNumber}`);
    const currentStepElement = module.querySelector(`[data-step="${currentStep}"]`);
    const nextStepElement = module.querySelector(`[data-step="${currentStep + 1}"]`);
    
    if (nextStepElement) {
        currentStepElement.style.display = 'none';
        nextStepElement.style.display = 'block';
        
        moduleProgress[moduleNumber].currentStep = currentStep + 1;
        updateProgressDisplay(moduleNumber);
        
        // Scroll to top of new step
        nextStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateProgressDisplay(moduleNumber) {
    const progress = moduleProgress[moduleNumber];
    const totalSteps = 3;
    const progressPercentage = ((progress.currentStep - 1) / totalSteps) * 100;
    
    const module = document.getElementById(`module${moduleNumber}`);
    const progressFill = module.querySelector('.progress-fill');
    const progressText = module.querySelector('.progress-text');
    
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `${Math.round(progressPercentage)}% Concluído`;
}

function completeModule(moduleNumber) {
    moduleProgress[moduleNumber].completed = true;
    completedModules++;
    
    // Update progress to 100%
    const module = document.getElementById(`module${moduleNumber}`);
    const progressFill = module.querySelector('.progress-fill');
    const progressText = module.querySelector('.progress-text');
    
    progressFill.style.width = '100%';
    progressText.textContent = '100% Concluído';
    progressText.style.color = '#27ae60';
    
    // Show completion message
    let message = `🎉 Parabéns! Você concluiu o Módulo ${moduleNumber}!`;
    
    // Check if all modules are completed
    if (completedModules === 8) {

         message += "\n\n🧠 Lembre-se: Sua saúde mental é tão importante quanto suas habilidades técnicas!";
         
        setTimeout(() => {
            showCertificate();
        }, 1000);
    } else {
        // Suggest next module
        const nextModule = moduleNumber < 8 ? moduleNumber + 1 : null;
        if (nextModule) {
            setTimeout(() => {
                if (confirm(`Deseja continuar para o Módulo ${nextModule}?`)) {
                    showModule(nextModule);
                }
            }, 1500);
        }
    }
}

function showCertificate() {
    // Hide all module content
    document.querySelectorAll('.module-content').forEach(content => content.classList.remove('active'));
    
    // Show certificate
    const certificate = document.getElementById('certificate');
    certificate.style.display = 'block';
    
    // Set completion date
    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR');
    document.getElementById('completionDate').textContent = dateString;
    
    // Scroll to certificate
    certificate.scrollIntoView({ behavior: 'smooth' });
    
    // Show congratulations
    setTimeout(() => {
        alert('🏆 PARABÉNS! Você concluiu todos os módulos e ganhou seu certificado!');
    }, 500);
}

function downloadCertificate() {
    // Simulate certificate download
    alert('📥 Certificado baixado com sucesso!\n\nO arquivo foi salvo como "Certificado_Jovem_Aprendiz.pdf"');
    
    // In a real application, this would generate and download a PDF
    // For demo purposes, we'll just show the success message
}

// Animação de entrada
function initializeAnimations() {
    const cards = document.querySelectorAll('.topic-card, .discussion-item, .sidebar-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}


// Funções para a Central de Ajuda - Vídeo Aulas
function initializeVideoHelp() {
    // Filtro de categorias
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class de todos os botões
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            // Adiciona active class ao botão clicado
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterVideos(category);
        });
    });

    // Event listeners para os cards de vídeo
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', function() {
            openVideoModal(this);
        });
    });

    // Fechar modal
    document.querySelector('.close-modal').addEventListener('click', closeVideoModal);
    
    // Fechar modal clicando fora
    document.getElementById('videoModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeVideoModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
}

function filterVideos(category) {
    const videoCategories = document.querySelectorAll('.video-category');
    
    if (category === 'all') {
        // Mostrar todas as categorias
        videoCategories.forEach(cat => {
            cat.style.display = 'block';
        });
    } else {
        // Mostrar apenas a categoria selecionada
        videoCategories.forEach(cat => {
            if (cat.getAttribute('data-category') === category) {
                cat.style.display = 'block';
            } else {
                cat.style.display = 'none';
            }
        });
    }
    
    // Animação de entrada
    setTimeout(() => {
        document.querySelectorAll('.video-card').forEach((card, index) => {
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
        });
    }, 100);
}

function openVideoModal(videoCard) {
    const modal = document.getElementById('videoModal');
    const videoInfo = videoCard.querySelector('.video-info');
    
    // Coletar informações do vídeo
    const title = videoInfo.querySelector('h4').textContent;
    const description = videoInfo.querySelector('.video-description').textContent;
    const duration = videoCard.querySelector('.video-duration').textContent;
    const views = videoInfo.querySelector('.video-views').textContent.replace('▶ ', '');
    const level = videoInfo.querySelector('.video-level').textContent;
    
    // Configurar modal
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('modalDuration').textContent = duration;
    document.getElementById('modalViews').textContent = views;
    document.getElementById('modalLevel').textContent = level;
    
    // Aqui você pode configurar o iframe com o vídeo real
    // Por enquanto, usaremos um vídeo placeholder
    const videoIframe = document.getElementById('videoIframe');
    videoIframe.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoIframe');
    
    // Parar o vídeo
    videoIframe.src = '';
    
    // Fechar modal
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .video-card {
        animation: fadeInUp 0.5s ease both;
    }
`;
document.head.appendChild(style);


// Funções para a Seção de Anúncios
function initializeAnnouncements() {
    // Filtro de categorias
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class de todos os botões
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Adiciona active class ao botão clicado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterAnnouncements(filter);
        });
    });

    // Event listeners para botões "Ler Mais"
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const articleId = this.getAttribute('data-article');
            openArticleModal(articleId);
        });
    });

    // Event listeners para cards de anúncio
    document.querySelectorAll('.announcement-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Não abrir modal se clicar nos botões de ação
            if (!e.target.closest('.card-actions')) {
                const category = this.getAttribute('data-category');
                const title = this.querySelector('h3').textContent;
                openArticleModal('custom', { title, category, element: this });
            }
        });
    });

    // Botões de salvar
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const articleId = this.getAttribute('data-article');
            saveArticle(articleId, this);
        });
    });

    // Botões de compartilhar
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const articleId = this.getAttribute('data-article');
            shareArticle(articleId);
        });
    });

    // Fechar modal
    document.querySelector('.close-article-modal').addEventListener('click', closeArticleModal);
    
    // Fechar modal clicando fora
    document.getElementById('articleModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeArticleModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeArticleModal();
        }
    });

    // Botões do modal
    document.querySelector('.download-btn').addEventListener('click', downloadArticle);
    document.querySelector('.print-btn').addEventListener('click', printArticle);
    document.querySelector('.share-article-btn').addEventListener('click', shareCurrentArticle);
}

function filterAnnouncements(filter) {
    const announcementCards = document.querySelectorAll('.announcement-card');
    
    if (filter === 'all') {
        // Mostrar todos os anúncios
        announcementCards.forEach(card => {
            card.style.display = 'block';
        });
    } else {
        // Mostrar apenas anúncios da categoria selecionada
        announcementCards.forEach(card => {
            if (card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Animação de entrada
    setTimeout(() => {
        document.querySelectorAll('.announcement-card').forEach((card, index) => {
            if (card.style.display !== 'none') {
                card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
            }
        });
    }, 100);
}

function openArticleModal(articleId, customData = null) {
    const modal = document.getElementById('articleModal');
    
    if (customData) {
        // Modal para card customizado
        document.getElementById('articleTitle').textContent = customData.title;
        document.getElementById('articleCategory').textContent = getCategoryName(customData.category);
        document.getElementById('articleCategory').className = `category-badge ${customData.category}`;
        
        // Coletar informações do card
        const card = customData.element;
        const date = card.querySelector('.date').textContent;
        const author = card.querySelector('.author').textContent;
        const excerpt = card.querySelector('.card-excerpt').textContent;
        
        document.getElementById('articleDate').textContent = date;
        document.getElementById('articleAuthor').textContent = author;
        
        // Conteúdo expandido (em uma aplicação real, isso viria de uma API)
        const fullContent = generateFullContent(articleId, excerpt);
        document.getElementById('articleFullContent').innerHTML = fullContent;
    } else {
        // Modal para artigos pré-definidos
        const articleData = getArticleData(articleId);
        document.getElementById('articleTitle').textContent = articleData.title;
        document.getElementById('articleCategory').textContent = articleData.category;
        document.getElementById('articleCategory').className = `category-badge ${articleData.category}`;
        document.getElementById('articleDate').textContent = articleData.date;
        document.getElementById('articleAuthor').textContent = articleData.author;
        document.getElementById('articleFullContent').innerHTML = articleData.content;
    }
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
    const modal = document.getElementById('articleModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function getCategoryName(category) {
    const categories = {
        'legislacao': '⚖️ Legislação',
        'tecnologia': '💻 Tecnologia',
        'carreira': '🚀 Carreira',
        'feriados': '📅 Feriados',
        'cursos': '🎓 Cursos'
    };
    return categories[category] || '📰 Geral';
}

function getArticleData(articleId) {
    const articles = {
        'lei-trabalhista': {
            title: 'Nova Lei Trabalhista 2024 - O que muda para o administrativo?',
            category: 'legislacao',
            date: '📅 15 Mar 2024',
            author: 'Por: Departamento Jurídico',
            content: `
                <p>As novas alterações na legislação trabalhista trazem mudanças significativas para os profissionais administrativos. As principais mudanças incluem:</p>
                
                <h4>🎯 Jornada de Trabalho</h4>
                <p>• Flexibilização do banco de horas<br>
                • Novas regras para trabalho remoto<br>
                • Direito à desconexão digital</p>
                
                <h4>💼 Home Office</h4>
                <p>• Equipamentos devem ser fornecidos pela empresa<br>
                • Auxílio internet obrigatório<br>
                • Direito a horas extras mesmo no regime remoto</p>
                
                <h4>📊 Próximos Passos</h4>
                <p>Os departamentos administrativos devem atualizar seus procedimentos até 30/06/2024. Recomendamos:</p>
                <p>• Revisar contratos de trabalho<br>
                • Atualizar política de home office<br>
                • Capacitar a equipe sobre as novas normas</p>
                
                <p><strong>📞 Dúvidas?</strong> Entre em contato com o jurídico corporativo.</p>
            `
        }
        // Adicione mais artigos conforme necessário
    };
    
    return articles[articleId] || {
        title: 'Artigo não encontrado',
        category: 'geral',
        date: '📅 --/--/----',
        author: 'Por: Sistema',
        content: '<p>O conteúdo deste artigo não está disponível no momento.</p>'
    };
}

function generateFullContent(articleId, excerpt) {
    // Em uma aplicação real, isso viria de uma API
    return `
        <p>${excerpt}</p>
        
        <h4>📋 Detalhes Importantes</h4>
        <p>Este é um conteúdo expandido do artigo. Em uma implementação real, aqui estaria o texto completo da notícia ou comunicado.</p>
        
        <h4>🎯 Ações Recomendadas</h4>
        <ul>
            <li>Revisar os procedimentos atuais</li>
            <li>Comunicar a equipe sobre as mudanças</li>
            <li>Atualizar documentação necessária</li>
            <li>Agendar treinamentos se necessário</li>
        </ul>
        
        <h4>📞 Suporte</h4>
        <p>Para mais informações, entre em contato com o departamento responsável.</p>
    `;
}

function saveArticle(articleId, button) {
    // Simular salvamento
    button.innerHTML = '✅ Salvo';
    button.style.background = '#27ae60';
    button.style.color = 'white';
    
    setTimeout(() => {
        button.innerHTML = '📌 Salvar';
        button.style.background = '';
        button.style.color = '';
    }, 2000);
    
    // Aqui você implementaria a lógica real de salvamento
    console.log(`Artigo ${articleId} salvo`);
}

function shareArticle(articleId) {
    // Simular compartilhamento
    if (navigator.share) {
        navigator.share({
            title: 'HELP VAREJO - Artigo',
            text: 'Confira este artigo importante',
            url: window.location.href
        });
    } else {
        alert('Artigo compartilhado! Em uma implementação real, isso abriria opções de compartilhamento.');
    }
}

function downloadArticle() {
    alert('📥 Download iniciado! Em uma implementação real, isso baixaria um PDF do artigo.');
}

function printArticle() {
    window.print();
}

function shareCurrentArticle() {
    const title = document.getElementById('articleTitle').textContent;
    alert(`Compartilhando: "${title}"`);
}


// Adicione esta animação CSS via JavaScript
const faqStyle = document.createElement('style');
faqStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .faq-item {
        animation: fadeInUp 0.5s ease both;
    }
`;
document.head.appendChild(faqStyle);