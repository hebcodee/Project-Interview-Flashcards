import logo from "./logo.svg";
import "./App.css";
import api from "./services/api";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/api/qa")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados" + err);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Heb dev hebcodee {data.length}</p>
        <div>
          {Object.keys(data).map((topico) => (
            <div key={topico}>
              <h2>{topico}</h2>

              {data[topico].map((item, index) => (
                <div key={index}>
                  <p>
                    <strong>Pergunta:</strong> {item.pergunta}
                  </p>
                  <p>
                    <strong>Resposta:</strong> {item.resposta}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
