import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from 'react-bootstrap/Modal';
import { InfoIcon } from "../icons/infoIcon";
import StatusConsole from "../widgets/statusConsole";

const features = ["#DC143C", "#FF7F50", "#FF8C00", "#FFD700", "#9ACD32", 
	"#00FA9A", "#008080", "#00FFFF", "#00BFFF", "#0000CD", "#BA55D3", "#EE82EE", 
	"#FF00FF", "#FFB6C1", "#FF149", "#B0C4DE", "#778899", "#708090", "#2F4F4F",
	"#7FFFD4", "#F0FFFF", "#F5F5DC", "#FFE4C4", "#FFEBCD", "#F5DEB3", "#DEB887"];

function sample(array, n){
	let arrayIndexes =  [...Array(array.length).keys()];
	let sample = [];
	let randomIndex = 0;
	
	for (let i = 0; i < n; i++){
		randomIndex = Math.floor(Math.random() * arrayIndexes.length);
		sample.push(array[arrayIndexes[randomIndex]]);
		arrayIndexes.splice(randomIndex, 1);
	}
	
	return sample;
}

export default function PreferenceDispersion() {
	const [neighborhood, setNeighborhood] = useState(new Map());
	const [turtles, setTurtles] = useState(new Map());
	const [consoleOutputs, setConsoleOutputs] = useState([]);
	const [isRunning, setIsRunning] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
	const [bubbles, setBubbles] = useState(new Map());
	const [showInstructions, setShowInstructions] = useState(false);

	const [numTurtles, setNumTurtles] = useState(30);
	const [numFeatures, setNumFeatures] = useState(5);
	const [searchRadius, setSearchRadius] = useState(50);
	const [maxIterations, setMaxIterations] = useState(500);
	const [stepInterval, setStepInterval] = useState(10);

	const timer = (ms) => new Promise((res) => setTimeout(res, ms));

	const updateConsoleUpdate = (outputStr) => {
		setConsoleOutputs([...consoleOutputs, outputStr]);
	}

	const replaceConsoleUpdate = (outputStr) => {
		setConsoleOutputs([outputStr]);
	}
	
	// useEffect(() => {
	// 	console.log(consoleOutputs);
	// }, [consoleOutputs]);
	
	const init_scene = () => {
		const popNum = numTurtles;
		// const searchRadius = 50;

		replaceConsoleUpdate("Initializing scene...");
		let turtles = populate(popNum, numFeatures);
		setTurtles(turtles);
		
		let neighborhood = new Map();
		for (let [key, value] of turtles){
			let neighbors = findNeighbors(key, value['bound'], turtles, 
			searchRadius);
			neighborhood.set(key, neighbors);
		}
		setNeighborhood(neighborhood);
		setIsInitialized(true);
	}
	
	async function run_sim() {
		// const maxIterations = 500;

		updateConsoleUpdate("Running simulation...");
		for (let i = 0; i < maxIterations; i++){
			axelrodDispersion(neighborhood, turtles, 1);
			await timer(10);
		}
		await timer(2000);
		updateConsoleUpdate("Simulation complete.");
	}
	
	const populate = (n, m) => {
		clearCanvas();
		let turtleCoords = new Map();
		let turtles = new Map();
		for (let i = 0; i < n; i++){
			let turtleColors = sample(features, m);
			let centerX = 24+Math.random()*456;
			let centerY = 24+Math.random()*456; 
	
			let turtleBound = {
				"top": centerY-24,
				"bottom": centerY+24,
				"left": centerX-24,
				"right": centerX+24
			}
	
			// check if turtle is overlapping with any other turtle
			let overlap = false;
			for (let [key, value] of turtleCoords){
				if (value.top < turtleBound.bottom && 
					value.bottom > turtleBound.top && 
					value.left < turtleBound.right && 
					value.right > turtleBound.left){
					overlap = true;
					break;
				}
			}
			if (overlap){
				i--;
				continue;
			}
			let turtle = {
				"centerX": centerX,
				"centerY": centerY,
				"colors": new Set(turtleColors),
				"bound": turtleBound
			}
			turtleCoords.set(i, turtleBound);
			turtles.set(i, turtle);
			drawTurtle(centerX, centerY, turtleColors, i);
		}
		return turtles;
	}
	
	const findNeighbors = (host, turtleBound, turtles, searchRadius) => {
		let neighbors = [];
		for (let [key, value] of turtles){
			if (value['bound'].top < turtleBound.bottom + searchRadius &&
			value['bound'].bottom > turtleBound.top - searchRadius &&
			value['bound'].left < turtleBound.right + searchRadius &&
				value['bound'].right > turtleBound.left - searchRadius &&
				key !== host){
					neighbors.push(key);
			}
		}
		return neighbors;
	}
	
	const drawTurtle = (posX, posY, turtleColors, label) => {
		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");
		
		// head
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.arc(posX, posY-18, 8, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	
		// tail
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.beginPath();
		ctx.moveTo(posX-5, posY+6);
		ctx.lineTo(posX+5, posY+6);
		ctx.lineTo(posX, posY+22);
		ctx.fill();
		ctx.stroke();
	
		// left hind leg
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.ellipse(posX-10, posY+13, 5, 7, Math.PI/4, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	
		// right hind leg
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.ellipse(posX+10, posY+13, 5, 7, -Math.PI/4, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	
		// left front leg
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.ellipse(posX-11, posY-10, 5, 7, -Math.PI/4, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	
		// right front leg
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.ellipse(posX+11, posY-10, 5, 7, Math.PI/4, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();

		// label
		ctx.font = "10px Arial";
		ctx.fillStyle = "white";
		let labelStr = label.toString();
		if (labelStr.length === 1){
			labelStr = "0" + labelStr;
		}
		ctx.fillText(labelStr, posX-6, posY-16);
		
		// body
		ctx.beginPath();
		ctx.fillStyle = turtleColors[0];
		ctx.ellipse(posX, posY, 13, 16, 0, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
		
		// shell
		ctx.beginPath();
		ctx.fillStyle = turtleColors[1];
		ctx.fillRect(posX, posY, 10, 10);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.fillStyle = turtleColors[2];
		ctx.fillRect(posX-10, posY, 10, 10);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.fillStyle = turtleColors[3];
		ctx.fillRect(posX-10, posY-10, 10, 10);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.fillStyle = turtleColors[4];
		ctx.fillRect(posX, posY-10, 10, 10);
		ctx.stroke();
	}
	
	const clearCanvas = () => {
		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	const axelrodDispersion = (neighborhood, turtles, maxIterations) => {
		setIsRunning(true);
		
		let myturtles = new Map();
		turtles.forEach((val, key) => myturtles.set(key, turtles.get(key)));
		
		let bubbleCitizen = new Map();
		let bubbles = new Map();
		
		let turtleColorChange = new Map();
		let turtleInBubble = 0;
		let iterCount = 0;
	
		while (turtleInBubble !== myturtles.length && iterCount < maxIterations){

			// pick a random turtle
			const turtleIdx = Math.floor(Math.random()*myturtles.size);
			let turtle = myturtles.get(turtleIdx);

			// pick a random neighbor
			if (neighborhood.get(turtleIdx).length === 0){
				continue;
			}
			let neighborIdx = neighborhood.get(turtleIdx)[Math.floor(Math.random()*
				neighborhood.get(turtleIdx).length)];
			let neighbor = turtles.get(neighborIdx);

			// check feature overlap
			let overlap = [...turtle['colors']].filter(x => neighbor['colors'].has(x));
			if (overlap.length === turtle['colors'].size){
				// turtle and neighbor share all features
				// sort color strings in ascending order
				let turtleColors = [...turtle['colors']].sort();
				let neighborColors = [...neighbor['colors']].sort();

				// concat color strings to form a string key
				let turtleKey = turtleColors.join("");
				let neighborKey = neighborColors.join("");

				// add them to the same bubble
				if (bubbles.has(turtleKey)){
					if (!bubbles.get(turtleKey).has(turtleIdx)){
						bubbles.get(turtleKey).add(turtleIdx);
					}
				} else {
					bubbles.set(turtleKey, new Set([turtleIdx]));
				}
				// add turtle to bubbleCitizen
				bubbleCitizen.set(turtleIdx, turtleKey);
				turtleInBubble++;
				if (bubbles.has(neighborKey)){
					if (!bubbles.get(neighborKey).has(neighborIdx)){
						bubbles.get(neighborKey).add(neighborIdx);
					}
				} else {
					bubbles.set(neighborKey, new Set([neighborIdx]));
				}
				// add neighbor to bubbleCitizen
				bubbleCitizen.set(neighborIdx, neighborKey);
				turtleInBubble++;
			} else if (overlap.length === 0){
				if (turtleColorChange.has(turtleIdx)){
					if (turtleColorChange.get(turtleIdx) === turtles.length){
						// add turtle to its own bubble
						let turtleKey = [...turtle['colors']].sort().join("");
						bubbles.set(turtleKey, [turtleIdx]);
					}
				}
			} else {
				if (bubbleCitizen.has(turtleIdx)){
					// turtle is already in a bubble and is resistant to change
					console.log("turtle is already in a bubble and is resistant to change");
					continue;
				}
				let turtleDiff = [...turtle['colors']].filter(x => !neighbor['colors'].has(x));
				let neighborDiff = [...neighbor['colors']].filter(x => !turtle['colors'].has(x));
				
				// pick random feature from neighbor
				let featureIdx = Math.floor(Math.random()*neighborDiff.length);
				
				// replace random feature in turtle with feature from neighbor
				turtle['colors'].delete(turtleDiff[featureIdx]);
				turtle['colors'].add(neighborDiff[featureIdx]);
				turtles.set(turtleIdx, turtle);
				drawTurtle(turtle['centerX'], turtle['centerY'], 
					[...turtle['colors']].sort(), turtleIdx);
				if (turtleColorChange.has(turtleIdx)){
					turtleColorChange.set(turtleIdx, turtleColorChange.get(turtleIdx)+1);
				} else {
					turtleColorChange.set(turtleIdx, 1);
				}
			}
			iterCount++;
			// await timer(100);
		}
		setBubbles(bubbles);
		setIsRunning(false);
	}
	
	return (
		<Container className="d-flex">
			<Col md={8}>
				<div className="viewport d-flex">
					<Col md={4}>
						<div className="instructionBlock">
							<h2>How do filter bubbles form?</h2>
							<p>Filter bubbles form when you are only exposed to
								content that agrees with your beliefs and opinions.
								You can think of it as a bubble that filters out
								content that disagrees with your beliefs and opinions.
							</p>
							<Button variant="secondary" onClick={() => setShowInstructions(true)}>
								Show Instructions
							</Button>
							<Modal show={showInstructions} onHide={() => setShowInstructions(false)}>
								<Modal.Header closeButton>
									<Modal.Title>Instructions</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<p>
										On the right, you can see a canvas and a side panel.
										Clicking the
										<span className="inlineEmph">
											initialize
										</span>
										button will create a bunch of
										turtles on the canvas. Each turtle has 5 different
										colors on their shell. Think of these colors as
										each turtle's beliefs and opinions.
									</p>
									<h3>Steps</h3>
									<ol>
										<li>Click the <span className="inlineEmph">initialize</span> button to create turtles.</li>
										<li>Click the <span className="inlineEmph">run</span> button to start the simulation.</li>
									</ol>
									<p>
										Each turtle will randomly select a neighbor turtle
										and compare their beliefs and opinions. If the
										turtles have at least one belief or opinion in
										common, they will interact with one another. During
										the interaction, the turtle will gain a new belief
										or opinion from the neighbor turtle.
									</p>
									<p>
										After a certain number of interactions, the turtle
										will become resistant to change. This means that
										the turtle will not change its beliefs and opinions.
										This is because it is surrounded by turtles with similar 
										beliefs and opinion. So, the turtle does not have anything
										in common with other turtles.
									</p>
									<p>
										See what happens when you run the simulation!
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button variant="secondary" onClick={() => setShowInstructions(false)}>
										Close
									</Button>
								</Modal.Footer>
							</Modal>
							<hr></hr>
							<h3>Try these.</h3>
							<h3>After clicking the initialize button.</h3>
							<ol>
								<li>Count the number of different turtles.</li>
								<li>Count the number of different colors.</li>
							</ol>

							<h3>After clicking the run button.</h3>
							<ol>
								<li>Count the number of different turtles.</li>
								<li>How many groups of turtles do you see?</li>
							</ol>
						</div>
					</Col>
					<Col md={8}>
						<canvas id="canvas" width="500" height="500" />
					</Col>
				</div>
			</Col>
			<Col md={4}>
				<div className="sidePanel">
					<div>
						<InputGroup className="mb-1">
								<InputGroup.Text className="panelInput" id="num-turtles-var">
									n
								</InputGroup.Text>
							<Form.Control
								placeholder="Number of turtles"
								aria-label="Number of turtles"
								aria-describedby="num-turtles"
								value={numTurtles}
								onChange  ={(e) => { setNumTurtles(e.target.value) }}
								/>
								<InputGroup.Text className="panelInput" id="num-turtles-info">
									<InfoIcon itemkey='num-turtles-tooltip' placement='right' text='This is the variable that denotes the number of turtles in the population.'/>
								</InputGroup.Text>
						</InputGroup>
						<InputGroup className="mb-1">
							<InputGroup.Text className="panelInput" id="num-features">
								m
							</InputGroup.Text>
							<Form.Control
								placeholder="Number of features"
								aria-label="Number of features"
								aria-describedby="num-features"
								value={numFeatures}
								onChange={(e)=>{ setNumFeatures(e.target.value) }}
							/>
							<InputGroup.Text className="panelInput" id="num-features-info">
								<InfoIcon itemkey='num-features-tooltip' placement='right' text='This is the variable that denotes the number of features each turtle has.'/>
							</InputGroup.Text>
						</InputGroup>
						<InputGroup className="mb-1">
							<InputGroup.Text className="panelInput" id="search-radius">
								r
							</InputGroup.Text>
							<Form.Control
								placeholder="Search radius"
								aria-label="Search radius"
								aria-describedby="search-radius"
								value={searchRadius}
								onChange={(e) => { setSearchRadius(e.target.value) }}
							/>
							<InputGroup.Text className="panelInput" id="search-radius-info">
								<InfoIcon itemkey='search-radius-tooltip' placement='right' text='This is the variable that denotes the search radius of each turtle.'/>
							</InputGroup.Text>
						</InputGroup>
						<InputGroup className="mb-1">
							<InputGroup.Text className="panelInput" id="num-iterations">
								k
							</InputGroup.Text>
							<Form.Control
								placeholder="Maximum iterations"
								aria-label="Maximum iterations"
								aria-describedby="num-iterations"
								value={maxIterations}
								onChange={(e) => { setMaxIterations(e.target.value) }}
							/>
							<InputGroup.Text className="panelInput" id="num-iterations-info">
								<InfoIcon itemkey='num-iterations-tooltip' placement='right' text='This is the variable that denotes the maximum number of iterations the simulation will run for.'/>
							</InputGroup.Text>
						</InputGroup>
					</div>
					<div>
						<Button variant="primary" className="panelBtn" 
							disabled={isRunning}
							onClick={init_scene}>
							Initialize
						</Button>
					</div>
					<StatusConsole consoleOutputs={consoleOutputs} />
					<div>
						<InputGroup className="mb-1">
							<InputGroup.Text className="panelInput" id="number-iterations-per-step" >
								k
							</InputGroup.Text>
							<Form.Control
								placeholder="Maximum iterations"
								aria-label="Maximum iterations"
								aria-describedby="num-iterations-per-step"
								value={stepInterval}
								onChange={(e) => { setStepInterval(e.target.value) }}
							/>
							<InputGroup.Text className="panelInput" id="num-iterations-per-step-info">
								<InfoIcon itemkey='num-iterations-per-step-tooltip' placement='right' text='This is the variable that denotes the number of iterations the simulation will run for each step when you use the Step button.' />
							</InputGroup.Text>
						</InputGroup>
					</div>
					<div>
						<Button variant="secondary" className="panelBtn"
							disabled={isRunning || !isInitialized}
							onClick={() => {
								axelrodDispersion(neighborhood, turtles, stepInterval)
							}
							}>
							Step
						</Button>
						<Button variant="primary" className="panelBtn"
							disabled={isRunning || !isInitialized}
							onClick={run_sim}>
							Run
						</Button>
					</div>
				</div>
			</Col>
		</Container>
	);
}
