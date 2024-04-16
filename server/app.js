import express from "express";
import {
    getTodo,
    shareTodo,
    deleteTodo,
    getTodosByID,
    createTodo,
    toggleCompleted,
    getUserByEmail,
    getUserByID,
    getSharedTodoByID,
    deleteTodoAndShared
} from "./database.js"

import cors from 'cors';

const corsOptions = {
    origin : "http://127.0.0.1:5173",
    methods: ["POST", "GET"],
    credentials: true,
}

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.get("/todos/:id", async (req,res) => {
    const todos = await getTodosByID(req.params.id);
    res.status(200).send(todos);
});

app.get("/todos/shared_todos/:id", async (req, res) => {
    const todo = await getSharedTodoByID(req.params.id);
    const author = await getUserByID(todo.user_id);
    const shared_with =await getUserByID(todo.shared_with_id);
    res.status(200).send({ author, shared_with});
});
// OBTENER
app.get("/users/:id", async (req, res) => {
    const user = await getUserByID(req.params.id);
    res.status(200).send(user);
});
// ACTUALiZAR
app.put("/todos/:id", async (req, res) => {
    const { value } = req.body;
    const todo = await toggleCompleted(req.params.id, value);
    res.status(200).send(todo);
});

// BORRAR
app.delete("/todos/:id", async (req, res) => {
    const todoId = req.params.id;

    try {
        const result = await deleteTodoAndShared(todoId);
        if (result.success) {
            res.status(200).send({ message: "Tarea borrada correctamente" });
        } else {
            res.status(500).send({ error: result.error });
        }
    } catch (error) {
        console.error("Error al borrar la tarea:", error);
        res.status(500).send({ error: "Error del servidor Interno" });
    }
});
// app.delete("/todos/:id", async (req, res) => {
//     const todoId = req.params.id;
//     try {
//         await deleteTodo(todoId);
//         res.status(200).send({ message: "Ha sido eliminado correctamente" });
//     } catch (error) {
//         res.status(500).send({ error: "Error del servidor Interno" });
//     }
// });

// CREAR
app.post("/todos/shared_todos", async (req, res)=> {
    try {
        const { todo_id, user_id, email } = req.body;
        const userToShare = await getUserByEmail(email);
        if (!userToShare) {
            return res.status(404).send({ error: 'El usuario al que intentas compartir el ToDo no existe' });
        }
        const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
        res.status(201).send(sharedTodo);
    } catch (error) {
        console.error("Error al compartir ToDo:", error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});

app.post("/todos", async (req, res) => {
    const { user_id, title } = req.body;
    const todo = await createTodo(user_id, title);
    res.status(201).send(todo);
  });


app.listen(8080, () => {
    console.log("Server running on port 8080")
})