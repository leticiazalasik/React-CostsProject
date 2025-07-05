import styles from "./ProjectForm.module.css";
import Input from "../Form/Input";
import Select from "../Form/Select";
import SubmitButton from "../Form/SubmitButton";


function ProjectForm({btnText}) {
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

      <Select name="category_id" text="Selecione a categoria"/>

     <SubmitButton text={btnText}/>
    </form>
  );
}

export default ProjectForm;
