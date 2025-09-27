// Aplicación principal para 1+ con geolocalización y funciones avanzadas
class SportMatchApp {
    constructor() {
        this.availableUsers = [];
        this.currentCardIndex = 0;
        this.currentChatUser = null;
        this.userLocation = null;
        this.initEventListeners();
        this.detectUserLocation();
    }

    initEventListeners() {
        // Navegación principal
        document.getElementById('likeBtn').addEventListener('click', () => this.handleLike());
        document.getElementById('dislikeBtn').addEventListener('click', () => this.handleDislike());
        document.getElementById('backToMain').addEventListener('click', () => this.showScreen('mainScreen'));
        
        // Filtros
        document.getElementById('filterBtn').addEventListener('click', () => this.toggleFilters());
        document.getElementById('filterDistance').addEventListener('change', () => this.loadUsers());
        document.getElementById('filterSport').addEventListener('change', () => this.loadUsers());
        document.getElementById('filterAge').addEventListener('change', () => this.loadUsers());
        
        // Chat
        document.getElementById('sendMessage').addEventListener('click', () => this.sendMessage());
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    detectUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.updateLocationDisplay();
                    this.loadUsers();
                },
                (error) => {
                    // Ubicación predeterminada (Buenos Aires) si falla la detección
                    this.userLocation = { lat: -34.6037, lng: -58.3816 };
                    this.updateLocationDisplay();
                    this.loadUsers();
                    console.log('Usando ubicación predeterminada');
                }
            );
        } else {
            this.userLocation = { lat: -34.6037, lng: -58.3816 };
            this.updateLocationDisplay();
            this.loadUsers();
        }
    }

    updateLocationDisplay() {
        const locationElement = document.getElementById('userLocation');
        if (locationElement && this.userLocation) {
            locationElement.textContent = `📍 ${this.userLocation.lat.toFixed(4)}, ${this.userLocation.lng.toFixed(4)}`;
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    toggleFilters() {
        const filtersPanel = document.getElementById('filtersPanel');
        filtersPanel.classList.toggle('active');
    }

    loadUsers() {
        if (!this.userLocation) return;

        const distanceFilter = parseInt(document.getElementById('filterDistance').value);
        const sportFilter = document.getElementById('filterSport').value;
        const ageFilter = document.getElementById('filterAge').value;

        this.availableUsers = auth.users.filter(user => {
            // Excluir al usuario actual y matches existentes
            if (user.id === auth.currentUser.id || auth.currentUser.matches.includes(user.id)) {
                return false;
            }

            // Filtrar por distancia
            const distance = auth.calculateDistance(
                this.userLocation.lat, this.userLocation.lng,
                user.location.lat, user.location.lng
            );
            if (distance > distanceFilter) return false;

            // Filtrar por deporte
            if (sportFilter && !user.sports.includes(sportFilter)) return false;

            // Filtrar por edad
            if (ageFilter) {
                const [minAge, maxAge] = ageFilter === '46+' ? [46, 100] : ageFilter.split('-').map(Number);
                if (user.age < minAge || user.age > maxAge) return false;
            }

            return true;
        });

        // Ordenar por distancia
        this.availableUsers.sort((a, b) => {
            const distA = auth.calculateDistance(
                this.userLocation.lat, this.userLocation.lng,
                a.location.lat, a.location.lng
            );
            const distB = auth.calculateDistance(
                this.userLocation.lat, this.userLocation.lng,
                b.location.lat, b.location.lng
            );
            return distA - distB;
        });

        this.currentCardIndex = 0;
        this.displayCurrentUser();
    }

    displayCurrentUser() {
        const container = document.getElementById('userCards');
        container.innerHTML = '';

        if (this.availableUsers.length === 0) {
            container.innerHTML = `
                <div class="user-card">
                    <h3>¡No hay más usuarios cerca!</h3>
                    <p>Intenta aumentar la distancia de búsqueda o cambiar los filtros</p>
                </div>
            `;
            return;
        }

        const user = this.availableUsers[this.currentCardIndex];
        const distance = auth.calculateDistance(
            this.userLocation.lat, this.userLocation.lng,
            user.location.lat, user.location.lng
        );

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
            <div class="user-distance">${distance.toFixed(1)} km</div>
            <h3>${user.firstName} ${user.lastName}</h3>
            <div class="user-age">${user.age} años</div>
            
            <div class="user-sports">
                ${user.sports.map(sport => 
                    `<span class="sport-tag">${sportEmojis[sport]} ${this.getSportName(sport)}</span>`
                ).join('')}
            </div>
            
            <div class="user-zones">
                <strong>Zonas:</strong> ${user.zones.join(', ')}
            </div>
            
            <div class="user-schedule">
                <strong>Disponible:</strong> ${this.getAvailabilityText(user.availability)}
            </div>
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

    getAvailabilityText(availability) {
        const days = {
            'lunes': 'Lun', 'martes': 'Mar', 'miercoles': 'Mié', 
            'jueves': 'Jue', 'viernes': 'Vie', 'sabado': 'Sáb', 'domingo': 'Dom'
        };
        
        return Object.entries(availability)
            .map(([day, time]) => `${days[day] || day} ${time}`)
            .join(', ');
    }

    handleLike() {
        if (this.availableUsers.length === 0) return;

        const likedUser = this.availableUsers[this.currentCardIndex];
        const distance = auth.calculateDistance(
            this.userLocation.lat, this.userLocation.lng,
            likedUser.location.lat, likedUser.location.lng
        );
        
        // Agregar match
        auth.currentUser.matches.push(likedUser.id);
        
        // Actualizar en localStorage
        const userIndex = auth.users.findIndex(u => u.id === auth.currentUser.id);
        auth.users[userIndex] = auth.currentUser;
        localStorage.setItem('1plus_users', JSON.stringify(auth.users));
        
        alert(`¡Match con ${likedUser.firstName}! Está a ${distance.toFixed(1)} km de ti`);
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
        const distance = auth.calculateDistance(
            this.userLocation.lat, this.userLocation.lng,
            user.location.lat, user.location.lng
        );

        document.getElementById('chatWith').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('chatAge').textContent = `${user.age} años`;
        document.getElementById('chatDistance').textContent = `${distance.toFixed(1)} km`;
        
        this.loadChatMessages();
        this.showScreen('chatScreen');
    }

    loadChatMessages() {
        const container = document.getElementById('chatMessages');
        container.innerHTML = '';
        
        // Mensaje de bienvenida automático
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'message other';
        welcomeMsg.textContent = `¡Hola! Soy ${this.currentChatUser.firstName}. ¿Quieres coordinar para jugar ${this.currentChatUser.sports.map(s => this.getSportName(s)).join(' o ')}?`;
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

        // Respuesta automática (simulada) basada en deportes del usuario
        setTimeout(() => {
            const sports = this.currentChatUser.sports;
            const mainSport = this.getSportName(sports[0]);
            
            const responses = [
                `¡Suena bien! ¿Qué día te viene mejor para jugar ${mainSport}?`,
                `Perfecto, yo también estoy disponible en ${this.currentChatUser.zones[0]}`,
                `¿Quieres que nos juntemos este fin de semana? Puedo en ${this.getAvailabilityText(this.currentChatUser.availability)}`,
                `¡Genial! ¿Conoces algún lugar para jugar ${mainSport} por la zona?`,
                `Me encantaría coordinar, ¿qué horario prefieres? Yo tengo disponible: ${this.getAvailabilityText(this.currentChatUser.availability)}`
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

    // Método para buscar usuarios por deporte y ubicación
    searchUsersBySportAndLocation(sport, maxDistance = 10) {
        return auth.users.filter(user => {
            if (user.id === auth.currentUser.id) return false;
            
            const distance = auth.calculateDistance(
                this.userLocation.lat, this.userLocation.lng,
                user.location.lat, user.location.lng
            );
            
            return user.sports.includes(sport) && distance <= maxDistance;
        });
    }

    // Método para obtener usuarios compatibles por horarios
    getCompatibleUsersBySchedule() {
        const currentUserSchedule = auth.currentUser.availability;
        
        return auth.users.filter(user => {
            if (user.id === auth.currentUser.id) return false;
            
            // Verificar compatibilidad de horarios
            for (const day in currentUserSchedule) {
                if (user.availability[day]) {
                    // Aquí se podría implementar lógica más avanzada de comparación de horarios
                    return true;
                }
            }
            return false;
        });
    }
}

const app = new SportMatchApp();
