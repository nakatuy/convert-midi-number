let osc;
let note_name_list = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
let canvas;

function canvasSetup(){
  osc = new p5.Oscillator('sine');
  fft = new p5.FFT();
  osc.start(0, 440);
  osc.amp(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  canvasSetup();
}

function setup() {
  canvas = createCanvas(windowWidth,windowHeight);//2Dの場合は引数にWEBGLは要らない
  //canvas.position(0,0);//canvasをページの原点に固定
  canvas.style('z-index','-1');//canvasを後ろに移動する

  canvasSetup();
}

function draw() {
  frameRate(30);
  blendMode(BLEND);
  background(0, 0, 0, 50);
  noFill();
  blendMode(SCREEN);

  let waveform = fft.waveform();
  beginShape();
  stroke(10);

  for (let i = 0; i < waveform.length; i++){
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }

  for (var i = 1; i < 8; ++i) {
    strokeWeight(i * 1);
    stroke(45, 164 - (i * 14), 168, 250 - (i * 10));
  }
  endShape();
  
  let word1 = document.getElementById("output_midinumber").innerHTML;
  let word2 = document.getElementById("output_note_name").innerHTML;
  let word3 = document.getElementById("output_frequency").innerHTML;
  let word4 = "Volume：" + document.getElementById("vol").value;

  fill(9);
  noStroke();
  textSize(windowWidth/10);
  text(word1, 10, windowHeight*0.2);
  text(word2, 10, windowHeight*0.45);
  text(word3, 10, windowHeight*0.7);
  text(word4, 10, windowHeight*0.95);

  midiConvert();
  
}

function midiConvert() {
  let tuningFQ = document.getElementById("input_frequency").value;
  let midinumber = document.getElementById("input_midinumber").value;
  let note_name = note_name_list[midinumber % 12];
  let freq = tuningFQ * Math.pow(2 , (midinumber - 69) / 12); //周波数 f= 440×2(d-69)/12
  let volume = parseFloat(document.getElementById("vol").value);

  osc.freq(freq, 0.1);
  osc.amp(volume,0.1);

  midinumber = "MIDI Number：" + midinumber;
  note_name = "Note Name：" + note_name;
  outfreq = "Frequency：" + freq.toFixed(2) + " Hz";


  document.getElementById("output_midinumber").innerHTML = midinumber;
  document.getElementById("output_note_name").innerHTML = note_name;
  document.getElementById("output_frequency").innerHTML = outfreq;

}
