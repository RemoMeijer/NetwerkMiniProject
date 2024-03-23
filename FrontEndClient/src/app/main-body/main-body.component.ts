import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-main-body',
  standalone: true,
  imports: [HttpClientModule ],
  templateUrl: './main-body.component.html',
  styleUrl: './main-body.component.css'
})
export class MainBodyComponent implements OnInit {
  private dataRefresh: number = 5000

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    // setInterval(() => {
    //   this.getData();
    // }, this.dataRefresh);
  }

  // getData() {
  //   console.log("Getting them data's")
  //   this.httpClient.get("http://localhost:7080").subscribe(data => {
  //     console.log(data)
  //   })
  // }

}
