import styles from "./Loading.module.css";
import loading from "../../img/loading.svg";

function Loading() {
  return (
    <div className={styles.loader_container}>
      <img className={styles} src={loading} alt="Loading" />
    </div>
  );
}
export default Loading;
