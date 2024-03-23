import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) { }

  public getWeatherData(): void {
    this.httpClient.get("http://localhost:7080").subscribe(data => {
      this.sortData(data);
    })
  }

  private sortData(data: any): void {
    if (typeof data !== 'object' || data === null ) {
      console.error("Incorrect data provided");
      return;
    }
  }
}
