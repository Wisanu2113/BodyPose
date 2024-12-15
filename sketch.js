let video;
let handPose;
let connections;
let hands = [];
let emitters = [];
let img;

let bodyPose;
let poses = [];

function preload() {
  handPose = ml5.handPose();
  bodyPose = ml5.bodyPose();
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function gotPoses(results) {
  poses = results;
}

// 960,540
//1920,1080
//1152,648
function setup() {
  createCanvas(1152,648);
  video = createVideo('nub.mov');
  video.size(1152,648);
  video.hide(); 
  video.loop(); 
  video.volume(1); 
 
  handPose.detectStart(video, gotHands);
  emitters.push(new Emitter(width / 2, height / 2));
  
  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getConnections();
  background(0);
}

function draw() {
  clear();
  image(video, 0, 0, width, height);
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


  //BodyPose
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];
      if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
        stroke(0, 255, 0);
        strokeWeight(2);
        line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    }
  }
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.confidence > 0.1) {
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }


}
