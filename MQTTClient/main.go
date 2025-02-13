package main

import (
	"MQTTClient/DataStructs"
	"encoding/json"
	"fmt"
	"github.com/eclipse/paho.mqtt.golang"
	"github.com/ijustfool/docker-secrets"
	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"golang.org/x/net/context"
	"log"
	"os"
	"time"
)

// MQTT client params, please use own keys, This key and password is not a valid key
const (
	brokerAddress = "eu1.cloud.thethings.network:1883"
	topic         = "v3/loratest/devices/eui-abc/up"
	username      = "...@ttn"
	password      = "NNSXS..."
	qos           = 1
)

var dbClient influxdb2.Client
var lastData DataStructs.DecodedPayload

// DB params
const (
	dbBucket = "weather"
	dbOrg    = "iot"
)

func handleMqttMessage(client mqtt.Client, msg mqtt.Message) {
	// Create a weather station message object
	var message DataStructs.MQTTDataStruct

	// Try to unmarshal the json into the message
	err := json.Unmarshal(msg.Payload(), &message)
	if err != nil {
		panic(err)
	}

	// Print the message and put into db
	fmt.Println(message.UplinkMessage.DecodedPayload)
	insertIntoDB(dbClient, message.UplinkMessage.DecodedPayload)
}

func connectToInfluxDB() (influxdb2.Client, error) {
	// Read the InfluxDB URL from an environment variable
	influxdbURL := os.Getenv("INFLUXDB_URL")
	if influxdbURL == "" {
		log.Fatal("INFLUXDB_URL environment variable is not set")
	}
	dockerSecrets, _ := secrets.NewDockerSecrets("")
	apiToken, _ := dockerSecrets.Get("influxdb_api_write_token")

	// Connect to the influx database
	client := influxdb2.NewClient(influxdbURL, string(apiToken))

	// validate client connection health
	_, healthErr := client.Health(context.Background())

	return client, healthErr
}

func insertIntoDB(client influxdb2.Client, data DataStructs.DecodedPayload) {
	// Clean extreme outs
	data = cleanData(data)
	fmt.Println(data)

	// Write data into db
	writeAPI := client.WriteAPI(dbOrg, dbBucket)
	writeAPI.WriteRecord(fmt.Sprintf("stat,unit=altitude avg=%d", data.Altitude))
	writeAPI.WriteRecord(fmt.Sprintf("stat,unit=hourrainfall avg=%d", data.HourRainfall))
	writeAPI.WriteRecord(fmt.Sprintf("stat,unit=light avg=%d", data.Light))
	writeAPI.WriteRecord(fmt.Sprintf("stat,unit=pressure avg=%d", data.Pressure))
	writeAPI.WriteRecord(fmt.Sprintf("stat,unit=rainbuckets avg=%d", data.RainBuckets))
	writeAPI.WriteRecord(fmt.Sprintf("stat,unit=temp avg=%d", data.Temp))
	writeAPI.WriteRecord(fmt.Sprintf("stat,unit=totalrain avg=%d", data.TotalRain))
	writeAPI.WriteRecord(fmt.Sprintf("stat,unit=uvindex avg=%d", data.UVIndex))
	writeAPI.Flush()
	lastData = data

}

// Used to filter extreme outs.
func cleanData(data DataStructs.DecodedPayload) DataStructs.DecodedPayload {
	if data.Altitude > 10000 || data.Altitude < lastData.Altitude-200 {
		data.Altitude = lastData.Altitude
	}
	if data.HourRainfall > 10000 {
		data.HourRainfall = lastData.HourRainfall
	}
	if data.Light > 1000 {
		data.Light = lastData.Light
	}
	if data.Pressure > 200000 {
		data.Pressure = lastData.Pressure
	}
	if data.RainBuckets > lastData.RainBuckets+50 {
		data.HourRainfall = lastData.HourRainfall
	}
	if data.Temp > 60000 {
		data.Temp = lastData.Temp
	}
	if data.TotalRain > lastData.TotalRain+1000 {
		data.TotalRain = lastData.TotalRain
	}
	if data.UVIndex > 10000 {
		data.UVIndex = lastData.UVIndex
	}
	return data
}

func main() {
	// Open new connection to Influx DB
	dbClient, _ = connectToInfluxDB()

	// If for whatever reason main quits
	defer dbClient.Close()

	// Set params for mqtt connection
	opts := mqtt.NewClientOptions()
	opts.AddBroker(brokerAddress)
	opts.SetUsername(username)
	opts.SetPassword(password)

	// Create new MQTT client
	mqttClient := mqtt.NewClient(opts)

	// Connect to MQTT broker
	if token := mqttClient.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	// Subscribe to weather station data
	if token := mqttClient.Subscribe(topic, qos, handleMqttMessage); token.Wait() && token.Error() != nil {
		// Quit if mqtt fails
		panic(token.Error())
	}

	fmt.Println("Successfully subscribed to topic:", topic)

	// Loop infinitely and wait for mqtt messages to roll in
	for {
		// Time sleep can be whatever
		time.Sleep(100 * time.Millisecond)
	}
}
