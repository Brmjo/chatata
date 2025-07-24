const { LowSync, JSONFileSync } = require('lowdb');

function addProfilePicture() {
    const adapter = new JSONFileSync('users.json');
    const usersDB = new LowSync(adapter);
    
    usersDB.read();
    
    for(user of usersDB.data.users) {
        user.role = 'user';
        console.log(user.username);
    }
    
    usersDB.write();
    
    console.log('Done!');
}

addProfilePicture();