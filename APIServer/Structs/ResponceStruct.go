package Structs

type WeatherData struct {
	Time  int64   `json:"time"`
	Unit  string  `json:"unit"`
	Value float64 `json:"value"`
}
