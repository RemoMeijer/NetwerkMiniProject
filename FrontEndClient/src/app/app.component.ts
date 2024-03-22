import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainBodyComponent} from "./main-body/main-body.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainBodyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FrontEndClient';
}
