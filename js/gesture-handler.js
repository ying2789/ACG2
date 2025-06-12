AFRAME.registerComponent("gesture-handler", {
  schema: {
    enabled: {default: true}
  },
  init: function () {
    this.initialScale = this.el.object3D.scale.clone();
    this.scaleFactor = 1;
    this.handlePinch = this.handlePinch.bind(this);
    this.el.sceneEl.addEventListener("onefingermove", this.handleRotate.bind(this));
    this.el.sceneEl.addEventListener("twofingermove", this.handlePinch);
  },
  handlePinch: function (event) {
    this.scaleFactor *= event.detail.spreadChange / 200 + 1;
    this.el.object3D.scale.set(
      this.initialScale.x * this.scaleFactor,
      this.initialScale.y * this.scaleFactor,
      this.initialScale.z * this.scaleFactor
    );
  },
  handleRotate: function (event) {
    const dX = event.detail.positionChange.x;
    this.el.object3D.rotation.y += dX * 0.01;
  }
});
