/**
 */
import { getImageHistogramHSV, normalizeVector } from '@/util/image';
import convert from 'color-convert';

function getColorRanges() {
  const colors = {};
  const hsvHues = {
    red: [355, 5],
    yellow: [55, 65],
    green: [115, 125],
    cyan: [175, 185],
    blue: [235, 245],
    magenta: [295, 305],
  };
  for (const hue in hsvHues) {
    colors[hue] = getColorRangeHsv(hsvHues[hue][0], hsvHues[hue][1]);
  }
  console.log(JSON.stringify(colors));
}

function getColorRangeHsv(lowerHue: number, upperHue: number) {
  const hsvColors: any[] = [];
  const hueStep = 1;
  const step = 1;
  const sLower = 80;
  const vLower = 80;
  const centerHue = (lowerHue + upperHue) / 2;

  function calculateWeight(h: number): number {
    const hueDiff = Math.min(
      Math.abs(h - centerHue),
      Math.abs(h - centerHue + 360),
      Math.abs(h - centerHue - 360)
    );
    return 1 - hueDiff / (upperHue - lowerHue);
  }

  const processHue = (h: number) => {
    const weight = calculateWeight(h);
    for (let s = sLower; s <= 100; s += step) {
      for (let v = vLower; v <= 100; v += step) {
        hsvColors.push({ color: [h, s, v], weight });
      }
    }
  };

  if (upperHue >= lowerHue) {
    for (let h = lowerHue; h <= upperHue; h += hueStep) {
      processHue(h);
    }
  } else {
    // e.g. red wraps from 355 to 5
    for (let h = lowerHue; h < 360; h += hueStep) {
      processHue(h);
    }
    for (let h = 0; h <= upperHue; h += hueStep) {
      processHue(h);
    }
  }

  const histogram: number[] = new Array(32 * 3).fill(0);

  for (let i = 0; i < hsvColors.length; i++) {
    const [h, s, v] = hsvColors[i].color;
    // Quantize the HSV values to fit the histogram bins
    const h_quantized = Math.floor(h / (360 / 64)) % 64;
    const s_quantized = Math.floor(s / (100 / 16)) % 16;
    const v_quantized = Math.floor(v / (100 / 16)) % 16;

    histogram[h_quantized]++;
    histogram[s_quantized + 64]++;
    histogram[v_quantized + 80]++;
    /*
    const weight = hsvColors[i].weight;
    histogram[h_quantized] += weight;
    histogram[s_quantized + 64] += weight;
    histogram[v_quantized + 80] += weight;
    */
  }
  const normalizedHistogram = normalizeVector(histogram);
  return normalizedHistogram;
}

function getColorRangeLab(lowerHue: number, upperHue: number) {
  const hsvColors: any[] = [];
  const hueStep = 1;
  const step = 1;
  const sLower = 80;
  const vLower = 80;
  const centerHue = (lowerHue + upperHue) / 2;

  function calculateWeight(h: number): number {
    const hueDiff = Math.min(
      Math.abs(h - centerHue),
      Math.abs(h - centerHue + 360),
      Math.abs(h - centerHue - 360)
    );
    return 1 - hueDiff / (upperHue - lowerHue);
  }

  const processHue = (h: number) => {
    const weight = calculateWeight(h);
    for (let s = sLower; s <= 100; s += step) {
      for (let v = vLower; v <= 100; v += step) {
        hsvColors.push({ color: [h, s, v], weight });
      }
    }
  };

  if (upperHue >= lowerHue) {
    for (let h = lowerHue; h <= upperHue; h += hueStep) {
      processHue(h);
    }
  } else {
    for (let h = lowerHue; h < 360; h += hueStep) {
      processHue(h);
    }
    for (let h = 0; h <= upperHue; h += hueStep) {
      processHue(h);
    }
  }

  const labColors = hsvColors.map(({ color }) => convert.hsv.lab(...color));

  const histogram: number[] = new Array(32 * 3).fill(0);

  for (let i = 0; i < labColors.length; i++) {
    const [L, a, b] = labColors[i];
    const weight = hsvColors[i].weight;
    const L_quantized = Math.floor(L / 8);
    const a_quantized = Math.floor((a + 128) / 8);
    const b_quantized = Math.floor((b + 128) / 8);

    histogram[L_quantized] += weight;
    histogram[a_quantized + 32] += weight;
    histogram[b_quantized + 64] += weight;
  }
  const normalizedHistogram = normalizeVector(histogram);
  return normalizedHistogram;
}

async function testHisto() {
  const file =
    'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/54.49_SL1.jpg';

  const x = await getImageHistogramHSV(file);

  console.log(x);
}

async function run() {
  //testHisto();
  getColorRanges();
}

run();
