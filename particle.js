class Particle {
    constructor(x, y) {
      this.position = createVector(x, y);
      this.acceleration = createVector(0, 0);
      this.velocity = p5.Vector.random2D();
      this.lifespan = 255.0;
      this.icon = '💖';
    }
    run() {
      this.update();
      this.show();
    }
    applyForce(force) {
      this.acceleration.add(force);
    }
    update() {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.lifespan -= 8; // Gradual fade of the emoji
      this.acceleration.mult(0);
    }
    show() {
      textSize(8); // Increase the emoji size for better visibility
      textAlign(CENTER);
      noStroke();
      fill(255, this.lifespan);
      text(this.icon, this.position.x, this.position.y);
    }
    isDead() {
      return this.lifespan < 0.0;
    }
}
