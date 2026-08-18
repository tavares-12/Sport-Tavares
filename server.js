const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(express.static("public"));

const banco = new sqlite3.Database("./database/banco.db");

banco.run(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        preco REAL NOT NULL
    )
`);

app.get("/api/produtos", (req, res) => {

    banco.all(
        "SELECT * FROM produtos",
        [],
        (erro, produtos) => {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao buscar produtos"
                });
            }

            res.json(produtos);
        }
    );

});

app.post("/api/produtos", (req, res) => {

    const { nome, preco } = req.body;

    if (!nome || !preco) {

        return res.status(400).json({
            erro: "Preencha todos os campos"
        });

    }

    banco.run(
        "INSERT INTO produtos (nome, preco) VALUES (?, ?)",
        [nome, preco],
        function(erro) {

            if (erro) {

                return res.status(500).json({
                    erro: "Erro ao cadastrar"
                });

            }

            res.json({
                mensagem: "Produto cadastrado!",
                id: this.lastID
            });

        }
    );

});

app.listen(PORT, () => {

    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );

});
