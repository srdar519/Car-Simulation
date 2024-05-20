import Vector3 from "./Library";

class Direction {
  constructor(
    RollRotationAngle,
    YawRotationAngle,
    PitchRotationAngle,
    Centercoordinates
  ) {
    this.RollRotationAngle = RollRotationAngle;
    this.YawRotationAngle = YawRotationAngle;
    this.PitchRotationAngle = PitchRotationAngle;
    this.Centercoordinates = Centercoordinates;
  }

  front() {
    const front = new Vector3(
      Math.cos(this.PitchRotationAngle) * Math.cos(this.YawRotationAngle),
      Math.sin(this.PitchRotationAngle),
      -Math.cos(this.PitchRotationAngle) * Math.sin(this.YawRotationAngle)
    );

    return front;
  }

  right() {
    const right = new Vector3(
      Math.sin(this.YawRotationAngle),
      0,
      Math.cos(this.YawRotationAngle)
    );

    return right;
  }

  up() {
    const up = this.right().cross(this.front());
    return up.normalize();
  }

  getPointInFrontDirection(distance) {
    const frontVector = this.front().multiplyScalar(distance);
    return frontVector.addVector(this.Centercoordinates);
  }

  getPointInRightDirection(distance) {
    const rightVector = this.right().multiplyScalar(distance);
    return rightVector.addVector(this.Centercoordinates);
  }

  getPointInUpDirection(distance) {
    const upVector = this.up().multiplyScalar(distance);
    return upVector.addVector(this.Centercoordinates);
  }
}

export default Direction;