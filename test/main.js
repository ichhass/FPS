// Create a scene
var scene, camera, renderer;

alert('hi');

function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
	camera.position.set(800, 800, 800);
	camera.lookAt(new THREE.Vector3(0,0,0));

	var axes = new THREE.AxisHelper(20);
	scene.add(axes);

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor("#d7f0f7");
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;

	document.body.appendChild(renderer.domElement);

	player = new Player();
	player.add(camera);
	scene.add(player);

	document.addEventListener('mousemove', function(event) {
		//player.rotate(event.movementY, event.movementX, 0);
	}, false);

	createMap();
	addLight();
}

function startAnimating() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}


// Designing a map
function createMap() {
	var map =   "XXXXXXX  \n" +
				"X     X  \n" +
				"X  S  X  \n" +
				"X     X  \n" +
				"X   S XXX\n" +
				"XXX     X\n" +
				"  XX  S X\n" +
				"   X    X\n" +
				"   XXXXXX";
//X is a wall, S is a spawn-point
	map = map.split("\n");

	var HORIZONTAL_UNIT = 100,
		VERTICAL_UNIT   = 100,
		ZSIZE = map.length * HORIZONTAL_UNIT,
		XSIZE = map[0].length * HORIZONTAL_UNIT;
	var spawnPoints = [];

//let's generate a map
	for (var i = 0, rows = map.length; i < rows; i++) {
		for (var j = 0, cols = map[i].length; j < cols; j++) {
			addVoxel(map[i].charAt(j), i, j);
		}
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

	var floorGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 1, 1);
	var floorMaterial = new THREE.MeshBasicMaterial({color: 'grey'});
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -90 * Math.PI / 180;
	floor.receiveShadow = true;
	scene.add(floor);
}

// Add Some light
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

// Constructing a player
function Player() {
	THREE.Mesh.apply(this, arguments);
	this.rotation.order = 'YXZ';
	this._aggregateRotation = new THREE.Vector3();
	this.cameraHeight = 40;
	this.velocity = new THREE.Vector3();
	this.acceleration = new THREE.Vector3(0, -150, 0);
	this.ambientFriction = new THREE.Vector3(-10, 0, -10);
	this.moveDirection = {
		FORWARD: false,
		BACKWARD: false,
		LEFT: false,
		RIGHT: false,
	};
}
Player.prototype = Object.create(THREE.Mesh.prototype);
Player.prototype.constructor = Player;

// RUN
document.getElementById('start').addEventListener('click', function(){
	if (BigScreen.enabled) {
		var instructions = this;
		BigScreen.request(document.body, function() {
			PL.requestPointerLock(document.body, function() {
				instructions.className = 'hidden';
				startAnimating();
			}, function() {
				stopAnimating();
			});
		}, function() {
			instructions.className = 'exited';
			stopAnimating();
		});
	}
});