// Sistema de autenticación y usuarios para 1+ con estructura mejorada
class AuthSystem {
    constructor() {
        // Cargar usuarios existentes o crear lista predeterminada
        this.users = JSON.parse(localStorage.getItem('1plus_users')) || this.createDefaultUsers();
        this.currentUser = null;
        this.initEventListeners();
    }

    createDefaultUsers() {
        const defaultUsers = [
            {
                id: 1,
                firstName: "Carlos",
                lastName: "Gómez",
                age: 28,
                email: "futbol@1plus.com",
                password: "123456",
                sports: ["futbol", "tennis"],
                zones: ["Palermo", "Recoleta"],
                location: { lat: -34.588, lng: -58.430 },
                availability: {
                    lunes: "18:00-20:00",
                    miercoles: "19:00-21:00",
                    sabado: "10:00-13:00"
                },
                maxDistance: 10,
                matches: [],
                chats: []
            },
            {
                id: 2,
                firstName: "Ana",
                lastName: "Rodríguez",
                age: 32,
                email: "tenis@1plus.com", 
                password: "123456",
                sports: ["tennis", "natacion"],
                zones: ["Belgrano", "Nuñez"],
                location: { lat: -34.560, lng: -58.458 },
                availability: {
                    martes: "17:00-19:00",
                    jueves: "18:00-20:00",
                    domingo: "11:00-14:00"
                },
                maxDistance: 15,
                matches: [],
                chats: []
            },
            {
                id: 3,
                firstName: "Luis",
                lastName: "Fernández",
                age: 25,
                email: "basquet@1plus.com",
                password: "123456",
                sports: ["basquet", "futbol"],
                zones: ["Caballito", "Almagro"],
                location: { lat: -34.610, lng: -58.441 },
                availability: {
                    lunes: "20:00-22:00",
                    viernes: "19:00-21:00",
                    sabado: "16:00-18:00"
                },
                maxDistance: 8,
                matches: [],
                chats: []
            },
            {
                id: 4, 
                firstName: "Marta",
                lastName: "López",
                age: 29,
                email: "natacion@1plus.com",
                password: "123456",
                sports: ["natacion", "yoga"],
                zones: ["Puerto Madero", "Retiro"],
                location: { lat: -34.608, lng: -58.370 },
                availability: {
                    martes: "07:00-09:00",
                    jueves: "07:00-09:00",
                    sabado: "08:00-10:00"
                },
                maxDistance: 5,
                matches: [],
                chats: []
            },
            {
                id: 5,
                firstName: "Pedro",
                lastName: "Martínez",
                age: 35,
                email: "ciclismo@1plus.com",
                password: "123456", 
                sports: ["ciclismo", "running"],
                zones: ["Palermo", "Colegiales"],
                location: { lat: -34.575, lng: -58.425 },
                availability: {
                    miercoles: "06:00-08:00",
                    viernes: "06:00-08:00",
                    domingo: "07:00-10:00"
                },
                maxDistance: 20,
                matches: [],
                chats: []
            },
            {
                id: 6,
                firstName: "Laura", 
                lastName: "García",
                age: 26,
                email: "running@1plus.com",
                password: "123456",
                sports: ["running", "gimnasio"],
                zones: ["Villa Crespo", "Chacarita"],
                location: { lat: -34.595, lng: -58.445 },
                availability: {
                    lunes: "06:00-07:30",
                    miercoles: "06:00-07:30",
                    viernes: "06:00-07:30"
                },
                maxDistance: 12,
                matches: [],
                chats: []
            },
            {
                id: 7,
                firstName: "Diego",
                lastName: "Silva",
                age: 31,
                email: "rugby@1plus.com",
                password: "123456",
                sports: ["rugby", "gimnasio"], 
                zones: ["San Isidro", "Vicente López"],
                location: { lat: -34.530, lng: -58.520 },
                availability: {
                    sabado: "14:00-17:00",
                    domingo: "10:00-13:00"
                },
                maxDistance: 25,
                matches: [],
                chats: []
            },
            {
                id: 8,
                firstName: "Sofía",
                lastName: "Pérez",
                age: 27,
                email: "voleibol@1plus.com",
                password: "123456",
                sports: ["voleibol", "yoga"],
                zones: ["Recoleta", "Barrio Norte"],
                location: { lat: -34.592, lng: -58.392 },
                availability: {
                    martes: "19:00-21:00",
                    jueves: "19:00-21:00",
                    sabado: "15:00-17:00"
                },
                maxDistance: 7,
                matches: [],
                chats: []
            }
        ];
        
        // Guardar en localStorage
        localStorage.setItem('1plus_users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }

    initEventListeners() {
        // Eventos de navegación
        document.getElementById('showRegister').addEventListener('click', () => this.showScreen('registerScreen'));
        document.getElementById('showLogin').addEventListener('click', () => this.showScreen('loginScreen'));
        
        // Eventos de formularios
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('logout').addEventListener('click', () => this.logout());
        
        // Geolocalización
        document.getElementById('detectLocation').addEventListener('click', () => this.detectLocation());
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.showScreen('mainScreen');
            app.loadUsers();
        } else {
            alert('Email o contraseña incorrectos');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        
        // Validar deportes seleccionados
        const selectedSports = Array.from(document.querySelectorAll('input[name="sports"]:checked'))
                                   .map(cb => cb.value);
        
        if (selectedSports.length === 0) {
            alert('Selecciona al menos un deporte');
            return;
        }

        if (selectedSports.length > 3) {
            alert('Máximo 3 deportes permitidos');
            return;
        }

        // Validar ubicación
        const userLat = document.getElementById('userLat').value;
        const userLng = document.getElementById('userLng').value;
        
        if (!userLat || !userLng) {
            alert('Por favor, detecta tu ubicación');
            return;
        }

        // Recoger zonas
        const zones = [
            document.getElementById('zone1').value,
            document.getElementById('zone2').value,
            document.getElementById('zone3').value
        ].filter(zone => zone.trim() !== '');

        // Recoger horarios
        const availability = {};
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const dayNames = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        
        days.forEach((day, index) => {
            const start = document.getElementById(`${day}Start`).value;
            const end = document.getElementById(`${day}End`).value;
            if (start && end) {
                availability[dayNames[index]] = `${start}-${end}`;
            }
        });

        const userData = {
            id: Date.now(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            age: parseInt(document.getElementById('age').value),
            email: document.getElementById('newEmail').value,
            password: document.getElementById('newPassword').value,
            sports: selectedSports,
            zones: zones,
            location: {
                lat: parseFloat(userLat),
                lng: parseFloat(userLng)
            },
            availability: availability,
            maxDistance: 10, // Distancia predeterminada
            matches: [],
            chats: []
        };

        // Verificar si el email ya existe
        if (this.users.find(u => u.email === userData.email)) {
            alert('Este email ya está registrado');
            return;
        }

        this.users.push(userData);
        localStorage.setItem('1plus_users', JSON.stringify(this.users));
        
        alert('¡Registro exitoso! Ahora puedes iniciar sesión');
        this.showScreen('loginScreen');
    }

    detectLocation() {
        const statusElement = document.getElementById('locationStatus');
        
        if (!navigator.geolocation) {
            statusElement.innerHTML = '<div class="location-status error">Geolocalización no soportada</div>';
            return;
        }

        statusElement.innerHTML = '<div class="location-status">📍 Detectando ubicación...</div>';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                document.getElementById('userLat').value = lat;
                document.getElementById('userLng').value = lng;
                
                statusElement.innerHTML = `<div class="location-status success">✅ Ubicación detectada (${lat.toFixed(4)}, ${lng.toFixed(4)})</div>`;
            },
            (error) => {
                let errorMessage = 'Error al detectar ubicación';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permiso de ubicación denegado';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Ubicación no disponible';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Tiempo de espera agotado';
                        break;
                }
                statusElement.innerHTML = `<div class="location-status error">❌ ${errorMessage}</div>`;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }

    logout() {
        this.currentUser = null;
        this.showScreen('loginScreen');
    }

    // Método para calcular distancia entre dos coordenadas
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distancia en km
    }
}

const auth = new AuthSystem();
