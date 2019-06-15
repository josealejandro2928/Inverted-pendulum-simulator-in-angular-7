import { Injectable } from "@angular/core";
import { State } from "../../classes/state.model";
import { Sim_params } from "../../classes/sim_params.model";
import { SafeMethodCall, templateJitUrl } from "@angular/compiler";
import { Geo_params } from "../../classes/geo_params.model";
import { Behavior } from "../../classes/behavior.model";
import { Setpoint } from "../../classes/set_point.model";

@Injectable({
  providedIn: "root"
})
export class SimulationService {
  counterNoiseTheta = 0;
  counterNoiseWindFriction = 0;
  constructor() { }

  simulate(state: State, sim_params: Sim_params, behavior: Behavior): State {
    const l_theta = state.theta;
    const l_theta_d = state.theta_dot;
    const l_x = state.x;
    const l_x_d = state.x_dot;
    const last_beta_wheel = state.beta_wheel;
    ///////////getting simul_params/////////////
    const m = sim_params.m_pend;
    const M = sim_params.m_car;
    const l = sim_params.L;
    const dt = sim_params.dt;
    const g = 9.8; // gravity forces in m/s^2
    let F = behavior.getForce();
    const k = sim_params.ground_friction;
    const ft = sim_params.friction;
    const u = sim_params.wind_friction;
    if (this.counterNoiseWindFriction === 20) {
      F = F + -1.0 * (k * l_x_d) + this.addNoise(sim_params.wind_friction, true, 0.95);
      this.counterNoiseWindFriction = 0;
    }
    else {
      this.counterNoiseWindFriction++;
      F = F + -1.0 * (k * l_x_d);
    }


    const numA1 = -1.0 * m * g * Math.sin(l_theta) * Math.cos(l_theta);
    const numA2 = m * l * Math.pow(l_theta_d, 2) * Math.sin(l_theta);
    const numA3 = ft * m * l_theta_d * Math.cos(l_theta) + F;
    const denA = M + m * (1 - Math.pow(Math.cos(l_theta), 2));
    const A = (numA1 + numA2 + numA3) / denA;

    const numB1 = (M + m) * (g * Math.sin(l_theta) - ft * l_theta_d);
    const numB2 =
      -1.0 *
      (Math.cos(l_theta) *
        (l * m * l_theta_d * l_theta_d * Math.sin(l_theta) + F));
    const denB = l * (M + m * (1 - Math.pow(Math.cos(l_theta), 2)));
    const B = (numB1 + numB2) / denB;
    ////// Solving the discrete differential equations Euler method/////////////
    const new_x = l_x + (l_x_d * dt) / 1000.0;
    const new_x_d = l_x_d + (A * dt) / 1000.0;
    const new_theta = l_theta + (l_theta_d * dt) / 1000.0;
    const new_theta_d = l_theta_d + (B * dt) / 1000.0;
    const new_beta_wheel =
      last_beta_wheel + ((l_x_d / sim_params.wheel_rad) * dt) / 1000;
    /////////////////////////////////////////////////////////
    if (Math.abs(new_theta) <= Math.PI / 2.0) {
      sim_params.time_up += dt / 1000;
    } else {
      sim_params.best_score = Math.max(
        sim_params.time_up,
        sim_params.best_score
      );
    }
    state.x = new_x;
    state.x_dot = new_x_d;
    state.theta = new_theta;
    state.theta_dot = new_theta_d;
    state.beta_wheel = new_beta_wheel;

    return state;
  }

  addNoise(k, sig = true, value): any {
    let sentido = 1.0;
    if (sig) {
      let c = Math.random();
      if (c >= 0.5) {
        sentido = 1.0
      }
      else {
        sentido = -1.0
      }
    }
    return k * sentido * value * Math.random();
  }

}
