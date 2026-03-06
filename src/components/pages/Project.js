import styles from "./Project.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../layout/Loading";
import Container from "../layout/Container";
import ProjectForm from "../project/ProjectForm";
import Message from "../layout/Messsage";

function Project() {
  const { id } = useParams();
  const [project, setProject] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [message, setMessage] = useState();
  const [type, setType] = useState();

  //Caregamento de dados
  useEffect(() => {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
      })
      .catch((err) => console.log);
  }, [id]);

  //Função para mostrar botão de editar ou ...
  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }

  //Função para editar project
  function editPost(project) {
    //budget vaidation futuro
    if (project.budget < project.cost) {
      //mensagem
      setMessage("O orçamento não pdoe ser menor que o custo de projeto!");
      setType("error");
    }

    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setShowProjectForm(false);
        //mensagem
        setMessage("Projeto atualizado!");
        setType("success");
      });
  }

  return (
    <>
      {project.name ? (
        <div className={styles.project_details}>
          <Container>
            {message && <Message type={type} msg={message} />}
            <div className={styles.details_container}>
              <div className={styles.project_header}>
                <h1>Projeto: {project.name}</h1>
                <button onClick={toggleProjectForm} className={styles.btn}>
                  {!showProjectForm ? "Editar projeto" : "Fechar"}
                </button>
              </div>
              {!showProjectForm ? (
                <div className={styles.project_info}>
                  <p>
                    <span>Categoria:</span>
                    {project.category.name}
                  </p>
                  <p>
                    <span>Total de Orçamento:</span>R$ {project.budget}
                  </p>
                  <p>
                    <span>Total de Utilizado:</span>R$ {project.cost}
                  </p>
                </div>
              ) : (
                <div className={styles.project_info}>
                  <ProjectForm
                    handleSubmit={editPost}
                    btnText="Concluir edição"
                    projectData={project}
                  />
                </div>
              )}
            </div>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Project;
