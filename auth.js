document.addEventListener('DOMContentLoaded', () => {

    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const signupError = document.getElementById('signup-error');
    const loginError = document.getElementById('login-error');

    // Asynchronous function to hash the password securely
    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashedPassword;
    };

    // Sign Up Logic for signup.html
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Check if user already exists
            const existingUser = JSON.parse(localStorage.getItem(email));
            if (existingUser) {
                signupError.textContent = 'This email is already registered.';
                signupError.style.display = 'block';
                return;
            }

            const hashedPassword = await hashPassword(password);

            const user = { username, email, password: hashedPassword };
            
            // Store user data in localStorage using email as the key
            localStorage.setItem(email, JSON.stringify(user));
            
            alert('Sign up successful! Please log in.');
            window.location.href = 'login.html';
        });
    }

    // Log In Logic for login.html
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const storedUser = JSON.parse(localStorage.getItem(email));
            if (!storedUser) {
                loginError.textContent = 'User not found. Please sign up.';
                loginError.style.display = 'block';
                return;
            }

            const hashedPassword = await hashPassword(password);

            if (hashedPassword === storedUser.password) {
                // Set a login status flag and store user's email
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUserEmail', email);

                alert('Login successful!');
                window.location.href = 'index.html';
            } else {
                loginError.textContent = 'Incorrect password.';
                loginError.style.display = 'block';
            }
        });
    }
});
