let canvasSize;
let circleRadius;
let speedSlider;
let spinStartTime;
let spinSpeed = 10;
let spinning = true;
let brushSize = 200;
let lastMouseX;
let lastMouseY;
let mouseStillTime = 0;
let currentColor;
let lines = [];
let rotationAngle = 0;
let bgColorButton;
let bgColorPicker;
let circleBackgroundColor = '#ffffff';

function setup() {
  canvasSize = min(windowWidth, windowHeight) * 0.9;
  circleRadius = canvasSize / 3;
  createCanvas(canvasSize, canvasSize);
  background(255);
  angleMode(DEGREES);
  colorMode(RGB, 255, 255, 255, 255);
  currentColor = color(0, 0, 0, 100);
	keyPressed = function() {
  if (keyCode === 32) { // Spacebar
    saveCanvas(canvas, 'myCircleImage', 'png');
    }
  };



	

  // Create color buttons
  for (let i = 0; i < 12; i++) {
    const hue = map(i, 0, 12, 0, 360);
    const button = createButton('');
    button.style('background-color', color('hsba(' + hue + ', 100%, 100%, 255)'));
    button.position(20 + (i * 30), 20);
    button.size(20, 20);
    button.mousePressed(() => {
      colorMode(HSB, 360, 100, 100, 255);
      currentColor = color(hue, 100, 100, 100);
      colorMode(RGB, 255, 255, 255, 255);
    });
		}
			
		bgColorButton = createButton('Background');
		bgColorButton.position(20, 100);
		bgColorButton.mousePressed(showColorPicker);

		bgColorPicker = createColorPicker('#ffffff');
		bgColorPicker.position(120, 100);
		//bgColorPicker.hide();
		bgColorPicker.input(setBackgroundColor);
	
		// Create the label
		saveLabel = createP('Press spacebar to save the image');
		saveLabel.position(width, height + 20);
		saveLabel.style('font-size', '14px');
		saveLabel.style('text-align', 'center');
		saveLabel.style('width', '200px');

		
		let speedLabel = createSpan('Speed: ');
		speedLabel.position(20, 140);
		speedLabel.style('font-size', '18px');

		speedSlider = createSlider(0, 10, 10, 0.1);
		speedSlider.position(80, 140);
}
function showColorPicker() {
  bgColorPicker.show();
}

function setBackgroundColor() {
  circleBackgroundColor = bgColorPicker.color();
}

function startSpinTimer() {
  spinStartTime = millis();
}

function setSpinSpeed() {
  let pressDuration = millis() - spinStartTime;
  spinSpeed = map(pressDuration, 0, 5000, 0, 10, true);
}

function stopSpin() {
  spinSpeed = 0;
}
function draw() {
  background(255);
  translate(width / 2, height / 2);

  rotationAngle += speedSlider.value();

  // Draw the circle
  fill(circleBackgroundColor);
  stroke(0); // Set the stroke color to black
  strokeWeight(1);
  circle(0, 0, circleRadius * 2);

  // Draw stored lines
  noFill();
  for (let lineInfo of lines) {
    stroke(lineInfo.color);
    strokeWeight(lineInfo.weight);
    rotate(rotationAngle);
    line(lineInfo.x1, lineInfo.y1, lineInfo.x2, lineInfo.y2);
    rotate(-rotationAngle);
  }

  // Draw on the circle
  if (mouseIsPressed && dist(mouseX, mouseY, width / 2, height / 2) <= circleRadius) {
    // Calculate the maximum allowed brush size based on the distance to the circle's edge
    const distanceToEdge = circleRadius - dist(mouseX, mouseY, width / 2, height / 2);
    const maxBrushSize = min(distanceToEdge, 100);

    if (lastMouseX === mouseX && lastMouseY === mouseY) {
      mouseStillTime++;
      brushSize = map(mouseStillTime, 0, 60, 1, maxBrushSize, true);
    } else {
      mouseStillTime = 0;
      brushSize = 10;
    }

    // Limit the brush size to the maximum allowed brush size
    brushSize = min(brushSize, maxBrushSize);

    strokeWeight(spinning ? brushSize * 0.5 : brushSize);
    stroke(currentColor);

    const rotatedPmouse = rotatePoint(pmouseX - width / 2, pmouseY - height / 2, -rotationAngle);
    const rotatedMouse = rotatePoint(mouseX - width / 2, mouseY - height / 2, -rotationAngle);

    line(rotatedPmouse.x, rotatedPmouse.y, rotatedMouse.x, rotatedMouse.y);

    // Store line information
    lines.push({
      x1: rotatedPmouse.x,
      y1: rotatedPmouse.y,
      x2: rotatedMouse.x,
      y2: rotatedMouse.y,
      color: currentColor,
      weight: spinning ? brushSize * 0.5 : brushSize,
    });
  } else {
    mouseStillTime = 0;
  }

  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

  
function rotatePoint(x, y, angle) {
  return {
    x: x * cos(angle) - y * sin(angle),
    y: x * sin(angle) + y * cos(angle),
  };
	
}
