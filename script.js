const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const dropzones = document.querySelectorAll('.dropzone');

let draggedCard = null;

// Adicionar card
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

    // ✏️ Editar card
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

    // 🖱️ DRAG (PC)
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    // 📱 TOUCH (CELULAR)

    card.addEventListener('touchstart', () => {
        draggedCard = card;
        card.classList.add('dragging');
    });

    card.addEventListener('touchmove', (e) => {
        e.preventDefault();

        const touch = e.touches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);

        const dropzone = elementBelow?.closest('.dropzone');
        if (dropzone && draggedCard) {
            dropzone.appendChild(draggedCard);
        }
    });

    card.addEventListener('touchend', () => {
        if (draggedCard) {
            draggedCard.classList.remove('dragging');
            draggedCard = null;
        }
    });

    document.getElementById(columnId).appendChild(card);
}

// Dropzones (PC)
dropzones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingCard = document.querySelector('.dragging');
        if (draggingCard) {
            zone.appendChild(draggingCard);
        }
    });
});