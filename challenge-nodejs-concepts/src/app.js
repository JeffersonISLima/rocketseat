const cors = require("cors");
const express = require("express");
const { uuid } = require("uuidv4");

const app = express();

app.use(cors());
app.use(express.json());

let repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex((element) => {
    return element.id === id;
  });

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  const repository = {
    id,
    url,
    title,
    techs,
    likes: 0,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => {
    return repository.id === id;
  });

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => {
    return id === repository.id;
  });

  if (!repository) {
    response.status(400).send();
  }

  repository.likes += 1;

  return response.status(201).json(repository);
});

module.exports = app;
