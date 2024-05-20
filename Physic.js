import "./style.css";
import * as dat from "dat.gui";
import Vector3 from "./Library";
import Diriction from "./Directions";
import GMath from "./GMath";
class Car {
  constructor() {
    this.position = new Vector3(); // metres in world coords
    this.velocity = new Vector3(); // m/s in world coords
    this.velocity_c = new Vector3(); // m/s in local car coords (x is forward y is sideways)
    this.accel = new Vector3(); // acceleration in world coords
    this.accel_c = new Vector3(); // accleration in local car coords
    this.yawRate = new Vector3(); // angular velocity in radians
    this.heading = new Vector3(); // theta
    this.angularAccel = new Vector3();
    this.steer = 0.0; // amount of steering input (-1.0..1.0)  زاوية الدركسون
    this.steerAngle = 0.0; // actual front wheel steer angle (-maxSteer..maxSteer) زاوية الدواليب
    this.inertia = 0.0; // will be = mass
    this.angularTorque = 0.0;
    this.mass = 1200.0; // kg
    this.inertiaScale = 1.0; // Multiply by mass for inertia
    this.halfWidth = 0.8; // Centre to side of chassis (metres)
    this.cgToFront = 2.0; // Centre of gravity to front of chassis (metres)
    this.cgToRear = 2.0; // Centre of gravity to rear of chassis
    this.cgToFrontAxle = 2; // Centre gravity to front axle
    this.cgToRearAxle = 2.3; // Centre gravity to rear axle
    this.cgHeight = 0.55; // Centre gravity height
    this.wheelRadius = 0.3; // Includes tire (also represents height of axle)
    this.wheelWidth = 0.2; // Used for render only
    this.tireGrip = 2.0; // How much grip tires have
    this.lockGrip = 0.7; // % of grip available when wheel is locked
    this.engineForce = 8000.0;
    this.brakeForce = 12000.0;
    this.eBrakeForce = this.brakeForce / 2.5;
    this.weightTransfer = 0.2; // How much weight is transferred during acceleration/braking
    this.maxSteer = 0.6; // Maximum steering angle in radians
    this.cornerStiffnessFront = 5.0; // كلما قلت القيمة رح تنزلق دواليي السيارة الامامية اكتر
    this.cornerStiffnessRear = 5.2;
    this.airResist = 2.5; // air resistance (* vel) مقاومة الهواء
    this.rollResist = 8.0; // rolling resistance force (* vel)
    this.wheelBase = this.cgToFrontAxle + this.cgToRearAxle;
    this.axleWeightRatioFront = this.cgToRearAxle / this.wheelBase; // % car weight on the front axle
    this.axleWeightRatioRear = this.cgToFrontAxle / this.wheelBase; // % car weight on the rear axle
    this.gravity = 9.81; // m/s^2
    this.vLength = 0.0;
    this.gui = new dat.GUI();
    this.throttle = 0;
    this.InputBrake = 0;
    this.InputeBrake = 0;
    this.InputThrottle = 0;
    //control

    this.yawSpeedFront = 0;
    this.yawSpeedRear = 0;

    this.leftSteer = 0;
    this.rightSteer = 0;
    this.smoothSteer = true;
    this.safeSteer = true;

    this.PitchRotationAngle = 0;
    this.YawRotationAngle = 0;
    this.RollRotationAngle = 0;

    const Center = new Vector3(
      this.position.x,
      this.position.y,
      this.position.z
    );



    this.carDirction = new Diriction(
      this.RollRotationAngle,
      this.YawRotationAngle,
      this.PitchRotationAngle,
      Center
    );
    
    const frontAxleOrigin = this.carDirction.getPointInFrontDirection(
      this.cgToFrontAxle
    );
    const rearAxleOrigin = this.carDirction.getPointInFrontDirection(
      -this.cgToRearAxle
    );

    this.wheelDirctionFront = new Diriction(
      this.RollRotationAngle,
      this.YawRotationAngle,
      this.PitchRotationAngle,
      frontAxleOrigin
    );

    this.wheelDirctionRear = new Diriction(
      this.RollRotationAngle,
      this.YawRotationAngle,
      this.PitchRotationAngle,
      rearAxleOrigin
    );

    document.addEventListener("keydown", (event) => {
      // إذا ضغط المستخدم على W
      if (event.key === "w") {
        if (this.InputThrottle <= 1) {
          this.InputThrottle += 0.1;
        }
      }

      if (event.key === "s") {
        if (this.InputBrake <= 0.4) {
          this.InputBrake += 0.01;
        }
      }

      if (event.key === "d") {
        if (this.rightSteer > -0.6) this.steer -= 0.07;
      }

      if (event.key === "a") {
        if (this.leftSteer < 0.6) this.steer += 0.07;
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "w") {
        this.InputThrottle = 0;
      }
      if (event.key === "s") {
        this.InputBrake = 0;
      }
      if (event.key === "a") {
        this.rightSteer = 0;
      }
      if (event.key === "d") {
        this.leftSteer = 0;
      }
    });
  }

  ///////////////////////////// UPDATE ///////////////////////////////////////
  update(deltatime) {
    this.steerAngle = this.steer;
    console.log("steerAngle", this.steerAngle);

    // Rotation Car
    this.wheelDirctionFront.YawRotationAngle =
      this.carDirction.YawRotationAngle =
      this.wheelDirctionRear.YawRotationAngle =
        this.steerAngle;

    // ToTALE FOECE //
    var totalF = this.totalForce();

    // lINER ACCELERATION //
    this.acceleration = totalF.divide(this.mass);

    // lINER VELOCITY //
    this.velocity = this.velocity.addVector(
      this.acceleration.clone().multiply(deltatime)
    );

    this.vLength = this.velocity.length();

    // POSITION //
    this.position = this.position.addVector(
      this.velocity.clone().multiply(deltatime)
    );

    // BREAK //
    if (Math.abs(this.vLength) < 0.1 && this.throttle == 0) {
      this.velocity.x = this.velocity.y = this.velocity.z = this.vLength = 0;
      this.acceleration.x = this.acceleration.y = this.acceleration.z = 0;
    }
  }

  //////////////////////////////////// TOTAL FORCE //////////////////////////////////////////

  totalForce() {
    var tf = new Vector3(0, 0, 0);

    tf = tf.addVector(this.dragForce());
    tf = tf.addVector(this.tractionForce());

    return tf;
  }

  //////////////////////////////////////////////////////////////////////////////////////

  tractionForce() {
    var brake = Math.min(
      this.InputBrake * this.brakeForce + this.InputeBrake * this.eBrakeForce,
      this.brakeForce
    );
    this.throttle = this.InputThrottle * this.engineForce;
    var tractionForce = this.throttle - brake * GMath.sign(this.vLength);
    var tractionVector = this.wheelDirctionFront
      .front()
      .multiply(tractionForce);

    return tractionVector;
  }

  dragForce() {
    var dragForce =
      -this.rollResist * this.vLength -
      this.airResist * this.vLength * Math.abs(this.vLength);
    var dragVector = this.wheelDirctionFront.front().multiplyScalar(dragForce);
    return dragVector;
  }
}
export default Car;
