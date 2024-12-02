import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Bienvenue sur l'outil REDEVENT</h1>
      <div className="card">
        <button
          onClick={() => {
            navigate("/location");
          }}
        >
          ENTRER
        </button>
      </div>
    </>
  );
}

export default App;
