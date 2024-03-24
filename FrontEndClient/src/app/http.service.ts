import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WeatherObjects} from "./objects/weatherObjects";

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private _altitudeArray: WeatherObjects[] = [];
  private _hourRainfallArray: WeatherObjects[] = [];
  private _lightArray: WeatherObjects[] = [];
  private _pressureArray: WeatherObjects[] = [];
  private _rainBucketsArray: WeatherObjects[] = [];
  private _tempArray: WeatherObjects[] = [];
  private _totalRainArray: WeatherObjects[] = [];
  private _uvIndexArray: WeatherObjects[] = [];

  constructor(private httpClient: HttpClient) { }

  public getWeatherData() {
    this.httpClient.get("http://localhost:7080").subscribe(data => {
      this.sortData(data);
    })
  }

  private sortData(data: any): void {
    if (data === null ) {
      console.error("Incorrect data provided");
      return;
    }

    this.emptyArrays();

    for(const item of data) {
      if (item.unit === 'altitude') {
        item.value = item.value / 100
        this._altitudeArray.push(item);
        continue;
      }
      if (item.unit === 'hourrainfall') {
        item.value = item.value / 100
        this._hourRainfallArray.push(item);
        continue;
      }
      if (item.unit === 'light') {
        this._lightArray.push(item);
        continue;
      }
      if (item.unit === 'pressure') {
        item.value = item.value / 100
        this._pressureArray.push(item);
        continue;
      }
      if (item.unit === 'rainbuckets') {
        this._rainBucketsArray.push(item);
        continue;
      }
      if (item.unit === 'temp') {
        item.value = item.value / 100
        this._tempArray.push(item);
        continue;
      }
      if (item.unit === 'totalrain') {
        item.value = item.value / 100
        this._totalRainArray.push(item);
        continue;
      }
      if (item.unit === 'uvindex') {
        this._uvIndexArray.push(item);
      }
    }
  }

  emptyArrays(): void {
    this._altitudeArray = [];
    this._hourRainfallArray = [];
    this._lightArray = [];
    this._pressureArray = [];
    this._rainBucketsArray = [];
    this._tempArray = [];
    this._totalRainArray = [];
    this._uvIndexArray = [];
  }

  public getArrayByName(name: string) {
    switch (name) {
      case 'altitude': return this.altitudeArray;
      case 'hourrainfall': return this.hourRainfallArray;
      case 'light': return this.lightArray;
      case 'pressure': return this.pressureArray;
      case 'rainbuckets': return this.rainBucketsArray;
      case 'temp': return this.tempArray;
      case 'totalrain': return this.totalRainArray;
      case 'UVIndex': return this.uvIndexArray;
      default: return [];
    }
  }

  get uvIndexArray(): WeatherObjects[] {
    return this._uvIndexArray;
  }
  get totalRainArray(): WeatherObjects[] {
    return this._totalRainArray;
  }
  get tempArray(): WeatherObjects[] {
    return this._tempArray;
  }
  get rainBucketsArray(): WeatherObjects[] {
    return this._rainBucketsArray;
  }
  get pressureArray(): WeatherObjects[] {
    return this._pressureArray;
  }
  get lightArray(): WeatherObjects[] {
    return this._lightArray;
  }
  get hourRainfallArray(): WeatherObjects[] {
    return this._hourRainfallArray;
  }
  get altitudeArray(): WeatherObjects[] {
    return this._altitudeArray;
  }

}
