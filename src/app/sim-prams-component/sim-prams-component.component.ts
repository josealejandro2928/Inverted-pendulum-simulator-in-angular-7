import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Sim_params } from '../classes/sim_params.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: "app-sim-prams-component",
  templateUrl: "./sim-prams-component.component.html",
  styleUrls: ["./sim-prams-component.component.css"]
})
export class SimPramsComponentComponent implements OnInit {
  sim_params: Sim_params;
  default: boolean;
  @Output()
  changeparams: EventEmitter<Sim_params>;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.sim_params = new Sim_params();
    this.default = true;
    this.changeparams = new EventEmitter();
  }

  sendParameters(): void {
    this.changeparams.emit(this.form.value);
  }

  sendDefault(): void {
    this.buildForm();
    this.changeparams.emit(this.form.value);

  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      init_theta: [this.sim_params.init_theta, [Validators.required, Validators.min(-360), Validators.max(360)]],
      m_car: [this.sim_params.m_car, [Validators.required, Validators.min(0.5), Validators.max(20)]],
      m_pend: [this.sim_params.m_pend, [Validators.required, Validators.min(0.05), Validators.max(1.0)]],
      L: [this.sim_params.L, [Validators.required, Validators.min(0), Validators.max(1)]],
      friction: [this.sim_params.friction, [Validators.required, Validators.min(0), Validators.max(5.0)]],
      ground_friction: [this.sim_params.ground_friction, [Validators.required, Validators.min(0.0), Validators.max(5.0)]]
    });
  }


}
