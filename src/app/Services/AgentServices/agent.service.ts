import { Setpoint } from './../../classes/set_point.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from '../../classes/state.model';
import { Sim_params } from '../../classes/sim_params.model';
import { Geo_params } from '../../classes/geo_params.model';
import { Behavior } from '../../classes/behavior.model';

@Injectable({
  providedIn: 'root'
})

export class AgentService {
  last_inclination = 0.0;
  sum_error_inclination = 0.0;

  last_vel = 0.0;
  sum_error_vel = 0.0;

  last_position = 0.0;
  sum_error_position = 0.0;

  ////inclination///
  Kc_i = 1.0;
  Ki_i = 1.0;
  Kd_i = 0.1;
  ////Velocity///
  Kc_v = 4.5;
  Ki_v = 0.75;
  Kd_v = 0.05;

  //////Position////
  Kc_p = 2.0;
  Ki_p = 0.75;
  Kd_p = 1.0;
  //////////////////////////////


  constructor() { }

  inclinationPID(setpoint: number, inclination: number, max_output: number, dt: number): number {
    let error = setpoint - inclination;
    // console.log('entrada', setpoint, inclination, max_output, dt);
    if (Math.abs(error) >= 60) {
      this.sum_error_inclination = 0.0;
      this.last_inclination = 0.0;
      return 0.0;
    }

    this.sum_error_inclination += (this.Ki_i * error) * dt;
    this.sum_error_inclination = this.constrain(-1.0 * max_output, max_output, this.sum_error_inclination);
    let P = this.Kc_i * error;
    let I = this.sum_error_inclination;
    let D = -1.0 * (this.Kd_i * ((inclination - this.last_inclination) / dt));
    let output = P + I + D;
    output = this.constrain(-1.0 * max_output, max_output, output);
    this.last_inclination = JSON.parse(JSON.stringify(inclination));
    return output;
  }

  velocityPID(setpoint: number, vel: number, max_output: number, dt: number): number {
    let error = setpoint - vel;
    this.sum_error_vel += (this.Ki_v * error) * dt;
    this.sum_error_vel = this.constrain(-1.0 * max_output, max_output, this.sum_error_vel);
    let P = this.Kc_v * error;
    let I = this.sum_error_vel;
    let D = -1.0 * (this.Kd_v * ((vel - this.last_vel) / dt));
    let output = P + I + D;
    output = this.constrain(-1.0 * max_output, max_output, output);
    this.last_vel = vel;
    return output;
  }

  positionPID(setpoint: number, position: number, max_output: number, dt: number): number {
    let error = setpoint - position;
    this.sum_error_position += (this.Ki_p * error) * dt;
    this.sum_error_position = this.constrain(-1.0 * max_output, max_output, this.sum_error_position);
    let P = this.Kc_p * error;
    let I = this.sum_error_position;
    let D = -1.0 * (this.Kd_p * ((position - this.last_position) / dt));
    let output = P + I + D;
    output = this.constrain(-1.0 * max_output, max_output, output);
    this.last_position = position;
    return output;
  }


  constrain(a: number, b: number, x: number): number {
    if (x <= a) {
      return a;
    }
    if (x >= b) {
      return b;
    }
    return x;
  }

  PIDCompute(id: number, setpoint: Setpoint, state: State, max_output: number, dt: number): number {
    if (id === 0) {
      return 0.0;
    }
    if (id === 1) {
      return this.inclinationPID(setpoint.theta, (-1.0 * state.theta * (180.0 / 3.14159)), max_output, dt);
    }
    if (id === 2) {
      let set_point_theta = this.velocityPID(setpoint.x_dot, state.x_dot, 10.0, dt);

      return this.inclinationPID(-1.0 * set_point_theta, (-1.0 * state.theta * (180.0 / 3.14159)), max_output, dt);
    }
    if (id === 3) {
      const set_point_vel = this.positionPID(setpoint.x, state.x, 1.5, dt);
      const set_point_theta = this.velocityPID(set_point_vel, state.x_dot, 10.0, dt);
      return this.inclinationPID(-1.0 * set_point_theta, (-1.0 * state.theta * (180.0 / 3.14159)), max_output, dt);
    }
    return 0;

  }

  getControllerParams(id: any): number[] {
    // console.log(id);
    if (id === 0) {
      return [0, 0, 0];
    }
    if (id === 1) {
      return [this.Kc_i, this.Ki_i, this.Kd_i];
    }
    if (id === 2) {
      return [this.Kc_v, this.Ki_v, this.Kd_v];
    }
    if (id === 3) {
      return [this.Kc_p, this.Ki_p, this.Kd_p];
    }
    return [0, 0, 0];
  }

  resetValues(id?: any) {
    if (id) {
      if (id === 0) {
      }
      if (id === 1) {
        this.last_inclination = 0.0;
        this.sum_error_inclination = 0.0;
      }
      if (id === 2) {
        this.last_vel = 0.0;
        this.sum_error_vel = 0.0;
      }
      if (id === 3) {
        this.last_position = 0.0;
        this.sum_error_position = 0.0;
      }
    }
    else {
      this.last_inclination = 0.0;
      this.sum_error_inclination = 0.0;
      this.last_vel = 0.0;
      this.sum_error_vel = 0.0;
      this.last_position = 0.0;
      this.sum_error_position = 0.0;
    }



  }

  changePIDConstants(data: number[], id: number): void {
    if (id === 0) {
    }
    if (id === 1) {
      this.Kc_i = data[0];
      this.Ki_i = data[1];
      this.Kd_i = data[2];
    }
    if (id === 2) {
      this.Kc_v = data[0];
      this.Ki_v = data[1];
      this.Kd_v = data[2];
    }
    if (id === 3) {
      this.Kc_p = data[0];
      this.Ki_p = data[1];
      this.Kd_p = data[2];
    }

  }




}
