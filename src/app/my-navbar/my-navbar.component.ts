import { CanvasSizeService } from './../Services/canvas-size.service';
import {
  Component,
  OnInit,
  HostListener,
} from '@angular/core';
import { AgentService } from '../Services/AgentServices/agent.service';
import { SimulationService } from '../Services/SimulationServices/simulation.service';

import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { State } from '../classes/state.model';
import { Sim_params } from '../classes/sim_params.model';
import { Geo_params } from '../classes/geo_params.model';
import { Setpoint } from '../classes/set_point.model';
import { Behavior } from '../classes/behavior.model';


@Component({
  selector: 'app-my-navbar',
  templateUrl: './my-navbar.component.html',
  styleUrls: ['./my-navbar.component.css']
})
export class MyNavbarComponent implements OnInit {
  public state: State;
  public sim_params: Sim_params;
  public geo_params: Geo_params;
  public set_point: Setpoint;
  public behavior: Behavior;
  public show_state: State;
  public agentParameters: number[] = [];
  public data: Object;
  hideAgentbar = false;
  displayedStateColumns = ['name', 'value'];

  constructor(
    private agent_services: AgentService,
    private simulation: SimulationService,
    public canvasSizeService: CanvasSizeService
  ) {
    this.sim_params = new Sim_params();
    this.geo_params = new Geo_params();
    this.state = new State(0.0, 0.0, 0.0, 0.0);
    this.behavior = new Behavior();
    this.set_point = new Setpoint();
    this.show_state = new State();
  }

  getSimp_params(sim_o: Sim_params): void {
    this.sim_params.L = sim_o.L;
    this.sim_params.friction = sim_o.friction;
    this.sim_params.ground_friction = sim_o.ground_friction;
    this.sim_params.init_theta = sim_o.init_theta;
    this.sim_params.m_car = sim_o.m_car;
    this.sim_params.m_pend = sim_o.m_pend;
    this.state.theta = (sim_o.init_theta * 3.141592) / 180.0;
  }


  getSet_point(set_o: Setpoint): void {
    this.set_point = set_o;
  }



  onstartBtn(): void {
    if (!this.behavior.running) {
      this.behavior.reset();
      this.sim_params.time_up = 0.0;
      this.behavior.running = true;
    } else {
      this.behavior.reset();
      this.agent_services.resetValues();
      this.sim_params.time_up = 0.0;
      this.behavior.running = false;
      this.state = new State();
    }

  }

  onAgentChange(talla: any): void {
    const id = this.behavior.id_modes;
    this.agent_services.resetValues();
    this.agentParameters = this.agent_services.getControllerParams(id);
  }

  onChangeConstants() {
    this.agent_services.changePIDConstants(this.agentParameters, this.behavior.id_modes)
  }

  @HostListener('document:keydown.ArrowRight', ['$event'])
  public handleKeyRigthdown(event: KeyboardEvent): void {
    if (this.behavior.keysense === 0 || this.behavior.keysense === 1) {
      this.behavior.keysense = 1.0;
    }
    event.stopPropagation();
  }

  @HostListener('document:keyup.ArrowRight', ['$event'])
  public handleKeyRigthup(event: KeyboardEvent): void {
    if (this.behavior.keysense === 1.0) {
      this.behavior.keysense = 0.0;
    }
    event.stopPropagation();
  }

  @HostListener('document:keydown.ArrowLeft', ['$event'])
  public handleKeyLeftdown(event: KeyboardEvent): void {
    if (this.behavior.keysense === 0 || this.behavior.keysense === -1.0) {
      this.behavior.keysense = -1.0;
    }
    event.stopPropagation();
  }

  @HostListener('document:keyup.ArrowLeft', ['$event'])
  public handleKeyLeftup(event: KeyboardEvent): void {
    if (this.behavior.keysense === -1) {
      this.behavior.keysense = 0.0;
    }
    event.stopPropagation();
  }

  showState(): void {
    const temp1 = this.state.x;
    const temp2 = this.state.x_dot;
    const temp3 = this.state.theta;
    const temp4 = this.state.theta_dot;
    this.show_state.x = temp1;
    this.show_state.x_dot = temp2;
    this.show_state.theta = (temp3 * (180.0 / 3.14159));
    this.show_state.theta_dot = temp4 * (180.0 / 3.14159);
  }

  getkeyForce(): void {
    const speed = 10.0;
    if (this.behavior.keysense !== 0) {
      const temp = this.behavior.key_force + this.behavior.keysense * 0.5;
      this.behavior.key_force =
        Math.min(Math.abs(temp), this.sim_params.max_force) * Math.sign(temp);
    } else {
      if (Math.abs(this.behavior.key_force) <= 0.0000001) {
        this.behavior.key_force = 0.0;
      } else {
        let temp = 0.0;
        if (this.behavior.key_force < 0.0) {
          temp = this.behavior.key_force + 0.5;
        } else {
          temp = this.behavior.key_force - 0.5;
        }
        this.behavior.key_force = temp;
      }
    }
  }

  //////////////////////////////////////////////
  dynamical_loop(): void {
    setTimeout(() => this.dynamical_loop(), this.sim_params.dt);
    this.showState();
    this.getkeyForce();
    if (this.behavior.running) {
      if (this.behavior.modes[this.behavior.id_modes] === 'manual') {
        this.behavior.input_force = 0.0;
        this.agent_services.resetValues();
      } else {
        this.behavior.input_force = this.agent_services.PIDCompute(this.behavior.id_modes, this.set_point, this.state,
          this.sim_params.max_force, (this.sim_params.dt) / 1000.0);
        if (Math.abs(this.show_state.theta) >= 70) {
          this.behavior.input_force = 0.0;
          this.behavior.key_force = 0.0;
          this.agent_services.resetValues();
          this.state = new State();
          let s_p = new Sim_params();
          s_p.init_theta = 0.0;
          this.getSimp_params(s_p);
        }
      }
      this.state = this.simulation.simulate(
        this.state,
        this.sim_params,
        this.behavior
      );
    }
  }

  ngOnInit() {

    this.behavior.connected = true;
    for (let i = 0; i < this.behavior.modes.length; i++) {
      this.behavior.id_modes = i;
      this.onAgentChange(i);
    }
    this.behavior.id_modes = 0;
    this.onAgentChange(0);
    this.dynamical_loop();
  }

  onHideAgentBar(): void {
    this.hideAgentbar = (this.hideAgentbar) ? false : true;
    this.canvasSizeService.hideAgentbar = this.hideAgentbar;
    this.canvasSizeService.transformCanvasSize();
  }


}
