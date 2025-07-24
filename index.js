const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const { LowSync, JSONFileSync} = require('lowdb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());

const secretKey = 'hello12345';

function registerToken(req, res, credentials) {
    const token = jwt.sign(credentials, secretKey, { expiresIn: '10m' });
    console.log(token);
    res.cookie('token', token, { httpOnly: true, maxAge: 600000 });
}

function authentication(req, res, next) {
    const token = req.cookies.token;
    if(!token) return res.status(401).send('Please Login first.');
    
    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next();
    }catch {
        res.status(403).send("Invalid token");
    }
}

function checkIfAccountExist(username) {
    const adapter = new JSONFileSync('users.json');
    const usersDB = new LowSync(adapter);
    
    usersDB.read();
    const exist = usersDB.data.users.find(data => data.username === username);
    console.log(exist);
    return exist;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'home.html'));
});

app.post('/login', (req, res) => {
    console.log('Test');
    const { username, password } = req.body;
    
    const adapter = new JSONFileSync('users.json');
    const usersDB = new LowSync(adapter);
    
    usersDB.read();
    let userData = usersDB.data.users.find(data => data.username === username);
    console.log(userData);
    
    if(!userData) {
        console.log('no data');
        res.json({ status: "FAILED", message: "Account does not exist."});
        return;
    }
    
    if(password == userData.password) {
        console.log('Success login');
        registerToken(req, res, { username, password });
        res.json({ status: 'OK', message: 'Success Login', redirect: 'TRUE', url: '/chat' });
    }else {
        console.log('Failed login');
        res.json({ status: 'FAILED', message: 'Wrong credentials.' });
    }
});

app.get('/chat', authentication, (req, res) => {
    res.render('chats', { username: req.user.username });
})

app.get('/signup-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'signup-page.html'));
});

app.post('/signup', (req, res) => {
    console.log('Test');
    const { username, password } = req.body;
    
    if(checkIfAccountExist(username)) {
        res.json({ status: 'FAILED', message: 'Username already in use.' });
        return;
    }
    
    const adapter = new JSONFileSync('users.json');
    const usersDB = new LowSync(adapter);
    
    usersDB.read();
    usersDB.data.users.push({ username, password });
    usersDB.write();
    res.json({ status: 'OK', message: 'Successfully created account' });
});

app.get('/list-of-users', authentication, (req, res) => {
    const adapter = new JSONFileSync('users.json');
    const usersDB = new LowSync(adapter);
     
    usersDB.read();
    const users = [];
    
    for(user of usersDB.data.users) {
        users.push({
            username: user.username,
            profilePicture: user.profilePicture
        });
    }
    
    res.json(users);
});

app.post('/search-for-user', (req, res) => {
    const usernameTarget = req.body.username;
    
    const adapter = new JSONFileSync('users.json');
    const usersDB = new LowSync(adapter);
    
    usersDB.read();
    
    const userList = [];
    
    for(user of usersDB.data.users) {
        if(user.username.includes(usernameTarget)) {
            userList.push({
                username: user.username,
                profilePicture: user.profilePicture
            });
        }
    }
    
    console.log(userList)
    res.send(userList);
});

app.get('/profile', authentication, (req, res) => {
    const username = req.user.username;
    
    const adapter = new JSONFileSync('users.json');
    const usersDB = new LowSync(adapter);
    
    usersDB.read();
    let userInfo = usersDB.data.users.find(user => username == user.username);
    
    res.render('profile', userInfo);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server Up! Listening at port ${port}`);
})