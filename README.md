В Node.js commant promt выполнил:

npm init -y

npm install fastify @fastify/static 

@fastify/view @fastify/formbody pug sqlite3

# Пояснения:

1. Статика: script.js раздается через fastify-static.
2. 
3. Шаблоны: все страницы на Pug.
4. 
5. БД: все данные читаются и пишутся в users.db (SQLite).
6. 
7. Редирект: С / сразу кидает на /users.
8. 
9. CRUD: можно создавать, смотреть список, редактировать и удалять.
10. 
11. Массив: заменили его базой данных (как того требовала вторая часть), так как массив — это временное решение.
