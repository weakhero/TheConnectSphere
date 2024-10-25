document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");
    const errorPassword = document.getElementById("errorPassword");
    const videoContainer = document.getElementById('videoContainer');

    // Hide error messages and video initially
    errorMessage.style.display = "none";
    errorPassword.style.display = "none";
    videoContainer.classList.add('hidden'); // Assuming 'hidden' is a CSS class that hides the video

    // Handle login form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Send login data to the server
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect to the timeline on successful login
                window.location.href = "gallery2.0.html";
            } else {
                // Show error messages and display the video on incorrect login
                errorMessage.style.display = "block";
                errorPassword.style.display = "block";
                videoContainer.classList.remove('hidden'); // Show the video
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.style.display = "block";
            errorPassword.style.display = "block";
            videoContainer.classList.remove('hidden'); // Show the video in case of an error
        });
    });
});

