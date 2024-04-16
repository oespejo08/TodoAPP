CREATE DATABASE todo_app;

USE todo_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255)
);

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USERS(ID) ON DELETE CASCADE
);


CREATE TABLE shared_todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    todo_id INT,
    user_id INT,
    shared_with_id INT,
    FOREIGN KEY (todo_id) REFERENCES todos(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shared_with_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password) VALUES ('Oscar','user1@example.com','password1');
INSERT INTO users (name, email, password) VALUES ('Carolina','user2@example.com','password2');

INSERT INTO todos (title, user_id)
VALUES
("Madrugar para sacar el perro🐶",1),
("Ir a trabajar💼",1),
("Repasar lo estudiado anteriormente📕",1),
("Continuar con el proyecto📚",1),
("Hacer de comer🍔",1),
("Comer🍔",1),
("Siesta time😪",1),
("Escuchar un PoadCast🎧",1),
("Ver Streaming de desarrolladores para aprender💻",1),
("Ir a Dormir😴🛌",1);
 
 -- Compartir tareas del usuario 1 con usuario 2

 INSERT INTO shared_todos (todo_id, user_id, shared_with_id) VALUES (1, 1, 2);


 -- Obtener todas las tareas creadas y compartidas con el "id"

 SELECT todos.*, shared_todos.shared_with_id
 FROM todos
 LEFT JOIN shared_todos ON todo_id =shared_todos.todo_id
 WHERE todos.user_id = 2 OR shared_todos.shared_with_id = 2 ;