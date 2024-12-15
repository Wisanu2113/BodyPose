let video;
let handPose;
let connections;
let hands = [];
let emitters = [];
let img;

function preload() {
  handPose = ml5.handPose();
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

// 960,540
//1920,1080
//1152,648
function setup() {
  let canvas = createCanvas(1152,648);
  canvas.id('myCanvas');

  // แทนที่ createCapture ด้วย createVideo
  video = createVideo('nub.mov', videoLoaded);
  video.size(1152,648);
  video.hide(); // ซ่อนวิดีโอ HTML DOM

  // สร้าง emitter แค่หนึ่งตัว
  emitters.push(new Emitter(width / 2, height / 2));

  background(0);
}

function videoLoaded() {
  video.loop(); // เล่นวิดีโอซ้ำ
  video.volume(0); // ปิดเสียง
  handPose.detectStart(video, gotHands); // เริ่มตรวจจับจากวิดีโอ
}

function draw() {
  clear();
  image(video, 0, 0);
  blendMode(ADD);

  // ตรวจสอบว่ามีการตรวจจับมือ
  if (hands.length > 0) {
    for (let hand of hands) {
      // ดึงข้อมูล keypoint ของปลายนิ้วชี้ (index 8)
      let indexFingerTip = hand.keypoints[8]; // ปลายนิ้วชี้
      if (indexFingerTip) {
        // อัปเดตตำแหน่ง emitter ให้อยู่ที่ปลายนิ้วชี้
        let emitter = emitters[0]; // ใช้ emitter ตัวแรก (หรือกำหนด index ตามต้องการ)
        emitter.origin.x = indexFingerTip.x;
        emitter.origin.y = indexFingerTip.y;
        emitter.addParticle();
      }
    }
  }
  
  // รัน emitter เพื่อสร้างและแสดงผลอนุภาค
  for (let emitter of emitters) {
    emitter.run();
  }
}
