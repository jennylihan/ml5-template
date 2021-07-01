let video;
let facemeshPrediction = null;
let posePrediction = null;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // load the facemesh model
  let facemesh = ml5.facemesh(video, () => {
    console.log("Facemesh model is ready!");

    // now load the poseNet model
    // we wait for facemesh to load first to prevent race conditions
    let poseNet = ml5.poseNet(video);

    // set up the "event listener" for facemesh
    facemesh.on("predict", (results) => {
      facemeshPrediction = results[0];
    });

    // set up the "event listener" for poseNet
    poseNet.on("pose", function (results) {
      posePrediction = results[0];
    });
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function draw() {
  image(video, 0, 0, width, height);

  drawFacemeshKeypoints();
  drawPoseNetKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawFacemeshKeypoints() {
  if (!facemeshPrediction) return;

  const keypoints = facemeshPrediction.scaledMesh;

  // Draw facial keypoints
  for (let i = 0; i < keypoints.length; i += 1) {
    const [x, y] = keypoints[i];

    fill(0, 255, 0); // green
    ellipse(x, y, 5, 5);
  }
}

// A function to draw ellipses over the detected keypoints
function drawPoseNetKeypoints() {
  if (!posePrediction) return;

  const keypoints = posePrediction.pose.keypoints;

  // Draw pose keypoints
  for (let i = 0; i < keypoints.length; i++) {
    const position = keypoints[i].position;

    fill(255, 0, 0); // red
    ellipse(position.x, position.y, 10, 10); // draw red dots
  }
}
