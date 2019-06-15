import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgentService } from './Services/AgentServices/agent.service';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyNavbarComponent } from './my-navbar/my-navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialComponentsModule } from '../app/shared/material-components/material-components.module';
import { SimPramsComponentComponent } from './sim-prams-component/sim-prams-component.component';
import { SetpointComponent } from './setpoint/setpoint.component';
import { CanvasComponent } from './canvas/canvas.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SimulationService } from './Services/SimulationServices/simulation.service';
import { CanvasSizeService } from './Services/canvas-size.service';
import { from } from 'rxjs';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  declarations: [
    AppComponent,
    MyNavbarComponent,
    SimPramsComponentComponent,
    SetpointComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialComponentsModule,
    FormsModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule
  ],
  providers: [AgentService, SimulationService, CanvasSizeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
