// Sistema de autenticación y usuarios para 1+
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('1plus_users')) || [];
        this.currentUser = null;
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('showRegister').addEventListener('click', () => this.showScreen('registerScreen'));
        document.getElementById('showLogin').addEventListener('click', () => this.showScreen('loginScreen'));
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('logout').addEventListener('click', () => this.logout());
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
        
        const userData = {
            id: Date.now(),
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('newEmail').value,
            password: document.getElementById('newPassword').value,
            sport: document.getElementById('sport').value,
            zone: document.getElementById('zone').value,
            schedules: Array.from(document.querySelectorAll('input[name="schedule"]:checked')).map(cb => cb.value),
            matches: [],
            chats: []
        };

        if (this.users.find(u => u.email === userData.email)) {
            alert('Este email ya está registrado');
            return;
        }

        this.users.push(userData);
        localStorage.setItem('1plus_users', JSON.stringify(this.users));
        
        alert('¡Registro exitoso! Ahora puedes iniciar sesión');
        this.showScreen('loginScreen');
    }

    logout() {
        this.currentUser = null;
        this.showScreen('loginScreen');
    }
}

const auth = new AuthSystem();
