import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Setpoint } from "../classes/set_point.model";
@Component({
  selector: "app-setpoint",
  templateUrl: "./setpoint.component.html",
  styleUrls: ["./setpoint.component.css"]
})
export class SetpointComponent implements OnInit {
  set_point: Setpoint;
  @Output()
  changeSetpoint: EventEmitter<Setpoint>;
  constructor() {
    this.set_point = new Setpoint();
    this.changeSetpoint = new EventEmitter();
  }
  sendSetpoint(
    set_angle: HTMLInputElement,
    set_x: HTMLInputElement,
    set_x_dot: HTMLInputElement
  ): boolean {
    if (!isNaN(set_angle.valueAsNumber)) {
      this.set_point.theta = -1.0 * set_angle.valueAsNumber;
    }
    if (!isNaN(set_x.valueAsNumber)) {
      this.set_point.x = set_x.valueAsNumber;
    }
    if (!isNaN(set_x_dot.valueAsNumber)) {
      this.set_point.x_dot = set_x_dot.valueAsNumber;
    }
    this.changeSetpoint.emit(this.set_point);

    return false;
  }

  ngOnInit() { }
}
