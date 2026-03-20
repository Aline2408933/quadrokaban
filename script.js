/**
 * Gerenciamento de Estado e Manipulação do DOM
 */
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const dropzones = document.querySelectorAll('.dropzone');

// 1. Adicionar novo card
addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
        createCard(text, 'todo');
        taskInput.value = '';
    }
});

function createCard(text, columnId) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.draggable = true;
    card.innerText = text;

    // Evento de edição (Double Click)
    card.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.value = card.innerText;
        card.innerHTML = '';
        card.appendChild(input);
        input.focus();

        input.addEventListener('blur', () => {
            card.innerText = input.value || "Tarefa sem nome";
        });
    });

    // 2. Drag and Drop API
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    document.getElementById(columnId).appendChild(card);
}

// 3. Lógica das Dropzones
dropzones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessário para permitir o drop
        const draggingCard = document.querySelector('.dragging');
        zone.appendChild(draggingCard);
    });
});