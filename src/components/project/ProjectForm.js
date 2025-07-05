import { useState } from "react";
import { useEffect } from "react";


import styles from "./ProjectForm.module.css";
import Input from "../Form/Input";
import Select from "../Form/Select";
import SubmitButton from "../Form/SubmitButton";

function ProjectForm({ btnText }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .then((data) => {
      setCategories(data);
    })
    .catch((err) => console.log(err));
  }, [])

  return (
    <form className={styles.form}>
      <Input
        type="text"
        text="Nome"
        name="name"
        placeholder="Insira o nome do projeto"
      />

      <Input
        type="number"
        text="Orçamento"
        name="budget"
        placeholder="Insira o orçamento do projeto"
      />

      <Select
        name="category_id"
        text="Selecione a categoria"
        options={categories}
      />

      <SubmitButton text={btnText} />
    </form>
  );
}

export default ProjectForm;
