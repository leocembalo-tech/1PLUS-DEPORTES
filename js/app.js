// Aplicación principal para 1+
class SportMatchApp {
    constructor() {
        this.availableUsers = [];
        this.currentCardIndex = 0;
        this.currentChatUser = null;
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('likeBtn').addEventListener('click', () => this.handleLike());
        document.getElementById('dislikeBtn').addEventListener('click', () => this.handleDislike());
        document.getElementById('filterSport').addEventListener('change', () => this.loadUsers());
        document.getElementById('filterSchedule').addEventListener('change', () => this.loadUsers());
        document.getElementById('backToMain').addEventListener('click', () => this.showScreen('mainScreen'));
        document.getElementById('sendMessage').addEventListener('click', () => this.sendMessage());
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    loadUsers() {
        const sportFilter = document.getElementById('filterSport').value;
        const scheduleFilter = document.getElementById('filterSchedule').value;

        this.availableUsers = auth.users.filter(user => {
            if (user.id === auth.currentUser.id || auth.currentUser.matches.includes(user.id)) {
                return false;
            }

            if (sportFilter && user.sport !== sportFilter) return false;
            if (scheduleFilter && !user.schedules.includes(scheduleFilter)) return false;

            return true;
        });

        this.currentCardIndex = 0;
        this.displayCurrentUser();
    }

    displayCurrentUser() {
        const container = document.getElementById('userCards');
        container.innerHTML = '';

        if (this.availableUsers.length === 0) {
            container.innerHTML = '<div class="user-card"><h3>¡No hay más usuarios!</h3><p>Intenta cambiar los filtros</p></div>';
            return;
        }

        const user = this.availableUsers[this.currentCardIndex];
        const sportEmojis = {
            'futbol': '⚽', 'tennis': '🎾', 'hockey': '🏒', 'basquet': '🏀',
            'rugby': '🏉', 'paddle': '🎯', 'ciclismo': '🚴', 'natacion': '🏊',
            'boxeo': '🥊', 'artes-marciales': '🥋', 'voleibol': '🏐', 'badminton': '🏸',
            'tenis-mesa': '🏓', 'golf': '⛳', 'atletismo': '🏃', 'gimnasio': '🏋️',
            'yoga': '🧘', 'gimnasia': '🤸', 'frisbee': '🥏', 'skate': '🛹'
        };

        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <h3>${user.fullName}</h3>
            <p>${sportEmojis[user.sport]} ${this.getSportName(user.sport)}</p>
            <p>📍 ${user.zone}</p>
            <p>🕐 ${this.getSchedulesText(user.schedules)}</p>
        `;

        container.appendChild(userCard);
    }

    getSportName(sportKey) {
        const sports = {
            'futbol': 'Fútbol', 'tennis': 'Tenis', 'hockey': 'Hockey', 'basquet': 'Baloncesto',
            'rugby': 'Rugby', 'paddle': 'Pádel', 'ciclismo': 'Ciclismo', 'natacion': 'Natación',
            'boxeo': 'Boxeo', 'artes-marciales': 'Artes marciales', 'voleibol': 'Voleibol',
            'badminton': 'Bádminton', 'tenis-mesa': 'Tenis de mesa', 'golf': 'Golf',
            'atletismo': 'Atletismo', 'gimnasio': 'Gimnasio', 'yoga': 'Yoga', 'gimnasia': 'Gimnasia',
            'frisbee': 'Ultimate Frisbee', 'skate': 'Skateboarding'
        };
        return sports[sportKey] || sportKey;
    }

    getSchedulesText(schedules) {
        const scheduleNames = {
            'morning': 'Mañanas', 'afternoon': 'Tardes', 
            'evening': 'Noches', 'weekend': 'Fines de semana'
        };
        return schedules.map(s => scheduleNames[s]).join(', ');
    }

    handleLike() {
        if (this.availableUsers.length === 0) return;

        const likedUser = this.availableUsers[this.currentCardIndex];
        
        // Agregar match
        auth.currentUser.matches.push(likedUser.id);
        
        // Actualizar en localStorage
        const userIndex = auth.users.findIndex(u => u.id === auth.currentUser.id);
        auth.users[userIndex] = auth.currentUser;
        localStorage.setItem('1plus_users', JSON.stringify(auth.users));
        
        alert(`¡Match con ${likedUser.fullName}! Ahora pueden chatear`);
        this.openChat(likedUser);
    }

    handleDislike() {
        this.currentCardIndex++;
        if (this.currentCardIndex >= this.availableUsers.length) {
            this.currentCardIndex = 0;
        }
        this.displayCurrentUser();
    }

    openChat(user) {
        this.currentChatUser = user;
        document.getElementById('chatWith').textContent = user.fullName;
        document.getElementById('chatSport').textContent = this.getSportName(user.sport);
        
        this.loadChatMessages();
        this.showScreen('chatScreen');
    }

    loadChatMessages() {
        const container = document.getElementById('chatMessages');
        container.innerHTML = '';
        
        // Mensaje de bienvenida automático
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'message other';
        welcomeMsg.textContent = `¡Hola! Soy ${this.currentChatUser.fullName}. ¿Quieres coordinar para jugar ${this.getSportName(this.currentChatUser.sport)}?`;
        container.appendChild(welcomeMsg);
        
        container.scrollTop = container.scrollHeight;
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (message === '') return;

        const container = document.getElementById('chatMessages');
        
        // Mensaje del usuario actual
        const userMsg = document.createElement('div');
        userMsg.className = 'message own';
        userMsg.textContent = message;
        container.appendChild(userMsg);

        // Respuesta automática (simulada)
        setTimeout(() => {
            const responses = [
                "¡Suena bien! ¿Qué día te viene mejor?",
                "Perfecto, yo también estoy disponible",
                "¿Quieres que nos juntemos este fin de semana?",
                "¡Genial! ¿Conoces algún lugar para jugar?",
                "Me encantaría coordinar, ¿qué horario prefieres?"
            ];
            const autoResponse = document.createElement('div');
            autoResponse.className = 'message other';
            autoResponse.textContent = responses[Math.floor(Math.random() * responses.length)];
            container.appendChild(autoResponse);
            
            container.scrollTop = container.scrollHeight;
        }, 1000);

        input.value = '';
        container.scrollTop = container.scrollHeight;
    }
}

const app = new SportMatchApp();
