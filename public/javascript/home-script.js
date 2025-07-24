window.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit-button');

    submitButton.addEventListener('click', () => {
        const username = document.getElementById('username-input').value;
        const password = document.getElementById('password-input').value;
        
        if (!username || !password) {
            alert('Please fill in the data needed.');
            return;
        }
    
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json()) // ✅ FIXED HERE
        .then(data => {
            console.log("Server response:", data);
            if (data.redirect === 'TRUE') {
                window.location.href = data.url;
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
    });


});
