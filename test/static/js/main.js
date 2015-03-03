var scene, camera, renderer;
var controls;
var axes;

var clock = new THREE.Clock();

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 2500);
	camera.position.x = 0;
	camera.position.y = 400;
	camera.position.z = 400;
	camera.lookAt(new THREE.Vector3(0,0,0));
/*
	trackballControls = new THREE.TrackballControls(camera);
	trackballControls.rotateSpeed = 1.0;
	trackballControls.zoomSpeed = 1.0;
	trackballControls.panSpeed = 1.0;
	trackballControls.staticMoving = true;
*/
	//x = red, y = green, z=blue

	controls = new THREE.FirstPersonControls(camera);
	controls.movementSpeed = 100;
	controls.lookSpeed = 0.1;

	axes = new THREE.AxisHelper(20);
	scene.add(axes);

	var directionalLight = new THREE.DirectionalLight (0xf6e86d, 1);
	directionalLight.position.set(500,1500,1000);
	directionalLight.castShadow = true;
	directionalLight.shadowDarkness = 0.5;
	directionalLight.shadowMapWidth = 2048;
	directionalLight.shadowMapHeight = 2048;
	directionalLight.shadowCameraFar = 2500;
	directionalLight.shadowCameraLeft = -1000;
	directionalLight.shadowCameraRight = 1000;
	directionalLight.shadowCameraTop = 1000;
	directionalLight.shadowCameraBottom = -1000;
	directionalLight.shadowCameraVisible = true;
	scene.add(directionalLight);

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor("#d7f0f7");
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;

	document.body.appendChild(renderer.domElement);

	createCity();

	animate();
}

function animate() {
	var delta = clock.getDelta();
	//trackballControls.update(delta);
	controls.update(delta);
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
}

function createCity() {
	var floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 20, 20);
	var floorMaterial = new THREE.MeshBasicMaterial({color: 0x9db3b5});
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -90 * Math.PI / 180;
	floor.receiveShadow = true;
	scene.add(floor);

	var buildingGeometry = new THREE.BoxGeometry(1,1,1);
	var buildingMaterial = new THREE.MeshDepthMaterial();

	for (var i=-800; i<800; i+=100) {
		for (var j = -800; j < 800; j += 100) {
			var building = new THREE.Mesh(buildingGeometry.clone(), buildingMaterial.clone());
			building.scale.x = Math.random() * 70 + 20;
			building.scale.y = Math.random() * building.scale.x * 3;
			building.scale.z = building.scale.x;
			building.position.x = i;
			building.position.z = j;
			building.position.y = building.scale.y / 2;
			building.castShadow = true;
			building.receiveShadow = true;

			scene.add(building);
		}
	}


}

function KeyboardControls(object, options) {
	this.object = object;
	options = options || {};
	this.domElement = options.domElement || document;
	this.moveSpeed = options.moveSpeed || 1;

	this.domElement.addEventListener('keydown', this.onKeyDown.bind(this), false);
	this.domElement.addEventListener('keyup', this.onKeyUp.bind(this), false);
}

KeyboardControls.prototype = {
	update: function() {
		if (this.moveForward) this.object.translateZ(-this.moveSpeed);
		if (this.moveBackward) this.object.translateZ(this.moveSpeed);
		if (this.moveLeft) this.object.translateX(-this.moveSpeed);
		if (this.moveRight) this. object.translateX(this.moveSpeed);
	},
	onKeyDown: function (event) {
		switch (event.keyCode) {
			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;
			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;
			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;
			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;
		}
	},
	onKeyUp: function (event) {
		switch (event.keyCode) {
			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;
			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;
			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;
			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;
		}
	}
}

