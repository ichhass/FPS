function Player() {
	THREE.Mesh.apply(this, arguments);
	this.rotation.order = 'YXZ';
	this._aggregateRotation = new THREE.Vector3;
	this.cameraHeight = 40;
	this.velocity = new THREE.Vector3;
	this.acceleration = new THREE.Vector3(0, -150, 0);
	this.ambientFriction = new THREE.Vector3(-10, 0, -10);
	this.moveDirection = {
		FORWARD: false,
		BACKWARD: false,
		LEFT: false,
		RIGHT: false
	};

	this.mouseSensitivity = new THREE.Vector3(0.25, 0.25, 0.25);
	this.inverseLook = new THREE.Vector3(-1, -1, -1);
}

Player.prototype = Object.create(THREE.Mesh.prototype);
Player.prototype.constructor = Player;

Player.prototype.rotate = function(x,y,z) {
	this._aggregateRotation.x += x;
	this._aggregateRotation.y += y;
	this._aggregateRotation.z += z;
};

Player.prototype.update = (function() {
	return function(delta) {
		// Look vector
		var r = this._aggregateRotation
			.multiply(this.mouseSensitivity)
			.multiply(this.inverseLook)
			.multiplyScalar(delta)
			.add(this.rotation);

		this.rotation.set(r.x, r.y, r.z);
		this._aggregateRotation.set(0,0,0);
	}
})();