let video;
let bodyPose;
let poses = [];
let connections;

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
}

function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}


function setup() {
  createCanvas(1152, 648);
  video = createVideo('nub.mov');
  video.size(1152, 648);
  video.hide();
  video.loop();
  video.volume(0); 

  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getConnections();
}

function draw() {
  image(video, 0, 0, width, height);

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

