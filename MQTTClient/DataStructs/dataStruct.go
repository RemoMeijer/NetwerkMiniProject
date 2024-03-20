package DataStructs

// MQTTDataStruct represents the structure of the received message from the MQTT broker
type MQTTDataStruct struct {
	EndDeviceIDs   EndDeviceIDs  `json:"end_device_ids"`
	CorrelationIDs []string      `json:"correlation_ids"`
	ReceivedAt     string        `json:"received_at"`
	UplinkMessage  UplinkMessage `json:"uplink_message"`
}

// EndDeviceIDs represents the device identification details
type EndDeviceIDs struct {
	DeviceID       string         `json:"device_id"`
	ApplicationIDs ApplicationIDs `json:"application_ids"`
	DevEUI         string         `json:"dev_eui"`
	JoinEUI        string         `json:"join_eui"`
	DevAddr        string         `json:"dev_addr"`
}

// ApplicationIDs represents the application details
type ApplicationIDs struct {
	ApplicationID string `json:"application_id"`
}

// UplinkMessage represents the uplink message details
type UplinkMessage struct {
	SessionKeyID    string         `json:"session_key_id"`
	FPort           int            `json:"f_port"`
	FCnt            int            `json:"f_cnt"`
	FrmPayload      string         `json:"frm_payload"`
	DecodedPayload  DecodedPayload `json:"decoded_payload"`
	RxMetadata      []RxMetadata   `json:"rx_metadata"`
	Settings        Settings       `json:"settings"`
	ReceivedAt      string         `json:"received_at"`
	Confirmed       bool           `json:"confirmed"`
	ConsumedAirtime string         `json:"consumed_airtime"`
	NetworkIDs      NetworkIDs     `json:"network_ids"`
}

// DecodedPayload represents the decoded sensor data
type DecodedPayload struct {
	Humi int `json:"humi"`
	Temp int `json:"temp"`
}

// RxMetadata represents the metadata for received signals
type RxMetadata struct {
	GatewayIDs  GatewayIDs `json:"gateway_ids"`
	Time        string     `json:"time"`
	Timestamp   int64      `json:"timestamp"`
	RSSI        int        `json:"rssi"`
	ChannelRSSI int        `json:"channel_rssi"`
	SNR         float64    `json:"snr"`
	Location    Location   `json:"location"`
	UplinkToken string     `json:"uplink_token"`
	ReceivedAt  string     `json:"received_at"`
}

// GatewayIDs represents the gateway identification details
type GatewayIDs struct {
	GatewayID string `json:"gateway_id"`
	EUI       string `json:"eui"`
}

// Location represents the location data
type Location struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Altitude  int     `json:"altitude"`
	Source    string  `json:"source"`
}

// Settings represents the uplink settings
type Settings struct {
	DataRate  DataRate `json:"data_rate"`
	Frequency string   `json:"frequency"`
	Timestamp int64    `json:"timestamp"`
	Time      string   `json:"time"`
}

// DataRate represents the data rate details
type DataRate struct {
	LoRa LoRa `json:"lora"`
}

// LoRa represents the LoRa specific data rate details
type LoRa struct {
	Bandwidth       int    `json:"bandwidth"`
	SpreadingFactor int    `json:"spreading_factor"`
	CodingRate      string `json:"coding_rate"`
}

// NetworkIDs represents the network identification details
type NetworkIDs struct {
	NetID          string `json:"net_id"`
	NsID           string `json:"ns_id"`
	TenantID       string `json:"tenant_id"`
	ClusterID      string `json:"cluster_id"`
	ClusterAddress string `json:"cluster_address"`
}
