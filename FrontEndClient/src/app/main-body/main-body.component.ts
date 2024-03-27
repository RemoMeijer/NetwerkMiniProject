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
  constructor(private httpService: HttpService) {
  }

  altitudeChart: any;
  hourRainfallChart: any;
  lightChart: any;
  pressureChart: any;
  rainBucketsChart: any;
  tempChart: any;
  totalRainChart: any;
  uvIndexChart: any;

  // This was used for 1 graph and 8 lines to toggle the lines
  // Not needed now
  altitudeChecked: boolean = true;
  hourrainfallChecked: boolean = true;
  lightChecked: boolean = true;
  pressureChecked: boolean = true;
  rainbucketsChecked: boolean = true;
  tempChecked: boolean = true;
  totalrainChecked: boolean = true;
  uvindexChecked: boolean = true;

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
    // Init all the graphs
    this.altitudeChart = new Chart('altitudeCanvas', {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: true,
        elements: {
          point: {
            pointStyle: false,
          }
        },
        plugins: {
          legend: {
            // @ts-ignore
            onClick: null
          }
        }
      }
    });

    this.tempChart = new Chart('tempCanvas', {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: true,
        elements: {
          point: {
            pointStyle: false,
          }
        },
        plugins: {
          legend: {
            // @ts-ignore
            onClick: null
          }
        }
      }
    });

    this.hourRainfallChart = new Chart('hourrainfallCanvas', {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: true,
        elements: {
          point: {
            pointStyle: false,
          }
        },
        plugins: {
          legend: {
            // @ts-ignore
            onClick: null
          }
        }
      }
    });

    this.lightChart = new Chart('lightCanvas', {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: true,
        elements: {
          point: {
            pointStyle: false,
          }
        },
        plugins: {
          legend: {
            // @ts-ignore
            onClick: null
          }
        }
      }
    });

    this.pressureChart = new Chart('pressureCanvas', {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: true,
        elements: {
          point: {
            pointStyle: false,
          }
        },
        plugins: {
          legend: {
            // @ts-ignore
            onClick: null
          }
        }
      }
    });

    this.totalRainChart = new Chart('totalrainCanvas', {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: true,
        elements: {
          point: {
            pointStyle: false,
          }
        },
        plugins: {
          legend: {
            // @ts-ignore
            onClick: null
          }
        }
      }
    });

    // Update graphs each 2.5 seconds or so
    setInterval(() => {
      this.updateCharts();
    }, 2500);

    this.updateCharts();
  }

  updateCharts() {
    // Update each chart
    for (let i = 0; i < this.availableDataSets.length; i++) {
      this.updateChart(i)
    }
  }

  updateChart(index: number) {
    const graphColors: string[] = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#800080', '#008080'];
    const timePoints: string[] = [];

    // Get weather-data by name
    let weatherArray: WeatherObjects[] = this.httpService.getArrayByName(this.availableDataSets[index].name )
    const dataArray: number[] = []

    // Put the weather-data in an array with correct time
    for (let data of weatherArray) {
      const date = new Date(data.time)
      const hours = date.getHours();
      const minutes = date.getMinutes();

      // Add leading minute zero when minutes < 10
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes

      timePoints.push(hours + ':' + formattedMinutes);
      dataArray.push(data.value)
    }

    // Put the weather-data in corresponding graph
    switch (index) {
      case 0:
        this.altitudeChart.data.datasets = [];
        this.altitudeChart.data.datasets.push({
          label: 'Altitude (m)',
          data: dataArray,
          backgroundColor: graphColors[index],
          borderColor: graphColors[index],
        });
        this.altitudeChart.data.labels = timePoints;
        this.altitudeChart.update();
        return
      case 1:
        this.hourRainfallChart.data.datasets = [];
        this.hourRainfallChart.data.datasets.push({
          label: 'Rainfall (last hour mm)',
          data: dataArray,
          backgroundColor: graphColors[index],
          borderColor: graphColors[index],
        });
        this.hourRainfallChart.data.labels = timePoints;
        this.hourRainfallChart.update();
        return
      case 2:
        this.lightChart.data.datasets = [];
        this.lightChart.data.datasets.push({
          label: 'Light value (0-800)',
          data: dataArray,
          backgroundColor: graphColors[index],
          borderColor: graphColors[index],
        });
        this.lightChart.data.labels = timePoints;
        this.lightChart.update();
        return;
      case 3:
        this.pressureChart.data.datasets = [];
        this.pressureChart.data.datasets.push({
          label: 'Pressure (hPa)',
          data: dataArray,
          backgroundColor: graphColors[index],
          borderColor: graphColors[index],
        });
        this.pressureChart.data.labels = timePoints;
        this.pressureChart.update();
        return
      // Not fascinating to display
      case 4:
        // this.rainBucketsChart.data.datasets = [];
        // this.rainBucketsChart.data.datasets.push({
        //   label: this.availableDataSets[index].name,
        //   data: dataArray,
        //   backgroundColor: graphColors[index],
        //   borderColor: graphColors[index],
        // });
        // this.rainBucketsChart.data.labels = timePoints;
        // this.rainBucketsChart.update();
        return
      case 5:
        this.tempChart.data.datasets = [];
        this.tempChart.data.datasets.push({
          label: 'Temperature (°C)',
          data: dataArray,
          backgroundColor: graphColors[index],
          borderColor: graphColors[index],
        });
        this.tempChart.data.labels = timePoints;
        this.tempChart.update();
        return
      case 6:
        this.totalRainChart.data.datasets = [];
        this.totalRainChart.data.datasets.push({
          label: 'Rainfall (total mm)',
          data: dataArray,
          backgroundColor: graphColors[index],
          borderColor: graphColors[index],
        });
        this.totalRainChart.data.labels = timePoints;
        this.totalRainChart.update();
        return
      // todo make data ok
      case 7:
        // this.uvIndexChart.data.datasets = [];
        // this.uvIndexChart.data.datasets.push({
        //   label: this.availableDataSets[index].name,
        //   data: dataArray,
        //   backgroundColor: graphColors[index],
        //   borderColor: graphColors[index],
        // })
        // this.uvIndexChart.data.labels = timePoints;
        // this.uvIndexChart.update();
        return
    }
  }

  // Post to API that we want another time
  setTime(s: string) {
    this.httpService.postTimeUpdate(s)
  }
}
