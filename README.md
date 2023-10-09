# TODOアプリ

## Overview
This application manages task content, time required, and deadlines. Not only that, it also manages the sequential relationship between tasks, and the system automatically corrects any inconsistencies that arise.

## How to run
1. Clone this repository
```bash
git clone https://github.com/Sug1874/node-todo.git
```

2. Change current directory
```bash
cd node-todo
```

3. Start docker container
```bash
cd ./Docker
docker-compose up -d --build
```

4. Start backend application
```bash
cd ../backend
node app.js
```

5. Start frontend application
```bash
cd ../frontend
npm start
```