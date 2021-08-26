const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  if(!username) {
    return response.status(400).json({ error: 'User is not in the header' });
  }

  const [userExist] = users.filter(user => user.username === username)

  if(!userExist) {
    return response.status(400).json({ error: 'User does not exists' });
  }

  request.user = userExist;

  return next()
}

app.post('/users', (request, response) => {
  const { username, name } = request.body;

  if(users.some(user => user.username === username)) {
    return response.status(400).json({ error: 'User already exist' })
  }

  const user ={ 
    id: uuidv4(), // precisa ser um uuid
    name,
    username,
    todos: []
  }
  users.push(user)

  // Complete aqui
  return response.json(user)
});

app.get('/users', (request, response) => {
  // Complete aqui
  return response.json(users)
})

app.get('/users/:username', (request, response) => {
  const { username: usernameParams } = request.params;
    const [user] = users.filter(user => usernameParams === user.username)
    
    if(!user) {
      return response.status(400).json({ error: 'User does not exist'})
    }

    return response.json(user)
})

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const user = request.user;

  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline} = request.body;
  const user = request.user;

  const todo = {
    id: uuidv4(),
    done: false,
    title,
    deadline: new Date(deadline),
    created_at: new Date()
  }

      user.todos.push(todo)

  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const user = request.user;

  const [todo] = user.todos.filter(todo => 
   todo.id === id
  )

  if(!todo) {
    return response.status(404).json({ error: 'error' })
  }

      user.todos.map(todo => {
        if(todo.id === id) {
          todo.title = title;
          todo.deadline = new Date(deadline)
        }
      })

      const [newtodo] = user.todos.filter(todo => 
        todo.id === id
       )

  return response.json(newtodo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const user = request.user;

  const index = user.todos.findIndex(todo => 
    todo.id === id
   )
 
   if(index < 0) {
     return response.status(404).json({ error: 'Can not find todo' })
   }

     user.todos[index] = {
       ...user.todos[index],
       done: true
     }

  return response.json(user.todos[index])
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const user = request.user;

  const index = user.todos.findIndex(todo => todo.id === id)
  
  if(index < 0) {
    return response.status(404).json({ error: 'Error' })
  }

  user.todos.splice(index, 1)

  return response.status(204).json(user.todos)
});

module.exports = app;