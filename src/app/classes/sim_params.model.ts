export class Sim_params {
  L: number;
  wheel_rad: number;
  m_car: number;
  m_pend: number;
  dt: number;
  friction: number;
  ground_friction: number;
  time_up: number;
  best_score: number;
  wind_friction: number;
  max_force: number;
  init_theta: number;

  constructor(
    L: number = 0.3,
    m_car: number = 1.4,
    m_pend: number = 0.2,
    dt: number = 20,
    friction: number = 0.9,
    ground_friction: number = 3.5,
    time_up: number = 0.0,
    best_score: number = 0.0,
    wind_friction: number = 5.5,
    max_force: number = 20.0,
    init_theta: number = 0.0,
    wheel_rad: number = 0.055
  ) {
    this.L = L;
    this.m_car = m_car;
    this.m_pend = m_pend;
    this.dt = dt;
    this.friction = friction;
    this.ground_friction = ground_friction;
    this.time_up = time_up;
    this.wind_friction = wind_friction;
    this.max_force = max_force;
    this.best_score = best_score;
    this.init_theta = init_theta;
    this.wheel_rad = wheel_rad;
  }
}
