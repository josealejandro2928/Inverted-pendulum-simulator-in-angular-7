import { CanvasSizeService } from './../Services/canvas-size.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  NgZone, OnChanges, SimpleChanges
} from "@angular/core";
import { State } from "../classes/state.model";
import { Geo_params } from "../classes/geo_params.model";
import { Sim_params } from "../classes/sim_params.model";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.css"]
})

export class CanvasComponent implements OnInit, OnChanges {
  @Input()
  state: State;
  @Input()
  geo_params: Geo_params;
  @Input()
  sim_params: Sim_params;
  @ViewChild("myCanvas")
  canvasRef: ElementRef;
  ctx: CanvasRenderingContext2D;
  TimerRef: any;

  @Input()
  cv_width: number;

  @Input()
  cv_height: number;

  constructor(private ngZone: NgZone, public canvasSizeService: CanvasSizeService) {
    this.state = new State();
    this.geo_params = new Geo_params();
    this.sim_params = new Sim_params();
  }

  roundInt(n: number): number {
    return parseInt(n.toFixed(3), 10);
  }
  draw_background(): void {
    // Background color setting
    this.ctx.fillStyle = "#e0e0e0";
    this.ctx.fillRect(0, 0, this.cv_width, this.cv_height);
    // Deliner setting
    //this.ctx.strokeStyle = "#222222";
    //this.ctx.strokeRect(0, 0, this.cv_width, this.cv_height);
  }

  check_boundaries(): void {
    let x_pos =
      this.state.x * this.geo_params.pix_per_m +
      this.geo_params.offset_x * this.geo_params.pix_per_m;
    let dx: number = this.state.x_dot * (this.geo_params.dt_draw / 1000);
    if (x_pos > this.cv_width * 0.7) {
      this.geo_params.offset_x -= dx;
    } else if (x_pos < this.cv_width * 0.3) {
      this.geo_params.offset_x += dx;
    }
  }

  draw_marker(): void {
    // Marker point of coordinate frame origin
    this.ctx.fillStyle = "#aa99aa";
    let mkx = this.geo_params.offset_x * this.geo_params.pix_per_m;
    let mky =
      this.cv_height -
      0.5 * this.geo_params.floor_height * this.geo_params.pix_per_m;
    console.log(mky);
    let mkw = this.geo_params.floor_height * 0.1 * this.geo_params.pix_per_m;
    this.ctx.fillRect(mkx, mky, mkw, mkw * 4);
  }

  draw_markers(): void {
    let disp_nx = this.state.x - this.roundInt(this.state.x);
    let mky =
      this.cv_height -
      0.5 * this.geo_params.floor_height * this.geo_params.pix_per_m;
    let mkw = this.geo_params.floor_height * 0.02 * this.geo_params.pix_per_m;

    // Left direction markers
    let c_m = this.roundInt(this.state.x);
    let c_px = this.obtain_x_px() - disp_nx * this.geo_params.pix_per_m;
    // draw the numbers
    this.ctx.font = "15px serif";
    this.ctx.fillStyle = "#aa99aa";
    let t_n = c_m.toFixed(0);
    this.ctx.fillText(t_n, c_px, mky + 13 * mkw);
    while (c_px > 0) {
      if (c_m === 0) {
        this.ctx.fillStyle = "#aa2222";
      } else {
        this.ctx.fillStyle = "#aa99aa";
      }
      this.ctx.fillRect(c_px, mky, mkw, mkw * 4);
      c_px -= this.geo_params.pix_per_m;
      c_m -= 1;

      // draw the numbers
      this.ctx.font = "15px serif";
      this.ctx.fillStyle = "#aa99aa";
      let t_n = c_m.toFixed(0);
      this.ctx.fillText(t_n, c_px, mky + 13 * mkw);
    }

    // Right direction markers
    c_m = this.roundInt(this.state.x) + 1;
    disp_nx = c_m - this.state.x;

    c_px = this.obtain_x_px() + disp_nx * this.geo_params.pix_per_m;
    while (c_px < this.cv_width) {
      if (c_m === 0) {
        this.ctx.fillStyle = "#aa2222";
      } else {
        this.ctx.fillStyle = "#aa99aa";
      }
      this.ctx.fillRect(c_px, mky, mkw, mkw * 4);

      // draw the numbers
      this.ctx.font = "15px serif";
      this.ctx.fillStyle = "#aa99aa";
      let t_n = c_m.toFixed(0);
      this.ctx.fillText(t_n, c_px, mky + 13 * mkw);
      c_px += this.geo_params.pix_per_m;
      c_m += 1;
    }
  }
  draw_floor(): void {
    this.ctx.save();
    this.ctx.fillStyle = "#3F51B5";
    let margin = 0;
    let fl_h = this.geo_params.floor_height * this.geo_params.pix_per_m;
    this.ctx.fillRect(
      margin,
      this.cv_height - fl_h,
      this.cv_width - 2 * margin,
      fl_h - margin
    );
    this.ctx.restore();
  }

  draw_cart(): void {
    this.ctx.save();
    let x_cv = this.obtain_x_px();
    let w_cart = this.geo_params.w_cart * this.geo_params.pix_per_m;
    let h_cart = this.geo_params.h_cart * this.geo_params.pix_per_m;
    let wheel_rad = this.sim_params.wheel_rad * this.geo_params.pix_per_m;
    let fl_h = this.geo_params.floor_height * this.geo_params.pix_per_m;
    this.ctx.fillStyle = "#113333";
    let start_x_cart = x_cv - w_cart / 2;
    let start_y_cart = this.roundInt(
      this.cv_height - fl_h - wheel_rad - h_cart
    );
    this.ctx.fillRect(start_x_cart, start_y_cart, w_cart, h_cart);
    this.ctx.restore();
    this.draw_wheels();
    this.draw_pendulum();
  }
  obtain_x_px(): number {
    let x_proj_px =
      this.state.x * this.geo_params.pix_per_m +
      this.geo_params.offset_x * this.geo_params.pix_per_m;
    let dx = this.state.x_dot * (this.geo_params.dt_draw / 1000);
    let lft_bnd = 0.8;
    let rght_bnd = 0.2;
    if (x_proj_px > lft_bnd * this.cv_width) {
      // && this.state.x_dot > 0) {
      // this.geo_params.offset_x += dx;
      return lft_bnd * this.cv_width;
    } else if (x_proj_px < rght_bnd * this.cv_width) {
      // &&  this.state.x_dot < 0) {
      // this.geo_params.offset_x += dx;
      return rght_bnd * this.cv_width;
    }
    return x_proj_px;
  }

  draw_wheels(): void {
    // left wheel
    let x_pos = this.obtain_x_px();
    let w_cart = this.geo_params.w_cart * this.geo_params.pix_per_m;
    let wheel_radius = this.sim_params.wheel_rad * this.geo_params.pix_per_m;
    let fl_h = this.geo_params.floor_height * this.geo_params.pix_per_m;
    let beta_w = (180 / Math.PI) * this.state.beta_wheel;

    let first_x = x_pos - (1 / 3) * w_cart;
    let sec_x = x_pos + (1 / 3) * w_cart;
    let y_w = this.cv_height - fl_h - wheel_radius;

    this.draw_wheel(first_x, y_w, wheel_radius, beta_w);
    this.draw_wheel(sec_x, y_w, wheel_radius, beta_w);
  }

  draw_wheel(xc, yc, wheel_radius, wheel_angle): void {
    this.ctx.save();

    this.ctx.beginPath();
    this.ctx.fillStyle = "#404040"; // Wheel primary color
    this.ctx.arc(
      xc,
      yc,
      wheel_radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    this.ctx.fill();
    this.ctx.closePath();

    let w_a = (Math.PI / 180) * wheel_angle;
    let xp1 = wheel_radius * Math.cos(w_a);
    let yp1 = wheel_radius * Math.sin(w_a);
    let xp2 = -xp1;
    let yp2 = -yp1;

    this.ctx.beginPath();
    this.ctx.lineWidth = wheel_radius * 0.3;
    this.ctx.strokeStyle = "#661111"; // Wheel's stripe color
    let x1 = xp1 + xc;
    let x2 = xp2 + xc;
    let y1 = yp1 + yc;
    let y2 = yp2 + yc;

    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.restore();
  }

  draw_pendulum(): void {
    let x_pos = this.obtain_x_px();
    let w_cart = this.geo_params.w_cart * this.geo_params.pix_per_m;
    let h_cart = this.geo_params.h_cart * this.geo_params.pix_per_m;
    let wheel_radius = this.sim_params.wheel_rad * this.geo_params.pix_per_m;
    let fl_h = this.geo_params.floor_height * this.geo_params.pix_per_m;
    let L = this.sim_params.L * this.geo_params.pix_per_m;
    let theta = this.state.theta;
    let pend_radius = this.geo_params.pend_radius * this.geo_params.pix_per_m;

    // Draw base of the pendulum
    let st_bx = x_pos - w_cart / 10;
    let st_by = this.cv_height - fl_h - wheel_radius - 1.2 * h_cart;
    this.ctx.save();
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(st_bx, st_by, w_cart / 5, 0.2 * h_cart);

    // Draw the pendulum cord
    let stp_x = x_pos;
    let stp_y = st_by + 0.1 * h_cart;
    let vec_x = L * Math.sin(theta);
    let vec_y = L * Math.cos(theta);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = L * 0.12;
    this.ctx.moveTo(stp_x, stp_y);
    this.ctx.lineTo(stp_x + vec_x, stp_y - vec_y);
    this.ctx.stroke();
    this.ctx.closePath();

    // Draw the pendulum itself
    let vecp_x = (L + pend_radius) * Math.sin(theta);
    let vecp_y = (L + pend_radius) * Math.cos(theta);
    let cx = stp_x + vecp_x;
    let cy = stp_y - vecp_y;

    this.ctx.beginPath();
    this.ctx.fillStyle = "#113333"; // pendulum primary color
    this.ctx.arc(
      cx,
      cy,
      pend_radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.restore();
  }

  draw_text(): void {
    this.ctx.font = "15px serif";
    this.ctx.fillStyle = "#002225";
    let text = this.sim_params.time_up.toFixed(3);
    this.ctx.fillText(
      "time up: " + text,
      0.8 * this.cv_width,
      0.1 * this.cv_height
    );
    this.ctx.font = "15px serif";
    this.ctx.fillStyle = "#002225";
    let score = this.sim_params.best_score.toFixed(3);
    this.ctx.fillText(
      "best score: " + score,
      0.8 * this.cv_width,
      0.15 * this.cv_height
    );
  }

  draw(): void {
    if (this.TimerRef) {
      clearTimeout(this.TimerRef);
    }
    this.TimerRef = setTimeout(() => this.draw(), this.geo_params.dt_draw);
    this.ctx = this.canvasRef.nativeElement.getContext("2d");
    this.draw_background();
    this.draw_floor();
    this.draw_markers();
    this.draw_cart();
    // this.draw_text();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cv_width) {
      this.cv_width = changes.cv_width.currentValue;
      this.ngZone.runOutsideAngular(() => this.draw());
    }
    if (changes.cv_height) {
      this.cv_height = changes.cv_height.currentValue;
      this.ngZone.runOutsideAngular(() => this.draw());
    }

  }
}
