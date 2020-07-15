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
      <EQ width={width} height={height} eq={eqModel} displayOnly={false} miniature={false} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
      <EQ width={width / 10} height={height / 10} eq={eqModel} displayOnly={true} miniature={true} />
    </div>
  );
}

export default App;
