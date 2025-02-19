// Jungle.mjs

function createFadeBuffer(context, activeTime, fadeTime) {
  const length1 = activeTime * context.sampleRate;
  const length2 = (activeTime - 2 * fadeTime) * context.sampleRate;
  const length = length1 + length2;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const p = buffer.getChannelData(0);

  console.log("createFadeBuffer() length = " + length);

  const fadeLength = fadeTime * context.sampleRate;

  const fadeIndex1 = fadeLength;
  const fadeIndex2 = length1 - fadeLength;

  // 1st part of cycle
  for (let i = 0; i < length1; ++i) {
    let value;

    if (i < fadeIndex1) {
      value = Math.sqrt(i / fadeLength);
    } else if (i >= fadeIndex2) {
      value = Math.sqrt(1 - (i - fadeIndex2) / fadeLength);
    } else {
      value = 1;
    }

    p[i] = value;
  }

  // 2nd part
  for (let i = length1; i < length; ++i) {
    p[i] = 0;
  }

  return buffer;
}

function createDelayTimeBuffer(context, activeTime, fadeTime, shiftUp) {
  const length1 = activeTime * context.sampleRate;
  const length2 = (activeTime - 2 * fadeTime) * context.sampleRate;
  const length = length1 + length2;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const p = buffer.getChannelData(0);

  console.log("createDelayTimeBuffer() length = " + length);

  // 1st part of cycle
  for (let i = 0; i < length1; ++i) {
    if (shiftUp) {
      // This line does shift-up transpose
      p[i] = (length1 - i) / length;
    } else {
      // This line does shift-down transpose
      p[i] = i / length1;
    }
  }

  // 2nd part
  for (let i = length1; i < length; ++i) {
    p[i] = 0;
  }

  return buffer;
}

const delayTime = 0.1;
const fadeTime = 0.05;
const bufferTime = 0.1;

export default class Jungle {
  constructor(context) {
    this.context = context;
    const input = context.createGain();
    const output = context.createGain();
    this.input = input;
    this.output = output;

    const mod1 = context.createBufferSource();
    const mod2 = context.createBufferSource();
    const mod3 = context.createBufferSource();
    const mod4 = context.createBufferSource();
    this.shiftDownBuffer = createDelayTimeBuffer(
      context,
      bufferTime,
      fadeTime,
      false
    );
    this.shiftUpBuffer = createDelayTimeBuffer(
      context,
      bufferTime,
      fadeTime,
      true
    );
    mod1.buffer = this.shiftDownBuffer;
    mod2.buffer = this.shiftDownBuffer;
    mod3.buffer = this.shiftUpBuffer;
    mod4.buffer = this.shiftUpBuffer;
    mod1.loop = true;
    mod2.loop = true;
    mod3.loop = true;
    mod4.loop = true;

    const mod1Gain = context.createGain();
    const mod2Gain = context.createGain();
    const mod3Gain = context.createGain();
    mod3Gain.gain.value = 0;
    const mod4Gain = context.createGain();
    mod4Gain.gain.value = 0;

    mod1.connect(mod1Gain);
    mod2.connect(mod2Gain);
    mod3.connect(mod3Gain);
    mod4.connect(mod4Gain);

    const modGain1 = context.createGain();
    const modGain2 = context.createGain();

    const delay1 = context.createDelay();
    const delay2 = context.createDelay();
    mod1Gain.connect(modGain1);
    mod2Gain.connect(modGain2);
    mod3Gain.connect(modGain1);
    mod4Gain.connect(modGain2);
    modGain1.connect(delay1.delayTime);
    modGain2.connect(delay2.delayTime);

    const fade1 = context.createBufferSource();
    const fade2 = context.createBufferSource();
    const fadeBuffer = createFadeBuffer(context, bufferTime, fadeTime);
    fade1.buffer = fadeBuffer;
    fade2.buffer = fadeBuffer;
    fade1.loop = true;
    fade2.loop = true;

    const mix1 = context.createGain();
    const mix2 = context.createGain();
    mix1.gain.value = 0;
    mix2.gain.value = 0;

    fade1.connect(mix1.gain);
    fade2.connect(mix2.gain);

    input.connect(delay1);
    input.connect(delay2);
    delay1.connect(mix1);
    delay2.connect(mix2);
    mix1.connect(output);
    mix2.connect(output);

    const t = context.currentTime + 0.05;
    const t2 = t + bufferTime - fadeTime;
    mod1.start(t);
    mod2.start(t2);
    mod3.start(t);
    mod4.start(t2);
    fade1.start(t);
    fade2.start(t2);

    this.mod1 = mod1;
    this.mod2 = mod2;
    this.mod1Gain = mod1Gain;
    this.mod2Gain = mod2Gain;
    this.mod3Gain = mod3Gain;
    this.mod4Gain = mod4Gain;
    this.modGain1 = modGain1;
    this.modGain2 = modGain2;
    this.fade1 = fade1;
    this.fade2 = fade2;
    this.mix1 = mix1;
    this.mix2 = mix2;
    this.delay1 = delay1;
    this.delay2 = delay2;

    this.setDelay(delayTime);
  }

  setDelay(delayTime) {
    this.modGain1.gain.setTargetAtTime(0.5 * delayTime, 0, 0.01);
    this.modGain2.gain.setTargetAtTime(0.5 * delayTime, 0, 0.01);
  }

  setPitchOffset(mult) {
    if (mult > 0) {
      this.mod1Gain.gain.value = 0;
      this.mod2Gain.gain.value = 0;
      this.mod3Gain.gain.value = 1;
      this.mod4Gain.gain.value = 1;
    } else {
      this.mod1Gain.gain.value = 1;
      this.mod2Gain.gain.value = 1;
      this.mod3Gain.gain.value = 0;
      this.mod4Gain.gain.value = 0;
    }
    this.setDelay(delayTime * Math.abs(mult));
  }
}
