package main

import (
	"APIServer/Structs"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"golang.org/x/net/context"
	"log"
	"net/http"
	"time"
)

var dbClient influxdb2.Client

const (
	dbBucket = "weather"
	dbOrg    = "iot"
)

func connectToInfluxDB() (influxdb2.Client, error) {
	// Connect to the influx database
	client := influxdb2.NewClient("http://localhost:8086", "epglU3GItronqqgI4oBIf5AmdbirwMWpA8KOO91do5Zb1WcdqsRNR8_iULSY29sCQe07FwG7Y8izAarIwfcY3w==")

	// validate client connection health
	_, err := client.Health(context.Background())

	return client, err
}

func fetchFromDB(w http.ResponseWriter, r *http.Request) {
	var weatherData []Structs.Weatherdata
	queryAPI := dbClient.QueryAPI(dbOrg)

	result, err := queryAPI.Query(context.Background(), `from(bucket: "weather")
			|> range(start: -24h)
  			|> filter(fn: (r) => r["_measurement"] == "stat")
  			|> filter(fn: (r) => r["_field"] == "avg")
  			|> filter(fn: (r) => r["unit"] == "humidity" or r["unit"] == "temperature")`)
	if err == nil {
		for result.Next() {
			record := result.Record()
			value, ok := record.Value().(float64)
			if !ok {
				fmt.Println("Error: value not a float64")
				continue
			}
			data := Structs.Weatherdata{
				Time:  record.Time().UnixMilli(),
				Unit:  record.ValueByKey("unit").(string),
				Value: value,
			}
			weatherData = append(weatherData, data)
		}
		if result.Err() != nil {
			fmt.Printf("query parsing error: %s\n", result.Err().Error())
		}
		jsonWeatherData, jsonErr := json.Marshal(weatherData)
		if jsonErr != nil {
			fmt.Printf("JSON marshaling error: %s\n", jsonErr.Error())
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonWeatherData)
	} else {
		panic(err)
	}
}

func main() {
	dbClient, _ = connectToInfluxDB()

	r := mux.NewRouter()
	r.HandleFunc("/", fetchFromDB).Methods("GET")

	fmt.Println("Starting Server on port 7080")
	srv := &http.Server{
		Handler:      r,
		Addr:         "127.0.0.1:7080",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
