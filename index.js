import * as eq from './eq.js';

const myEq = {
    minGain: -12.0,
    maxGain: 12.0,
    minFrequency: 20,
    maxFrequency: 24_000,
    minQ: 0.1,
    maxQ: 100.0,
    bands: [
        {
            type: eq.HIGH_PASS,
            gain: -3.0,
            frequency: 80,
            q: 1.0,
        },
        {
            type: eq.LOW_SHELF,
            gain: 3.0,
            frequency: 240,
            q: 1.0,
        },
        {
            type: eq.BELL,
            gain: -3.0,
            frequency: 720,
            q: 1.0,
        },
        {
            type: eq.BELL,
            gain: 3.0,
            frequency: 2160,
            q: 0.1,
        },
        {
            type: eq.HIGH_SHELF,
            gain: -3.0,
            frequency: 6480,
            q: 100.0,
        }
    ]
}


const canvas = document.getElementById("canvas");
eq.initEq(myEq, canvas, 0, 0, canvas.width, canvas.height);