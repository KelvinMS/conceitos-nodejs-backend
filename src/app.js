const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

//MIDDLEWARE
// get the request method and the time of this request
function routeRequestsTime(request, response, next) {
  const { method, url } = request;
  const requestMethod = `[${method.toUpperCase()}] ${url}`
  console.time(requestMethod);
  next();
  console.timeEnd(requestMethod);
};
app.use(routeRequestsTime);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});


app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;
  const repository = {
    id: uuidv4(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repIndex = repositories.findIndex(repository => repository.id == id);
  if (repIndex < 0) {
    return response.status(400).json({ erro: "repository not found" });
  }
  // Get likes from de rep to add
  const likes = repositories[repIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };
  repositories[repIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repIndex = repositories.findIndex(repository => repository.id == id);
  if (repIndex < 0) {
    return response.status(400).json({ erro: "repository not found" });
  }
  repositories.splice(repIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params;
  const repIndex = repositories.findIndex(repository => repository.id == id);

  if (repIndex < 0) {
    return response.status(400).json({ erro: "repository not found" });
  }
  repositories[repIndex].likes += 1;

  return response.json(repositories[repIndex]);
});

module.exports = app;
