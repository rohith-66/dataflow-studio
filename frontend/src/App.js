import { useState } from "react";
import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Bronze from "./pages/Bronze";
import Silver from "./pages/Silver";
import Gold from "./pages/Gold";
import Layout from "./components/Layout";

function App() {
  const [stage, setStage] = useState("landing");
  const [bronzeData, setBronzeData] = useState(null);
  const [silverData, setSilverData] = useState(null);

  const restart = () => {
    setBronzeData(null);
    setSilverData(null);
    setStage("landing");
  };

  if (stage === "landing") return <Landing onStart={() => setStage("upload")} />;

  return (
    <Layout stage={stage}>
      {stage === "upload" && (
        <Upload onUploadSuccess={(data) => {
          setBronzeData(data);
          setStage("bronze");
        }}/>
      )}
      {stage === "bronze" && (
        <Bronze
          data={bronzeData}
          onNext={() => setStage("silver")}
          onBack={restart}
        />
      )}
      {stage === "silver" && (
        <Silver
          bronzeData={bronzeData}
          onNext={(data) => {
            setSilverData(data);
            setStage("gold");
          }}
          onBack={() => setStage("bronze")}
        />
      )}
      {stage === "gold" && (
        <Gold
          bronzeData={bronzeData}
          silverData={silverData}
          onRestart={restart}
        />
      )}
    </Layout>
  );
}

export default App;