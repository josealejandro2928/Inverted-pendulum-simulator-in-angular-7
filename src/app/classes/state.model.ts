export class State {
  x: number;
  x_dot: number;
  theta: number;
  theta_dot: number;
  beta_wheel: number

  constructor(
    x: number = 0.0,
    x_dot: number = 0.0,
    theta: number = 0.0,
    theta_dot: number = 0.0,
    beta_wheel: number = 0.0
  ) {
    this.x = x;
    this.x_dot = x_dot;
    this.theta = theta;
    this.theta_dot = theta_dot;
    this.beta_wheel = beta_wheel;
  }
}


