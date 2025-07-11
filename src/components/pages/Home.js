import styles from './Home.module.css'
import savings from '../../img/savings.svg'

import LinkButton from '../layout/LinkButton'

function Home(){
    return (
<secttion className={styles.home_container}>
    <h1>Bem-vindo ao <span>Costs</span></h1>
    <p>Comece a gerenciar os seus projetos agora mesmo!</p>

<LinkButton to="/newproject" text="Criar projeto"></LinkButton>
    <img src={savings} alt="Costs" />
</secttion>

    )
}

export default Home;