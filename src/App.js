import React from "react";
import "./App.css";
import EQ, { EqModel, HIGH_PASS, BELL, HIGH_SHELF } from "./EQ.js";

const eqModel = new EqModel({
  minGain: -12.0,
  maxGain: 12.0,
  minFrequency: 20,
  maxFrequency: 24000,
  minQ: 0.1,
  maxQ: 50.0,
  bands: [HIGH_PASS, BELL, BELL, BELL, HIGH_SHELF]
});

function App() {
  // return <EQ id="dynamicallyResizingEq" width={1_000} height={500} eq={eqModel} title="Equalizer" />;
  return (
    <EQ
      id="dynamicallyResizingEq"
      dynResize={true}
      eq={eqModel}
      title="Equalizer"
    />
  );
}

export default App;
