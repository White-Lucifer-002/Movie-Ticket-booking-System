// Script for handling form submissions
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const registrationForm = document.getElementById("registrationForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const url = "http://127.0.0.1:3000/login"

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"email": email, "password":password })
            });

            const data = await response.json();
            alert(data.message);
            loginForm.reset();
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const name = document.getElementById("name").value;
            const url = "http://127.0.0.1:3000/register"

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"name": name,"email": email, "password":password })
            });

            const data = await response.json();
            alert(data.message);
            location.replace("../templates/login.html")
            // registrationForm.reset();
        });
    }
});


