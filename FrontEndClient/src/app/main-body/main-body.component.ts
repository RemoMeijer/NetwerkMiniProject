import {Component, OnInit} from '@angular/core';
import {Chart} from 'chart.js/auto'
import {HttpService} from "../http.service";
import {WeatherObjects} from "../objects/weatherObjects";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
@Component({
  selector: 'app-main-body',
  standalone: true,
  templateUrl: './main-body.component.html',
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrl: './main-body.component.css'
})
export class MainBodyComponent implements OnInit {
  constructor(private httpService: HttpService) {}
  chart: any;

  altitudeChecked:boolean = true;
  hourrainfallChecked:boolean = false;
  lightChecked:boolean = false;
  pressureChecked:boolean = false;
  rainbucketsChecked:boolean = false;
  tempChecked:boolean = false;
  totalrainChecked:boolean = false;
  uvindexChecked:boolean = false;

  availableDataSets = [
    {name: "altitude", show: this.altitudeChecked},
    {name: "hourrainfall", show: this.hourrainfallChecked},
    {name: "light", show: this.lightChecked},
    {name: "pressure", show: this.pressureChecked},
    {name: "rainbuckets", show: this.rainbucketsChecked},
    {name: "temp", show: this.tempChecked},
    {name: "totalrain", show: this.totalrainChecked},
    {name: "uvindex", show: this.uvindexChecked},
  ]

  ngOnInit(): void {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            // @ts-ignore
            onClick: null
          }
        }
      }
    });

    setInterval(() => {
      this.updateChart();
    }, 2500);
    this.updateChart();
  }

  updateChart() {
    const graphColors: string[] = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#800080', '#008080'];
    this.chart.data.datasets= [];
    const timePoints: number[] = [];

    for(let i = 0; i < 8; i++){
      if (!this.availableDataSets[i].show) {
        continue;
      }

      let weatherArray: WeatherObjects[] = this.httpService.getArrayByName(this.availableDataSets[i].name)
      const dataArray: number[] = []
      let updateTime = false;

      if (timePoints.length == 0) {
        updateTime = true;
      }

      for(let data of weatherArray) {
        if (updateTime) {
          timePoints.push(data.time);
        }

        dataArray.push(data.value)
      }

      this.chart.data.datasets.push({
        label: this.availableDataSets[i].name,
        data: dataArray,
        backgroundColor: graphColors[i],
        borderColor: graphColors[i],
      })
    }
    this.chart.data.labels = timePoints;

    this.chart.update();

  }
}
