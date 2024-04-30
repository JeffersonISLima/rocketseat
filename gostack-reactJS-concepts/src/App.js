import "./styles.css";
import api from "./services/api";
import React, { useEffect, useState } from "react";

function App() {
  const [projects, setProjects] = useState([]);

  const [toggleProjects, setToggleProjects] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = (await api.get("repositories")).data;

      setProjects(response);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleAddRepository = async () => {
    try {
      const { data: project } = await api.post("repositories", {
        title: `Novo Projeto ${Date.now()}`,
        url: "https://github.com/Rocketseat/unform1233",
        techs: ["Node.js", "React.js", "CSS", "HTML5"],
      });

      setToggleProjects(true);
      setProjects([...projects, project]);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleRemoveRepository = async (id) => {
    try {
      await api.delete(`repositories/${id}`);

      const projectIndex = projects.findIndex((project) => {
        return project.id === id;
      });

      setToggleProjects(false);
      setProjects([...projects, projects.splice(projectIndex, 1)]);

      return await fetchProjects();
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      {toggleProjects ? (
        <ul data-testid="repository-list">
          {projects.map((project) => (
            <li key={project.id}>
              {project.title}
              <button onClick={() => handleRemoveRepository(project.id)}>
                Remover
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul data-testid="repository-list" />
      )}

      <button onClick={handleAddRepository} style={{ marginRight: 5 }}>
        Adicionar
      </button>
      <button onClick={() => setToggleProjects(true)}>Ver lista</button>
    </>
  );
}

export default App;
