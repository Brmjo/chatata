const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', () => {
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    const verifyPassword = document.getElementById('verify-password-input').value;
    
    if(!username || !password || !verifyPassword) {
        alert('Please fill all the data needed');
        return;
    }
    
    if(password !== verifyPassword) {
        alert('Please confirm the password correctly.');
        return;
    }
    
    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username, password
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.status == 'OK') {
            alert(data.message);
        }else {
            alert(data.message);
        }
    })
    .catch(error => alert(error));
});