export class Setpoint {
  theta: number;
  theta_dot: number;
  x: number;
  x_dot: number;

  constructor(theta: number = 0.0, theta_dot: number = 0.0, x: number = 0.0, x_dot: number = 0.0) {
    this.theta = theta;
    this.theta_dot = theta_dot;
    this.x = x;
    this.x_dot = x_dot;
  }

  update(s: Setpoint): void {
    this.theta = s.theta;
    this.theta_dot = s.theta_dot;
    this.x = s.x;
    this.x_dot = s.x_dot;
  }

}


