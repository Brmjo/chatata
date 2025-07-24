const searchFriendsButton = document.getElementById('search-friends-button');

searchFriendsButton.addEventListener('click', () => {
    
    if(document.getElementById('search-friends-wrapper').style.display == 'none') {
        document.getElementById('search-friends-wrapper').style.display = 'block';
        document.getElementById('chats-wrapper').style.display = 'none';
        fetch('/list-of-users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then((data) => {
            console.log('Test2');
            displayUsersList(data);
        }).catch(error => alert(error))
    }else {
        document.getElementById('search-friends-wrapper').style.display = 'none';
        document.getElementById('chats-wrapper').style.display = 'block';
    }
})

function displayUsersList(list) {
    console.log(list);
    const listOfUsersWrapper = document.getElementById('list-of-users');
    listOfUsersWrapper.innerHTML = '';
    
    for(user of list) {
        const userWrapper = document.createElement('div');
        const username = document.createElement('div');
        const profilePicture = document.createElement('img');
        const startChatButton = document.createElement('button');
        
        username.textContent = user.username;
        username.classList.add('username')
        profilePicture.setAttribute('src', '/images/profile-pictures/default-profile-picture.jpeg');
        startChatButton.textContent = 'START CHAT';
        
        userWrapper.appendChild(profilePicture);
        userWrapper.appendChild(username);
        userWrapper.appendChild(startChatButton);
        userWrapper.classList.add('user-wrapper');
        
        if(user.role == 'admin') username.classList.add('rainbow-text')
        
        listOfUsersWrapper.appendChild(userWrapper);
    }
    console.log('Test');
}

document.getElementById('search-submit-button').addEventListener('click', () => {
    const usernameToSearch = document.getElementById('username-input').value;
    
    if(!usernameToSearch) {
        alert('Please input username');
        return;
    }
    fetch('/search-for-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: usernameToSearch
        })
    })
    .then(response => response.json())
    .then((userList) => {
        displayUsersList(userList)
    })
    .catch(error => alert(error));
})

document.getElementById('profile').addEventListener('click', () => {
    window.location.href = '/profile';
});