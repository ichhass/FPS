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

Player.SPEED = 200;

Player.prototype.update = (function() {
	var halfAccel = new THREE.Vector3();
	var scaledVelocity = new THREE.Vector3();
	return function(delta) {
		// Look vector
		var r = this._aggregateRotation
			.multiply(this.mouseSensitivity)
			.multiply(this.inverseLook)
			.multiplyScalar(delta)
			.add(this.rotation);

		r.x = Math.max(Math.PI * -0.5, Math.min(Math.PI * 0.5, r.x));

		this.rotation.set(r.x, r.y, r.z);
		this._aggregateRotation.set(0,0,0);

		// Move
		if (this.moveDirection.FORWARD) this.velocity.z -= Player.SPEED;
		if (this.moveDirection.LEFT) this.velocity.x -= Player.SPEED;
		if (this.moveDirection.BACKWARD) this.velocity.z += Player.SPEED;
		if (this.moveDirection.RIGHT) this.velocity.x += Player.SPEED;

		halfAccel.copy(this.acceleration).multiplyScalar(delta * 0.5);
		this.velocity.add(halfAccel);
		var squaredVelocity = this.velocity.x*this.velocity.x + this.velocity.z*this.velocity.z;
		if (squaredVelocity > Player.SPEED*Player.SPEED) {
			var scalar = Player.SPEED / Math.sqrt(squaredVelocity);
			this.velocity.x *= scalar;
			this.velocity.z *= scalar;
		}
		scaledVelocity.copy(this.velocity).multiplyScalar(delta);
		this.translateX(scaledVelocity.x);
		this.translateZ(scaledVelocity.z);
		//this.position.y += scaledVelocity.y;
		this.velocity.add(halfAccel);

		this.velocity.add(scaledVelocity.multiply(this.ambientFriction));
	}
})();

Player.prototype.jump = function () {
	console.log('jumping');
};