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
	"os"
	"time"
)

var dbClient influxdb2.Client
var dbTimeQuery string

const (
	dbBucket = "weather"
	dbOrg    = "iot"
)

func connectToInfluxDB() (influxdb2.Client, error) {
	// Connect to the influx database
	client := influxdb2.NewClient(os.Getenv("INFLUXDB_URL"), os.Getenv("INFLUXDB_API_TOKEN"))

	// validate client connection health
	_, err := client.Health(context.Background())

	return client, err
}

func fetchFromDB(w http.ResponseWriter, r *http.Request) {
	// create data array
	var weatherData []Structs.WeatherData

	// Query db with given timeframe
	queryAPI := dbClient.QueryAPI(dbOrg)
	result, err := queryAPI.Query(context.Background(), `from(bucket: "weather")
			|> range(start: -`+dbTimeQuery+`)
  			|> filter(fn: (r) => r["_measurement"] == "stat")
  			|> filter(fn: (r) => r["_field"] == "avg")
  			|> filter(fn: (r) => r["unit"] == "altitude" or 
								 r["unit"] == "hourrainfall" or
					  	 	 	 r["unit"] == "light" or 
							     r["unit"] == "pressure" or 
								 r["unit"] == "rainbuckets" or
					  	 	 	 r["unit"] == "temp" or
								 r["unit"] == "totalrain" or
					  	 	 	 r["unit"] == "uvindex")`)
	if err == nil {
		// Loop trough results
		for result.Next() {
			record := result.Record()
			value, ok := record.Value().(float64)
			if !ok {
				fmt.Println("Error: value not a float64")
				continue
			}

			// Put results in a WeatherData Object
			data := Structs.WeatherData{
				Time:  record.Time().UnixMilli(), // todo -> better to get time form db
				Unit:  record.ValueByKey("unit").(string),
				Value: value,
			}
			weatherData = append(weatherData, data)
		}
		if result.Err() != nil {
			fmt.Printf("query parsing error: %s\n", result.Err().Error())
		}

		// Create JSON from weather-data
		jsonWeatherData, jsonErr := json.Marshal(weatherData)
		if jsonErr != nil {
			fmt.Printf("JSON marshaling error: %s\n", jsonErr.Error())
		}

		// Send off data
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, writeErr := w.Write(jsonWeatherData)
		if writeErr != nil {
			return
		}

	} else {
		panic(err)
	}
}

// Allow CORS
func addCORSHeaders(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from all origins
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Set other CORS headers as needed
		w.Header().Set("Access-Control-Allow-Methods", "GET")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		handler.ServeHTTP(w, r)
	})
}

// Update timeframe data gets queried from DB
func updateTime(writer http.ResponseWriter, request *http.Request) {
	err := request.ParseForm()
	if err != nil {
		http.Error(writer, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	// Get time from POST request
	dbTimeQuery = request.FormValue("time")
}

func main() {
	time.Sleep(2000 * time.Millisecond)
	dbTimeQuery = "1h" // standard time value
	dbClient, _ = connectToInfluxDB()

	// Setup routing
	r := mux.NewRouter()
	r.HandleFunc("/", fetchFromDB).Methods("GET")
	r.HandleFunc("/", updateTime).Methods("POST")

	// Start server
	fmt.Println("Starting Server on port 7080")
	srv := &http.Server{
		Handler:      addCORSHeaders(r),
		Addr:         "0.0.0.0:7080",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	// Listen for connections until fatal crash
	log.Fatal(srv.ListenAndServe())
}
