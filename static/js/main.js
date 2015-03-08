// Globals variables -------------------------------

var scene, camera, renderer, player;

var clock;

var stats;

// Stats -------------------------------------------

function initStats() {
	var stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.getElementById("Stats-output").appendChild(stats.domElement);
	return stats;
}

// Map ---------------------------------------------

var map =   "XXXXXXX  \n" +
			"X     X  \n" +
			"X  S  X  \n" +
			"X     X  \n" +
			"X   S XXX\n" +
			"XXX     X\n" +
			"  XX  S X\n" +
			"   X    X\n" +
			"   XXXXXX";

map = map.split("\n");

var spawnPoints = [];

var HORIZONTAL_UNIT = 100,
	VERTICAL_UNIT   = 100,
	ZSIZE = map.length * HORIZONTAL_UNIT,
	XSIZE = map[0].length * HORIZONTAL_UNIT,
	INV_MAX_FPS = 1 / 60;

var frameDelta = 0,
	paused = true;

function setupMap() {
	for (var i = 0, rows = map.length; i < rows; i++) {
		for (var j = 0, cols = map[i].length; j< cols; j++) {
			addVoxel(map[i].charAt(j), i, j);
		}
	}
	var floorGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 1, 1);
	var floorMaterial = new THREE.MeshPhongMaterial({color: 'grey'});
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -90 * Math.PI / 180;
	floor.receiveShadow = true;
	scene.add(floor);
}

function addVoxel(type, row, col) {
	var z = (row+1) * HORIZONTAL_UNIT - ZSIZE * 0.5,//1 * 100 - 4,5
		x = (col+1) * HORIZONTAL_UNIT - XSIZE * 0.5;
	switch (type) {
		case ' ': break;
		case 'S':
			spawnPoints.push(new THREE.Vector3(x, 0, z));
			break;
		case 'X':
			var geo = new THREE.BoxGeometry(HORIZONTAL_UNIT, VERTICAL_UNIT, HORIZONTAL_UNIT);
			var material = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
			//var material = new THREE.MeshDepthMaterial();
			var mesh = new THREE.Mesh(geo, material);
			mesh.position.set(x, VERTICAL_UNIT*0.5, z);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			scene.add(mesh);
	}

}

// Animation --------------------------------

function startAnimating() {
	if(paused) {
		stats.begin();
		paused = false;
		clock.start();
		requestAnimationFrame(animate);
	}
}


function stopAnimating() {
	stats.end();
	paused = true;
	clock.stop();
}

function animate() {
	frameDelta += clock.getDelta();
	while (frameDelta >= INV_MAX_FPS) {
		update(INV_MAX_FPS);
		frameDelta -= INV_MAX_FPS;
	}
	stats.update();
	renderer.render(scene, camera);
	if (!paused) {
		requestAnimationFrame(animate);
	}
}

// Setup

function setup() {
	stats = initStats();
	setupThreeJS();
	setupWorld();
}

function setupThreeJS() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
	camera.position.y = 50;

	var axes = new THREE.AxisHelper(20);
	scene.add(axes);

	clock = new THREE.Clock(false);

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor("#d7f0f7");
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;

	document.body.appendChild(renderer.domElement);
}

function setupWorld() {
	setupMap();
	addLight();

	player = new Player();
	player.add(camera);
	scene.add(player);
}

// Light

function addLight() {
	var directionalLight1 = new THREE.DirectionalLight(0xFFFFFF, 0.6);
	directionalLight1.position.set(0,400,400);
	directionalLight1.shadowCameraNear   = 0.1;
	directionalLight1.shadowCameraFar    = 5000;
	directionalLight1.shadowCameraLeft   = -5000;
	directionalLight1.shadowCameraRight  = 5000;
	directionalLight1.shadowCameraBottom = -5000;
	directionalLight1.shadowCameraTop    = 5000;
	directionalLight1.shadowCameraVisible= true;
	directionalLight1.shadowDarkness     = 0.4;
	directionalLight1.shadowMapWidth     = 2048;
	directionalLight1.shadowMapHeight    = 2048;
	directionalLight1.castShadow         = true;
	scene.add(directionalLight1);

	var directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.3);
	directionalLight2.position.set(400,400,-100);
	directionalLight2.shadowCameraNear   = 0.1;
	directionalLight2.shadowCameraFar    = 5000;
	directionalLight2.shadowCameraLeft   = -5000;
	directionalLight2.shadowCameraRight  = 5000;
	directionalLight2.shadowCameraBottom = -5000;
	directionalLight2.shadowCameraTop    = 5000;
	directionalLight2.shadowCameraVisible= true;
	directionalLight2.shadowDarkness     = 0.1;
	directionalLight2.shadowMapWidth     = 2048;
	directionalLight2.shadowMapHeight    = 2048;
	directionalLight2.castShadow         = true;
	scene.add(directionalLight2);

	var ambientLight = new THREE.AmbientLight( 0x404040 );
	scene.add(ambientLight);
}

// Input

document.addEventListener('mousemove', function(event) {
	player.rotate(event.movementY, event.movementX, 0);
}, false);

document.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 38: // up
		case 87: // w
			player.moveDirection.FORWARD = true;
			break;
		case 17: // left
		case 65: // a
			player.moveDirection.LEFT = true;
			break;
		case 40: // down
		case 83: // s
			player.moveDirection.BACKWARD= true;
			break;
		case 39: // right
		case 68: // d
			player.moveDirection.RIGHT = true;
			break;
		case 32: // jump
			player.jump();
			break;
	}
}, false);

document.addEventListener('keyup', function(event) {
	switch (event.keyCode) {
		case 38: // up
		case 87: // w
			player.moveDirection.FORWARD = false;
			break;
		case 17: // left
		case 65: // a
			player.moveDirection.LEFT = false;
			break;
		case 40: // down
		case 83: // s
			player.moveDirection.BACKWARD= false;
			break;
		case 39: // right
		case 68: // d
			player.moveDirection.RIGHT = false;
			break;
	}
}, false);

// Update

function update(delta) {
	player.update(delta);
}

// Run
document.getElementById('start').addEventListener('click', function(){
	if (BigScreen.enabled) {
		var instructions = this;
		BigScreen.request(document.body, function() {
			PL.requestPointerLock(document.body, function() {
				instructions.className = 'hidden';
				startAnimating();
			}, function() {
				stopAnimating();
			}, function() {
				alert('Error: entering pointer lock failed');
			});
		}, function() {
			instructions.className = 'exited';
			stopAnimating();
		}, function() {
			instructions.className = 'exited';
			stopAnimating();
		}, function() {
			alert('Error: full screen not supported');
		});
	}
});

setup();
