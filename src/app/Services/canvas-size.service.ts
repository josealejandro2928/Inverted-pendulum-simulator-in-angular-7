import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class CanvasSizeService {
  canvasWidth = 790;
  canvasHeigth = 407;
  hideAgentbar = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    // this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Handset, Breakpoints.XSmall,
    // Breakpoints.Small, Breakpoints.Tablet]).subscribe(data => {
    //   console.log(data.breakpoints);
    // });

  }

  transformCanvasSize(): void {
    if (this.hideAgentbar) {
      this.canvasHeigth = 520;
    }
    else {
      this.canvasHeigth = 407;

    }


  }
}
