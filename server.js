const path = require('path');
const fastify = require('fastify')({ logger: true });
const sqlite3 = require('sqlite3').verbose();

// 1. Инициализация Базы Данных
const db = new sqlite3.Database('./users.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)");
});

// 2. Регистрация плагинов
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
});

fastify.register(require('@fastify/view'), {
  engine: { pug: require('pug') },
  templates: path.join(__dirname, 'views')
});

fastify.register(require('@fastify/formbody')); // Для обработки данных форм

// --- РОУТЫ ---

// Редирект с главной на /users
fastify.get('/', async (request, reply) => {
  reply.redirect('/users');
});

// GET /users - Получение списка из БД
fastify.get('/users', (request, reply) => {
  db.all("SELECT * FROM users", (err, rows) => {
    reply.view('users.pug', { users: rows });
  });
});

// GET /users/create - Шаблон формы создания
fastify.get('/users/create', async (request, reply) => {
  return reply.view('create.pug');
});

// POST /users - Сохранение в БД
fastify.post('/users', (request, reply) => {
  const { name, email } = request.body;
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], () => {
    reply.redirect('/users');
  });
});

// GET /users/edit/:id - Шаблон редактирования (Часть 2)
fastify.get('/users/edit/:id', (request, reply) => {
  const { id } = request.params;
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    reply.view('edit.pug', { user: row });
  });
});

// POST /users/update/:id - Обновление в БД (Часть 2)
fastify.post('/users/update/:id', (request, reply) => {
  const { id } = request.params;
  const { name, email } = request.body;
  db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id], () => {
    reply.redirect('/users');
  });
});

// POST /users/delete/:id - Удаление (Часть 2)
fastify.post('/users/delete/:id', (request, reply) => {
  const { id } = request.params;
  db.run("DELETE FROM users WHERE id = ?", [id], () => {
    reply.redirect('/users');
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
