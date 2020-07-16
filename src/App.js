import React from 'react';
import './App.css';
import EQ, { EqModel, HIGH_PASS, BELL, HIGH_SHELF } from './EQ.js';

const width = 1_000;
const height = 500;

const eqModel = new EqModel({
  minGain: -12.0,
  maxGain: 12.0,
  minFrequency: 20,
  maxFrequency: 24_000,
  minQ: 0.1,
  maxQ: 50.0,
  bands: [HIGH_PASS, BELL, BELL, BELL, HIGH_SHELF],
});

function App() {
  return (
    <div>
      <EQ id="mainEq" width={width} height={height} eq={eqModel} title="Equalizer" />
      <div id="miniatures">
        <EQ id="minEq1" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq2" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq3" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq4" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq5" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq6" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq7" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq8" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq9" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq10" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq11" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq12" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq13" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq14" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq15" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq16" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq17" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq18" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq19" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
        <EQ id="minEq20" width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} title="EQ" />
      </div>
    </div>
  );
}

export default App;
