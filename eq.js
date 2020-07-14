export const BELL = 0;
export const HIGH_SHELF = 1;
export const LOW_SHELF = 2;
export const HIGH_PASS = 3;
export const LOW_PASS = 4;

const COEFFS = [
    [1, 0, 0, 0, 0, 0],
    [1.4142, 0, 0, 1, 0, 0],
    [1, 1, 0, 0, 1, 0],
    [1.8478, 0.7654, 0, 1, 1, 0],
    [1, 1.6180, 0.6180, 0, 1, 1],
    [1.3617, 1.3617, 0, 0.6180, 0.6180, 0],
    [1.4142, 1.4142, 0, 1, 1, 0]
];

export function initEq(eq, canvas, xOffset, yOffset, width, height) {

    const elementStyle = window.getComputedStyle(canvas, null);

    const bandStroke = elementStyle.getPropertyValue("--band-stroke");
    const bandFill = elementStyle.getPropertyValue("--band-fill");
    const disabledBandStroke = elementStyle.getPropertyValue("--disabled-bandStroke");
    const disabledBandFill = elementStyle.getPropertyValue("--disabled-bandFill");
    const sumStroke = elementStyle.getPropertyValue("--sum-stroke");
    const sumFill = elementStyle.getPropertyValue("--sum-fill");
    const gridStrokeMajor = elementStyle.getPropertyValue("--grid-stroke-major");
    const gridStrokeMinor = elementStyle.getPropertyValue("--grid-stroke-minor");
    const labelGapTop = elementStyle.getPropertyValue("--label-gap-top");
    const labelGapLeft = elementStyle.getPropertyValue("--label-gap-left");
    const font = elementStyle.getPropertyValue("--font");

    const eqHolder = {
        eq: eq,
        canvas: canvas,
        xOffset: xOffset,
        yOffset: yOffset,
        width: width,
        height: height,
        activeBand: -1,
        mouseX: -1,
        mouseY: -1,
        colors: {
            bandStroke: bandStroke || "#642",
            bandFill: bandFill || "#f954",
            disabledBandStroke: disabledBandStroke || "#8884",
            disabledBandFill: disabledBandFill || "#8882",
            sumStroke: sumStroke || "#f80",
            sumFill: sumFill || "#f954",
            gridStrokeMajor: gridStrokeMajor || "#888",
            gridStrokeMinor: gridStrokeMinor || "#8884",
        },
        labelGapTop: labelGapTop,
        labelGapLeft: labelGapLeft,
        font: font,
    };

    canvas.addEventListener("contextmenu", e => e.preventDefault());

    canvas.addEventListener("mousedown", e => handleMouseDown(e, eqHolder));
    canvas.addEventListener("mouseup", e => handleMouseUp(e, eqHolder));
    canvas.addEventListener("mousemove", e => handleMouseMove(e, eqHolder));

    canvas.addEventListener("touchstart", e => handleMouseDown(e, eqHolder));
    canvas.addEventListener("touchmove", e => handleMouseUp(e, eqHolder));
    canvas.addEventListener("touchend", e => handleMouseMove(e, eqHolder));

    canvas.addEventListener("wheel", e => handleScroll(e, eqHolder));

    renderEq(eqHolder);
}

function handleMouseDown(e, eqHolder) {

    const eq = eqHolder.eq;
    let closestBand = findClosestBand(e, eqHolder);

    eqHolder.activeBand = closestBand;
    eqHolder.mouseX = e.offsetX;
    eqHolder.mouseY = e.offsetY;
    eqHolder.freqOnMouseDown = eq.bands[eqHolder.activeBand].frequency;
    eqHolder.gainOnMouseDown = eq.bands[eqHolder.activeBand].gain;
    eqHolder.pressedButton = e.buttons;
}

function handleMouseUp(e, eqHolder) {

    const eq = eqHolder.eq;

    if (eqHolder.pressedButton == 2 && eqHolder.activeBand >= 0) {
        const activeBand = eq.bands[eqHolder.activeBand];
        activeBand.disabled = !activeBand.disabled;
    }
    eqHolder.activeBand = -1;
    renderEq(eqHolder);
}

function handleMouseMove(e, eqHolder) {

    const eq = eqHolder.eq;

    if (eqHolder.activeBand >= 0) {

        const deltaX = e.offsetX - eqHolder.mouseX;
        const deltaXRel = deltaX / eqHolder.width;
        const origFrequency = eqHolder.freqOnMouseDown;
        const xOrigRel = logAbsToLinRel(origFrequency, eq.minFrequency, eq.maxFrequency);
        const newXRel = xOrigRel + deltaXRel;
        const newFrequency = linRelToLogAbs(newXRel, eq.minFrequency, eq.maxFrequency);
        eq.bands[eqHolder.activeBand].frequency = Math.max(eq.minFrequency, Math.min(newFrequency, eq.maxFrequency));

        const deltaY = eqHolder.mouseY - e.offsetY;
        const deltaYRel = deltaY / eqHolder.height;
        const origGain = eqHolder.gainOnMouseDown;
        const yOrigRel = (origGain - eq.minGain) / (eq.maxGain - eq.minGain);
        const newYRel = yOrigRel + deltaYRel;
        const newGain = eq.minGain + newYRel * (eq.maxGain - eq.minGain);
        eq.bands[eqHolder.activeBand].gain = Math.max(eq.minGain, Math.min(newGain, eq.maxGain));

        renderEq(eqHolder);
    }
}

function handleScroll(e, eqHolder) {

    const eq = eqHolder.eq;
    const closestBand = findClosestBand(e, eqHolder);
    const pixelDeltaY = -e.deltaY;
    const modifier = 1 - pixelDeltaY * 0.05;
    const newValue = eq.bands[closestBand].q * modifier;

    eq.bands[closestBand].q = Math.max(eq.minQ, Math.min(newValue, eq.maxQ));

    e.preventDefault();

    renderEq(eqHolder);
}

function findClosestBand(e, eqHolder) {

    const eq = eqHolder.eq;
    const width = eqHolder.width;
    const height = eqHolder.height;

    let closestBand = 0;
    let closestDistance = 2 * Math.max(width, height);
    for (let i = 0; i < eq.bands.length; i++) {
        const band = eq.bands[i];
        const xScreen = eqHolder.xOffset + logAbsToLinRel(band.frequency, eq.minFrequency, eq.maxFrequency) * width;
        const yScreen = eqHolder.yOffset + (1 - linAbsToLinRel(band.gain, eq.minGain, eq.maxGain)) * height;
        const dx = xScreen - e.offsetX;
        const dy = yScreen - e.offsetY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestBand = i;
        }
    }
    return closestBand;
}

function renderEq(eqHolder) {

    const eq = eqHolder.eq;
    const canvas = eqHolder.canvas;
    const xOffset = eqHolder.xOffset;
    const yOffset = eqHolder.yOffset;
    const width = eqHolder.width;
    const height = eqHolder.height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(xOffset, yOffset, width, height);

    renderGrid(ctx, eqHolder);

    ctx.beginPath();
    ctx.moveTo(xOffset, height / 2 + 0.5);

    const sum = [];
    for (let x = 0; x < width; x++) {
        sum.push(0);
    }

    const frequenciesPerPixel = computeFrequenciesPerPixel(eq, width);

    for (let band of eq.bands) {
        const gainsPerPixel = computeGains(band, frequenciesPerPixel);
        if (!band.disabled) {
            for (let x = 0; x < width; x++) {
                sum[x] += gainsPerPixel[x];
            }
        }

        ctx.beginPath();
        renderCurve(eq, ctx, gainsPerPixel, xOffset, yOffset, width, height);
        ctx.strokeStyle = band.disabled ? eqHolder.colors.disabledBandStroke : eqHolder.colors.bandStroke;
        ctx.stroke();

        renderDot(eqHolder, band, ctx, xOffset, yOffset, width, height);
    }

    ctx.beginPath();
    renderCurve(eq, ctx, sum, xOffset, yOffset, width, height);
    ctx.strokeStyle = eqHolder.colors.sumStroke;
    ctx.stroke();

    ctx.lineTo(xOffset + width, yOffset + height / 2 + 0.5);
    ctx.lineTo(xOffset, yOffset + height / 2 + 0.5);

    ctx.fillStyle = eqHolder.colors.sumFill;
    ctx.fill();
}

function renderGrid(ctx, eqHolder) {

    const eq = eqHolder.eq;
    const xOffset = eqHolder.xOffset;
    const yOffset = eqHolder.yOffset;
    const width = eqHolder.width;
    const height = eqHolder.height;

    const minExp = Math.ceil(Math.log10(eq.minFrequency));
    const maxExp = Math.floor(Math.log10(eq.maxFrequency));
    const minMult = Math.ceil((eq.minGain + 0.001) / 6.0);
    const maxMult = Math.floor((eq.maxGain - 0.001) / 6.0);
    const minMinorMult = Math.ceil((eq.minGain + 0.1) / 3.0);
    const maxMinorMult = Math.floor((eq.maxGain - 0.1) / 3.0);

    // minor grid

    ctx.beginPath();
    for (let i = minExp - 1; i <= maxExp; i++) {
        for (let j = 2; j < 10; j++) {
            let frequency = j * Math.pow(10, i);
            if (frequency > eq.minFrequency && frequency < eq.maxFrequency) {
                const x = Math.floor(xOffset + logAbsToLinRel(frequency, eq.minFrequency, eq.maxFrequency) * width) + 0.5;
                const y1 = yOffset;
                const y2 = yOffset + height;
                ctx.moveTo(x, y1);
                ctx.lineTo(x, y2);
            }
        }
    }
    for (let i = minMinorMult; i <= maxMinorMult; i++) {
        const gain = i * 3;
        if (gain % 6 != 0) {
            const x1 = xOffset;
            const x2 = xOffset + width;
            const y = Math.floor(yOffset + (1 - linAbsToLinRel(gain, eq.minGain, eq.maxGain)) * height) + 0.5;
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
        }
    }
    ctx.strokeStyle = eqHolder.colors.gridStrokeMinor;
    ctx.stroke();

    // major grid

    ctx.beginPath();
    for (let i = minExp; i <= maxExp; i++) {
        const frequency = Math.pow(10, i);
        const x = Math.floor(xOffset + logAbsToLinRel(frequency, eq.minFrequency, eq.maxFrequency) * width) + 0.5;
        const y1 = yOffset + parseFloat(eqHolder.labelGapTop);
        const y2 = yOffset + height;
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.font = eqHolder.font;
        ctx.textAlign = "center";
        ctx.fillStyle = eqHolder.colors.gridStrokeMajor;
        ctx.fillText(formatFrequencyLabel(frequency), x, yOffset + parseFloat(eqHolder.labelGapTop) / 2 + parseFloat(eqHolder.font) / 2);
    }
    for (let i = minMult; i <= maxMult; i++) {
        const gain = i * 6;
        const x1 = xOffset + parseFloat(eqHolder.labelGapLeft);
        const x2 = xOffset + width;
        const y = Math.floor(yOffset + (1 - linAbsToLinRel(gain, eq.minGain, eq.maxGain)) * height) + 0.5;
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.font = eqHolder.font;
        ctx.textAlign = "center";
        ctx.fillStyle = eqHolder.colors.gridStrokeMajor;
        ctx.fillText(formatGainLabel(gain), xOffset + parseFloat(eqHolder.labelGapLeft) / 2, y + parseFloat(eqHolder.font) / 2);
    }
    ctx.strokeStyle = eqHolder.colors.gridStrokeMajor;
    ctx.stroke();
}

function formatFrequencyLabel(frequency) {
    const f = frequency >= 1_000 ? frequency / 1_000 : frequency;
    const unit = frequency >= 1_000 ? 'kHz' : 'Hz';
    return `${f} ${unit}`;
}

function formatGainLabel(gain) {
    return gain < 0 ? `${gain} dB` : `+${gain} dB`;
}

function renderCurve(eq, ctx, gainsPerPixel, xOffset, yOffset, width, height) {
    const rel0 = (gainsPerPixel[0] - eq.minGain) / (eq.maxGain - eq.minGain);
    const y0 = (1 - rel0) * height;
    ctx.moveTo(xOffset, yOffset + y0 + 0.5);
    for (let x = 0; x < width; x++) {
        const rel = (gainsPerPixel[x] - eq.minGain) / (eq.maxGain - eq.minGain);
        const y = (1 - rel) * height;
        ctx.lineTo(xOffset + x, yOffset + y + 0.5);
    }
    const rel = (gainsPerPixel[width - 1] - eq.minGain) / (eq.maxGain - eq.minGain);
    const y = (1 - rel) * height;
    ctx.lineTo(xOffset + width, yOffset + y + 0.5);
}

function renderDot(eqHolder, band, ctx, xOffset, yOffset, width, height) {

    const eq = eqHolder.eq;
    const x = xOffset + logAbsToLinRel(band.frequency, eq.minFrequency, eq.maxFrequency) * width;
    const y = dotY(eq, band, yOffset, height);
    const radius = dotRadius(eq, band, width, height);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = band.disabled ? eqHolder.colors.disabledBandFill : eqHolder.colors.bandFill;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = band.disabled ? eqHolder.colors.disabledBandStroke : eqHolder.colors.sumStroke;
    ctx.fill();
}

function dotY(eq, band, yOffset, height) {
    if (band.type == HIGH_PASS || band.type == LOW_PASS) {
        return yOffset + (1 - linAbsToLinRel(-3.0, eq.minGain, eq.maxGain)) * height;
    }
    return yOffset + (1 - linAbsToLinRel(band.gain, eq.minGain, eq.maxGain)) * height;
}

function dotRadius(eq, band, width, height) {
    const maxRadius = Math.min(width / 32, height / 16);
    const minRadius = maxRadius / 4;
    const q = band.type == HIGH_SHELF || band.type == LOW_SHELF ? 1.0 : band.q;
    return minRadius + (1 - logAbsToLinRel(q, eq.minQ, eq.maxQ)) * (maxRadius - minRadius)
}

function computeFrequenciesPerPixel(eq, width) {

    const frequencies = [];
    for (let x = 0; x < width; x++) {
        let frequency = computeFrequency(x / width, eq);
        frequencies.push(frequency);
    }

    return frequencies;
}

function computeFrequency(x, eq) {
    const min = eq.minFrequency;
    const max = eq.maxFrequency;
    return linRelToLogAbs(x, min, max);
}

function linRelToLogAbs(rel, min, max) {
    const minLin = Math.log10(min);
    const maxLin = Math.log10(max);
    const valLin = minLin + rel * (maxLin - minLin);
    const valLog = Math.pow(10, valLin);
    return valLog;
}

function logAbsToLinRel(abs, min, max) {

    const absLin = Math.log10(abs);
    const minLin = Math.log10(min);
    const maxLin = Math.log10(max);

    return (absLin - minLin) / (maxLin - minLin);
}

function linAbsToLinRel(abs, min, max) {
    return (abs - min) / (max - min);
}

function computeGains(band, frequencies) {
    const gains = [];
    for (let f of frequencies) {
        const gain = computeGain(band, f);
        gains.push(gain);
    }
    return gains;
}

function computeGain(band, frequency) {

    if (band.type == BELL) {
        return computeBellGain(band, frequency);
    } else if (band.type == HIGH_PASS) {
        return computeHighPassGain(band, frequency);
    } else if (band.type == HIGH_SHELF) {
        return computeHighShelfGain(band, frequency);
    } else if (band.type == LOW_SHELF) {
        return computeLowShelfGain(band, frequency);
    }
}

function computeBellGain(band, frequency) {

    const f = band.frequency;
    const p = toPower(band.gain);
    const pR = toPr(p);
    const q = band.q;
    const f0 = f / frequency;
    const f1 = square(f0);
    const f2 = square(1 - f1);
    const q2 = square(1 / q);
    const n = square(f2) + square(q2 * pR * f1) + (f2 * f1 * square(pR) * q2) + (f2 * f1 * q2);
    const d = square(f2 + q2 * f1);
    const pOut = p >= 1 ? sqrt(n / d) : sqrt(d / n);
    const gainOut = toDB(pOut);

    return gainOut;
}

function computeHighPassGain(band, frequency) {

    const f = band.frequency;
    const f0 = f / frequency;
    const f1 = square(f0);
    const f2 = square(f1);
    const order = Math.max(0, Math.min(2 + Math.floor(2 * Math.log10(band.q)), 5));
    const ordOff = order == 0 ? 1 : order;

    let d = 1;

    for (let k = 0; k < (order + 1) / 2; k++) {
        const a = COEFFS[ordOff - 1][k];
        const b = COEFFS[ordOff - 1][k + 3];
        d *= (1 + (square(a) - 2 * b) * f1 + square(b) * f2);
    }

    const pOut = sqrt(1 / d);
    const gainOut = toDB(pOut);

    return gainOut;
}

function computeHighShelfGain(band, frequency) {

    const f = band.frequency;
    const p = toPower(band.gain);
    const pR = toPr(p);
    const f0 = f / frequency;
    const f1 = square(f0);
    const f2 = square(1 - f1);
    const d = square(f2 + 2 * f1);

    let f3;
    let n;
    let pOut;

    if (p >= 1) {
        f3 = square(p - f1);
        n = (f3 * f2) + (4 * p * f1 * f1) + (2 * p * f1 * f2) + (2 * f1 * f3);
        pOut = sqrt(n / d);
    } else {
        f3 = square(pR - f1);
        n = (f2 * f3) + (4 * pR * f1 * f1) + (2 * f1 * f3) + (2 * pR * f1 * f2);
        pOut = sqrt(d / n);
    }

    const gainOut = toDB(pOut);

    return gainOut;
}


function computeLowShelfGain(band, frequency) {

    const f = band.frequency;
    const p = toPower(band.gain);
    const pR = toPr(p);
    const f0 = f / frequency;
    const f1 = square(f0);
    const f2 = square(1 - f1);
    const d = f2 + 2 * f1;

    let n;
    let pOut;

    if (p >= 1) {
        n = square(1 - p * f1) + (2 * p) * f1;
        pOut = sqrt(n / d);
    } else {
        n = square(1 - pR * f1) + (2 * pR) * f1;
        pOut = sqrt(d / n);
    }

    const gainOut = toDB(pOut);

    return gainOut;
}

function toPower(gain) {
    return Math.pow(10, gain / 20);
}

function toPr(p) {
    return p >= 1 ? p : 1 / p;
}

function square(n) {
    return n * n;
}

function sqrt(n) {
    return Math.sqrt(n);
}

function toDB(p) {
    return 20 * Math.log10(p);
}
