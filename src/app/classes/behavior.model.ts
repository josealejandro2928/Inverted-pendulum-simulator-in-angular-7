export class Behavior {
  public input_force: number;
  public key_force: number;
  public modes: string[];
  public id_modes: number;
  public running: boolean;
  public F: number;
  public keysense: number;
  public server_url: string;
  public connected: boolean;

  constructor() {
    this.input_force = 0.0;
    this.key_force = 0.0;
    this.modes = ["manual", "pid_theta", "pid_cascade", "go_to_point"];
    this.id_modes = 0;
    this.running = false;
    this.F = this.input_force + this.key_force;
    this.keysense = 0;
    this.server_url = "http://127.0.0.1:5000/";
    this.connected = false;
  }

  getForce(): number {
    return this.key_force + this.input_force;
  }

  reset(): void {
    this.running = false;
    this.input_force = 0.0;
    this.key_force = 0.0;
  }
}
