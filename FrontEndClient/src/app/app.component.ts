import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainBodyComponent} from "./main-body/main-body.component";
import {HttpService} from "./http.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainBodyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(private httpService: HttpService) {}

  // Get the weather data each 2.5 seconds or so
  ngOnInit(): void {
    setInterval(() => {
      this.httpService.getWeatherData();
    }, 2500);

    // Init weather data for less waiting time
    this.httpService.getWeatherData();
  }

}
