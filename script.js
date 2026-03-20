// Seleção de elementos importantes
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const themeToggleBtn = document.getElementById('themToggleBtn');
const dropzones = document.querySelectorAll('.dropzone');

// Variável auxiliar usada para arrastar em touch e desktop
let draggedCard = null;

// Dark mode: carrega preferência salva e alterna tema
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.innerText = '☀️';
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeToggleBtn.innerText = isDarkMode ? '☀️' : '🌙';
});

// Suporte a touch no iPhone para o botão de tema
themeToggleBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeToggleBtn.innerText = isDarkMode ? '☀️' : '🌙';
});

// Função reutilizável para adicionar um nova tarefa
function addNewTask() {
    const text = taskInput.value.trim();
    if (text) {
        createCard(text, 'todo');
        taskInput.value = '';
        taskInput.focus();
    }
}

// Evento: ao clicar no botão de adicionar, cria um novo card na coluna 'todo'
addTaskBtn.addEventListener('click', addNewTask);

// Evento: pressionar Enter no input também adiciona um novo card
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addNewTask();
    }
});

// Suporte a touch no iPhone para o botão de adicionar
addTaskBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    addNewTask();
});

/**
 * Cria um card com texto e adiciona na coluna indicada.
 * Cada card contém:
 * - um elemento `.card-text` com o título
 * - um botão `.delete-btn` para remover o card
 * - suporte a edição com duplo clique
 * - suporte a drag (desktop) e touch (celular)
 */
function createCard(text, columnId) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.draggable = true;

    // Texto do card (separado para facilitar edição)
    const textSpan = document.createElement('span');
    textSpan.classList.add('card-text');
    textSpan.innerText = text;

    // Botão de excluir
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.setAttribute('aria-label', 'Excluir tarefa');
    deleteBtn.innerText = '✕';

    // Função para remover o card
    function removeCard() {
        card.remove();
    }

    // Evita que o clique no botão dispare eventos pais (ex.: edição ou drag)
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeCard();
    });

    // Suporte a touch no iPhone (toque direto no botão)
    deleteBtn.addEventListener('touchend', (e) => {
        e.stopPropagation();
        e.preventDefault();
        removeCard();
    });

    // Edição inline: duplo clique substitui o texto por um input
    card.addEventListener('dblclick', () => {
        startEditing();
    });

    // Função reutilizável para iniciar a edição do card
    function startEditing() {
        const input = document.createElement('input');
        input.value = textSpan.innerText;
        card.innerHTML = '';
        card.appendChild(input);
        // adiciona botões após o input
        card.appendChild(editBtn);
        card.appendChild(deleteBtn);
        input.focus();

        input.addEventListener('blur', () => {
            textSpan.innerText = input.value || 'Tarefa sem nome';
            card.innerHTML = '';
            card.appendChild(textSpan);
            card.appendChild(editBtn);
            card.appendChild(deleteBtn);
        });
    }

    // Botão de editar (visível)
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.setAttribute('aria-label', 'Editar tarefa');
    editBtn.innerText = '✎';
    // Clicar em editar abre o input de edição
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startEditing();
    });

    // Suporte a touch no iPhone (toque direto no botão)
    editBtn.addEventListener('touchend', (e) => {
        e.stopPropagation();
        e.preventDefault();
        startEditing();
    });

    // Drag no desktop: marca o card como 'dragging' e guarda referência
    card.addEventListener('dragstart', () => {
        draggedCard = card;
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        draggedCard = null;
    });

    // Touch (celular): usa touch events para permitir mover entre dropzones
    // Além disso detecta um 'tap' curto (toque sem movimento) para abrir a edição
    let touchStartTime = 0;
    let touchMoved = false;

    card.addEventListener('touchstart', (e) => {
        draggedCard = card;
        card.classList.add('dragging');
        touchMoved = false;
        touchStartTime = Date.now();
    });

    card.addEventListener('touchmove', (e) => {
        touchMoved = true; // houve movimento — não é um simples tap
        e.preventDefault();
        const touch = e.touches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropzone = elementBelow?.closest('.dropzone');
        if (dropzone && draggedCard) {
            dropzone.appendChild(draggedCard);
        }
    });

    card.addEventListener('touchend', (e) => {
        const duration = Date.now() - touchStartTime;
        // Se não houve movimento e o toque foi curto, considera-se um tap -> abrir edição
        if (!touchMoved && duration < 500) {
            // Reutiliza o fluxo de edição usado no dblclick
            const input = document.createElement('input');
            input.value = textSpan.innerText;
            card.innerHTML = '';
            card.appendChild(input);
            card.appendChild(editBtn);
            card.appendChild(deleteBtn);
            input.focus();

            input.addEventListener('blur', () => {
                textSpan.innerText = input.value || 'Tarefa sem nome';
                card.innerHTML = '';
                card.appendChild(textSpan);
                card.appendChild(editBtn);
                card.appendChild(deleteBtn);
            });
        }

        if (draggedCard) {
            draggedCard.classList.remove('dragging');
            draggedCard = null;
        }
    });

    // Monta o card e anexa na coluna (texto + editar + excluir)
    card.appendChild(textSpan);
    card.appendChild(editBtn);
    card.appendChild(deleteBtn);
    document.getElementById(columnId).appendChild(card);
}

// Dropzones (desktop): permite soltar cards arrastados
dropzones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingCard = document.querySelector('.dragging') || draggedCard;
        if (draggingCard) {
            zone.appendChild(draggingCard);
        }
    });
});