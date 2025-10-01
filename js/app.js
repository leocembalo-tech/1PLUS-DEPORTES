// Aplicación principal para 1+ con sistema completo de canchas
class SportMatchApp {
    constructor() {
        this.availableUsers = [];
        this.currentCardIndex = 0;
        this.currentChatUser = null;
        this.currentCourt = null;
        this.selectedPlayer = null;
        this.userLocation = null;
        this.courtsData = [];
        this.initEventListeners();
        this.loadCourtsData();
        this.detectUserLocation();
    }

    initEventListeners() {
        // Navegación principal
        document.getElementById('likeBtn').addEventListener('click', () => this.handleLike());
        document.getElementById('dislikeBtn').addEventListener('click', () => this.handleDislike());
        document.getElementById('backToMain').addEventListener('click', () => this.showScreen('mainScreen'));
        
        // Navegación canchas
        document.getElementById('goToMap').addEventListener('click', () => this.showMapScreen());
        document.getElementById('backToMainFromMap').addEventListener('click', () => this.showScreen('mainScreen'));
        document.getElementById('backToMap').addEventListener('click', () => this.showScreen('mapScreen'));
        document.getElementById('backToCourt').addEventListener('click', () => this.showCourtDetail());
        document.getElementById('backToProfile').addEventListener('click', () => this.showPlayerProfile());

        // Filtros
        document.getElementById('filterSport').addEventListener('change', () => this.loadUsers());
        document.getElementById('filterSchedule').addEventListener('change', () => this.loadUsers());
        document.getElementById('mapSportFilter').addEventListener('change', () => this.filterCourts());
        document.getElementById('mapDistanceFilter').addEventListener('change', () => this.filterCourts());

        // Chat
        document.getElementById('sendMessage').addEventListener('click', () => this.sendMessage());
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Chat directo
        document.getElementById('sendDirectMessage').addEventListener('click', () => this.sendDirectMessage());
        document.getElementById('directMessageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendDirectMessage();
        });

        // Invitar a jugar
        document.getElementById('inviteToPlay').addEventListener('click', () => this.inviteToPlay());

        // Delegación de eventos para elementos dinámicos
        document.addEventListener('click', (e) => {
            // Botones ver cancha
            if (e.target.classList.contains('view-court-btn')) {
                const courtId = e.target.getAttribute('data-court');
                this.showCourtDetail(courtId);
            }
            
            // Botones seleccionar jugador
            if (e.target.classList.contains('select-player-btn')) {
                const playerId = e.target.getAttribute('data-player');
                this.showPlayerProfile(playerId);
            }
            
            // Marcadores del mapa
            if (e.target.classList.contains('court-marker')) {
                const courtId = e.target.getAttribute('data-court');
                this.showCourtDetail(courtId);
            }
        });
    }

    loadCourtsData() {
        this.courtsData = [
            {
                id: 1,
                name: "Cancha Los Pinos",
                address: "Av. Libertador 1234",
                sport: "futbol",
                coordinates: { lat: -34.588, lng: -58.430 },
                rating: 4.5,
                reviews: 24,
                price: 800,
                capacity: 14,
                features: ["Iluminación", "Vestuarios", "Estacionamiento"],
                availablePlayers: 8
            },
            {
                id: 2,
                name: "Club Tenis Norte",
                address: "Av. Cabildo 2345", 
                sport: "tennis",
                coordinates: { lat: -34.560, lng: -58.458 },
                rating: 4.8,
                reviews: 18,
                price: 1200,
                capacity: 4,
                features: ["Cesped sintético", "Duchas", "Bar"],
                availablePlayers: 4
            },
            {
                id: 3,
                name: "Polideportivo Central",
                address: "Av. Corrientes 3456",
                sport: "basquet",
                coordinates: { lat: -34.610, lng: -58.441 },
                rating: 4.2,
                reviews: 32,
                price: 600,
                capacity: 10,
                features: ["Techado", "Iluminación", "Graderas"],
                availablePlayers: 6
            }
        ];
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
                    this.filterCourts();
                },
                (error) => {
                    // Ubicación predeterminada (Buenos Aires)
                    this.userLocation = { lat: -34.6037, lng: -58.3816 };
                    this.updateLocationDisplay();
                    this.loadUsers();
                    this.filterCourts();
                },
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 300000
                }
            );
        } else {
            this.userLocation = { lat: -34.6037, lng: -58.3816 };
            this.updateLocationDisplay();
            this.loadUsers();
            this.filterCourts();
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

    // ========== SISTEMA DE CANCHAS ==========

    showMapScreen() {
        this.showScreen('mapScreen');
        this.filterCourts();
    }

    filterCourts() {
        if (!this.userLocation) return;

        const sportFilter = document.getElementById('mapSportFilter').value;
        const distanceFilter = parseInt(document.getElementById('mapDistanceFilter').value);

        const filteredCourts = this.courtsData.filter(court => {
            // Filtrar por deporte
            if (sportFilter && court.sport !== sportFilter) return false;

            // Filtrar por distancia
            const distance = this.calculateDistance(
                this.userLocation.lat, this.userLocation.lng,
                court.coordinates.lat, court.coordinates.lng
            );
            return distance <= distanceFilter;
        });

        this.displayCourts(filteredCourts);
    }

    displayCourts(courts) {
        const courtsList = document.querySelector('.courts-list');
        courtsList.innerHTML = '';

        courts.forEach(court => {
            const distance = this.calculateDistance(
                this.userLocation.lat, this.userLocation.lng,
                court.coordinates.lat, court.coordinates.lng
            );

            const courtCard = document.createElement('div');
            courtCard.className = 'court-card';
            courtCard.setAttribute('data-court', court.id);
            courtCard.innerHTML = `
                <div class="court-icon">${this.getSportEmoji(court.sport)}</div>
                <div class="court-info">
                    <h3>${court.name}</h3>
                    <p>${court.address} · ${distance.toFixed(1)} km</p>
                    <div class="court-stats">
                        <span class="players-online">👥 ${court.availablePlayers} disponibles</span>
                        <span class="court-rating">⭐ ${court.rating}</span>
                    </div>
                </div>
                <button class="view-court-btn" data-court="${court.id}">Ver</button>
            `;
            courtsList.appendChild(courtCard);
        });

        // Mostrar mensaje si no hay canchas
        if (courts.length === 0) {
            courtsList.innerHTML = `
                <div class="court-card">
                    <div class="court-info">
                        <h3>No hay canchas cerca</h3>
                        <p>Intenta aumentar la distancia de búsqueda</p>
                    </div>
                </div>
            `;
        }
    }

    showCourtDetail(courtId) {
        const court = this.courtsData.find(c => c.id == courtId);
        if (!court) return;

        this.currentCourt = court;
        
        const distance = this.calculateDistance(
            this.userLocation.lat, this.userLocation.lng,
            court.coordinates.lat, court.coordinates.lng
        );

        // Actualizar información de la cancha
        document.getElementById('courtName').textContent = `${this.getSportEmoji(court.sport)} ${court.name}`;
        document.getElementById('courtAddress').textContent = `${court.address} · ${distance.toFixed(1)} km`;
        document.getElementById('playersCount').textContent = court.availablePlayers;

        // Actualizar detalles
        const detailCard = document.querySelector('.court-detail-card');
        detailCard.innerHTML = `
            <div class="court-meta">
                <span class="rating">⭐ ${court.rating} (${court.reviews} reviews)</span>
                <span class="price">💵 $${court.price}/hora</span>
                <span class="capacity">👥 Máx: ${court.capacity} jugadores</span>
            </div>
            
            <div class="court-features">
                ${court.features.map(feature => `<span class="feature">${this.getFeatureEmoji(feature)} ${feature}</span>`).join('')}
            </div>
        `;

        // Cargar jugadores disponibles para esta cancha/deporte
        this.loadAvailablePlayers(court.sport);
        this.showScreen('courtDetailScreen');
    }

    loadAvailablePlayers(sport) {
        const availablePlayers = auth.users.filter(user => 
            user.id !== auth.currentUser.id && 
            user.sports.includes(sport)
        );

        const playersContainer = document.querySelector('.available-players');
        const playersList = playersContainer.querySelector('.player-card') ? 
            playersContainer.querySelector('.player-card').parentNode : 
            document.createElement('div');
            
        playersList.innerHTML = '';

        availablePlayers.forEach((player, index) => {
            if (index >= 5) return; // Mostrar máximo 5 jugadores

            const distance = this.calculateDistance(
                this.userLocation.lat, this.userLocation.lng,
                player.location.lat, player.location.lng
            );

            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            playerCard.setAttribute('data-player', player.id);
            playerCard.innerHTML = `
                <div class="player-avatar">${player.firstName[0]}${player.lastName[0]}</div>
                <div class="player-info">
                    <h4>${player.firstName} ${player.lastName}</h4>
                    <p>${player.age} años · ⭐ 4.8 · ${distance.toFixed(1)} km</p>
                    <div class="player-stats">
                        <span class="sport-tag">${this.getSportEmoji(sport)} ${this.getSportName(sport)}</span>
                        <span class="level-badge ${index % 2 === 0 ? 'advanced' : 'intermediate'}">
                            ${index % 2 === 0 ? 'Avanzado' : 'Intermedio'}
                        </span>
                    </div>
                </div>
                <button class="select-player-btn" data-player="${player.id}">Elegir</button>
            `;
            playersList.appendChild(playerCard);
        });

        // Actualizar contador
        document.getElementById('playersCount').textContent = availablePlayers.length;
    }

    showPlayerProfile(playerId) {
        const player = auth.users.find(p => p.id == playerId);
        if (!player) return;

        this.selectedPlayer = player;

        const distance = this.calculateDistance(
            this.userLocation.lat, this.userLocation.lng,
            player.location.lat, player.location.lng
        );

        // Actualizar perfil
        document.getElementById('profileAvatar').textContent = player.firstName[0] + player.lastName[0];
        document.getElementById('profileName').textContent = `${player.firstName} ${player.lastName}`;
        document.getElementById('profileAge').textContent = `${player.age} años · ⭐ 4.8`;
        document.getElementById('profileDistance').textContent = `📍 A ${distance.toFixed(1)} km de ti`;

        // Actualizar deportes
        const sportsList = document.getElementById('profileSports');
        sportsList.innerHTML = player.sports.map(sport => `
            <div class="sport-level">
                <span class="sport-name">${this.getSportEmoji(sport)} ${this.getSportName(sport)}</span>
                <span class="level-badge advanced">Avanzado</span>
            </div>
        `).join('');

        this.showScreen('playerProfileScreen');
    }

    inviteToPlay() {
        if (!this.selectedPlayer) return;

        // Configurar chat directo
        document.getElementById('directChatWith').textContent = `${this.selectedPlayer.firstName} ${this.selectedPlayer.lastName}`;
        document.getElementById('directChatStatus').textContent = 'Conectado ahora · ⭐ 4.8';
        
        const chatMessages = document.getElementById('directChatMessages');
        chatMessages.innerHTML = `
            <div class="system-message">
                💬 Chat directo - Pueden coordinar para jugar
            </div>
            <div class="message other">
                ¡Hola! Vi que estás interesado en jugar ${this.currentCourt ? this.getSportName(this.currentCourt.sport) : 'fútbol'}. ¿Quieres coordinar?
            </div>
        `;

        this.showScreen('directChatScreen');
    }

    // ========== SISTEMA DE MATCHING ORIGINAL ==========

    loadUsers() {
        if (!this.userLocation) return;

        const sportFilter = document.getElementById('filterSport').value;
        const scheduleFilter = document.getElementById('filterSchedule').value;

        this.availableUsers = auth.users.filter(user => {
            if (user.id === auth.currentUser.id || auth.currentUser.matches.includes(user.id)) {
                return false;
            }

            // Filtrar por deporte
            if (sportFilter && !user.sports.includes(sportFilter)) return false;

            // Filtrar por horario (simplificado)
            if (scheduleFilter) {
                const userSchedules = Object.keys(user.availability || {});
                if (userSchedules.length === 0) return false;
            }

            return true;
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
                    <p>Intenta cambiar los filtros o buscar canchas</p>
                </div>
            `;
            return;
        }

        const user = this.availableUsers[this.currentCardIndex];
        const distance = this.calculateDistance(
            this.userLocation.lat, this.userLocation.lng,
            user.location.lat, user.location.lng
        );

        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-distance">${distance.toFixed(1)} km</div>
            <h3>${user.firstName} ${user.lastName}</h3>
            <div class="user-age">${user.age} años</div>
            
            <div class="user-sports">
                ${user.sports.map(sport => 
                    `<span class="sport-tag">${this.getSportEmoji(sport)} ${this.getSportName(sport)}</span>`
                ).join('')}
            </div>
            
            <div class="user-zones">
                <strong>Zonas:</strong> ${user.zones.join(', ')}
            </div>
        `;

        container.appendChild(userCard);
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
        
        alert(`¡Match con ${likedUser.firstName}!`);
        this.openChat(likedUser);
    }

    handleDislike() {
        this.currentCardIndex++;
        if (this.currentCardIndex >= this.availableUsers.length) {
            this.currentCardIndex = 0;
        }
        this.displayCurrentUser();
    }

    // ========== SISTEMA DE CHAT ==========

    openChat(user) {
        this.currentChatUser = user;
        document.getElementById('chatWith').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('chatSport').textContent = user.sports.map(s => this.getSportName(s)).join(', ');
        
        this.loadChatMessages();
        this.showScreen('chatScreen');
    }

    loadChatMessages() {
        const container = document.getElementById('chatMessages');
        container.innerHTML = '';
        
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'message other';
        welcomeMsg.textContent = `¡Hola! Soy ${this.currentChatUser.firstName}. ¿Quieres coordinar para jugar?`;
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

        // Respuesta automática
        setTimeout(() => {
            const responses = [
                "¡Suena bien! ¿Qué día te viene mejor?",
                "Perfecto, yo también estoy disponible",
                "¿Quieres que nos juntemos este fin de semana?",
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

    sendDirectMessage() {
        const input = document.getElementById('directMessageInput');
        const message = input.value.trim();
        
        if (message === '') return;

        const container = document.getElementById('directChatMessages');
        
        // Mensaje del usuario actual
        const userMsg = document.createElement('div');
        userMsg.className = 'message own';
        userMsg.textContent = message;
        container.appendChild(userMsg);

        // Respuesta automática del jugador seleccionado
        setTimeout(() => {
            const sport = this.currentCourt ? this.getSportName(this.currentCourt.sport) : 'fútbol';
            const responses = [
                `¡Excelente! Me encantaría jugar ${sport} contigo`,
                `¿Qué día y horario prefieres para jugar ${sport}?`,
                `Perfecto, puedo en la cancha que mencionaste`,
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

    // ========== UTILIDADES ==========

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    getSportName(sportKey) {
        const sports = {
            'futbol': 'Fútbol', 'tennis': 'Tenis', 'hockey': 'Hockey', 'basquet': 'Baloncesto',
            'rugby': 'Rugby', 'paddle': 'Pádel', 'ciclismo': 'Ciclismo', 'natacion': 'Natación'
        };
        return sports[sportKey] || sportKey;
    }

    getSportEmoji(sportKey) {
        const emojis = {
            'futbol': '⚽', 'tennis': '🎾', 'hockey': '🏒', 'basquet': '🏀',
            'rugby': '🏉', 'paddle': '🎯', 'ciclismo': '🚴', 'natacion': '🏊'
        };
        return emojis[sportKey] || '🏆';
    }

    getFeatureEmoji(feature) {
        const emojis = {
            'Iluminación': '🌙', 'Vestuarios': '🚿', 'Estacionamiento': '🅿️',
            'Cesped sintético': '🌿', 'Duchas': '🚿', 'Bar': '☕',
            'Techado': '🏠', 'Graderas': '👥'
        };
        return emojis[feature] || '✅';
    }
}

const app = new SportMatchApp();
