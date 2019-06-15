export class Geo_params {
  w_cart: number;
  h_cart: number;
  floor_height: number;
  pix_per_m: number;
  pend_radius: number;
  offset_x: number;
  dt_draw: number;
  wheel_rad: number;

  constructor(w_cart: number = 0.43, h_cart: number = 0.2, wheel_rad: number = 0.045, floor_height: number = 0.55,
    pix_per_m: number = 275, pend_radius: number = 0.065, offset_x: number = 1.35, dt_draw: number = 5) {
    this.w_cart = w_cart;
    this.h_cart = h_cart;
    this.floor_height = floor_height;
    this.pix_per_m = pix_per_m;
    this.pend_radius = pend_radius;
    this.offset_x = offset_x;
    this.dt_draw = dt_draw;
    this.wheel_rad = wheel_rad;
  }
  update(g: Geo_params): void {
    this.w_cart = g.w_cart;
    this.h_cart = g.h_cart;
    this.floor_height = g.floor_height;
    this.pix_per_m = g.pix_per_m;
    this.pend_radius = g.pend_radius;
    this.offset_x = g.offset_x;
    this.dt_draw = g.dt_draw;
    this.wheel_rad = g.wheel_rad;
  }

}
