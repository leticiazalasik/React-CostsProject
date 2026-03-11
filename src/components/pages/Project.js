import { parse, v4 as uuidv4 } from "uuid";
import styles from "./Project.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../layout/Loading";
import Container from "../layout/Container";
import ProjectForm from "../project/ProjectForm";
import ServiceForm from "../service/ServiceForm";
import ServiceCard from "../service/ServiceCard";
import Message from "../layout/Messsage";

function Project() {
  const { id } = useParams();
  const [project, setProject] = useState([]);
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
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
        setServices(data.services);
      })
      .catch((err) => console.log);
  }, [id]);

  function createService(project) {
    setMessage("");
    const lastService = project.services[project.services.length - 1];

    lastService.id = uuidv4();

    const lastServiceCost = lastService.cost;
    const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

    //maximum value validation
    if (newCost > parseFloat(project.budget)) {
      setMessage("Orçamento ultrapassado, verifique o valor do serviço");
      setType("error");
      project.services.pop();
      return false;
    }
    //add service cost to project cost
    project.cost = newCost;

    //update cost
    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setShowServiceForm(false);
      })
      .catch((err) => console.log(err));
  }

  //Remover serviço
  //Quando o botão remover é clcido no serviceCard ele traz o id e cost do serviço
  function removeService(id, cost) {

    //project.services é o array de serviços do projeto
    //filter mantém todos que NÃO são iguais ao id removido 
    const servicesUpdated = project.services.filter(
      (service) => service.id !== id,
    );

    //projectUpdated → aponta para o mesmo objeto de project, ambos são o mesmo objeto na memória.
    const projectUpdated = project;

    //O projeto agora tem a nova lista de serviços (sem o removido)
    projectUpdated.services = servicesUpdated;

    //novo custo = custo atual - custo do serviço removido
    projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost);

    fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectUpdated),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(projectUpdated);
        setServices(servicesUpdated);
        setMessage("Serviço removido com sucesso!");
      })
      .catch((err) => console.log(err));
  }

  //Função para mostrar botão de editar
  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }

  //Função para mostrar botão de editar ou ...
  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm);
  }

  //Função para editar project
  function editPost(project) {
    setMessage("");
    //budget vaidation futuro
    if (project.budget < project.cost) {
      //mensagem
      setMessage("O orçamento não pode ser menor que o custo de projeto!");
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
            <div className={styles.service_form_container}>
              <h2>Adicione um serviço</h2>
              <button onClick={toggleServiceForm} className={styles.btn}>
                {!showServiceForm ? "Adicionar serviço" : "Fechar"}
              </button>

              <div className={styles.project_info}>
                {showServiceForm && (
                  <ServiceForm
                    handleSubmit={createService}
                    btnText="Adicionar Serviço"
                    projectData={project}
                  />
                )}
              </div>
            </div>
            <h2>Serviços</h2>
            <Container customClass="start">
              {services.length > 0 ? (
                services.map((service) => (
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    cost={service.cost}
                    description={service.description}
                    key={service.id}
                    handleRemove={removeService}
                  />
                ))
              ) : (
                <p>Não há serviços cadastrados</p>
              )}
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Project;
