import * as React from "react";
import { LLMType } from "@src/enum";
import { makeStyles } from "@fluentui/react-components";

interface WelcomeProps {
  onKeySubmit: () => void;
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: "20px",
  },
  heading: {
    fontSize: "3em",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  },
  select: {
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
    appearance: "none", // Remove default select styling
    backgroundColor: "white", // Set background color
  },
  button: {
    padding: "12px 20px",
    margin: "10px 0",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#45a049",
    },
  },
});

const Welcome: React.FC<WelcomeProps> = ({ onKeySubmit }) => {
  const [_, setKey] = React.useState<string>("");

  const styles = useStyles();

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome</h1>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          setKey(e.currentTarget.key.value);
          localStorage.setItem("apiKey", e.currentTarget.key.value);
          localStorage.setItem("type", e.currentTarget.typeOfLLM.value);
          onKeySubmit();
        }}
      >
        <input className={styles.input} type="text" name="key" placeholder="Enter your API key" required />
        <select className={styles.select} id="typeOfLLM" name="typeOfLLM" required>
          <option value={LLMType.Gemini}>Gemini</option>
        </select>
        <p>
          Get your Gemini API key from <a href="https://aistudio.google.com">here.</a>
        </p>
        <button className={styles.button} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Welcome;
