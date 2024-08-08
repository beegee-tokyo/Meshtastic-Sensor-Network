var node_id = '';

// Check where the data is coming from
if (msg.payload.from == 1129595066) {
	node_id = 'pocket';
} else if (msg.payload.from == 436487339) {
	node_id = 'hub';
} else if (msg.payload.from == 647006344) {
	node_id = 'ind';
} else if (msg.payload.from == 2471283960) {
	node_id = 'gw';
} else {
	node_id = msg.payload.from.toString();
}

// Prepare the variables for the data
var new_payload = [];
var humidity = 0.0;
var iaq = 0.0;
var pressure = 0.0;
var temperature = 0.0;
var lux = 0.0;
var batt_level = 0.0;
var voltage = 0.0;
var pm_10 = 0.0;
var pm_25 = 0.0;
var pm_100 = 0.0;
var pm_10_e = 0.0;
var pm_25_e = 0.0;
var pm_100_e = 0.0;

// Flag if the data should be sent to the data base
msg.valid = true;

// Check if the data is the type telemetry
if (msg.payload.type == "telemetry") {
	// Check if the data is environment data
	if (typeof (msg.payload.payload["barometric_pressure"]) != "undefined") {
		// node.warn("Environment found " + node_id);
		pressure = msg.payload.payload.barometric_pressure;
		iaq = msg.payload.payload.iaq;
		humidity = msg.payload.payload.relative_humidity;
		temperature = msg.payload.payload.temperature;
		lux = msg.payload.payload.lux;
		new_payload.push({ measurement: node_id + "_env", fields: { pressure: pressure, iaq: iaq, humidity: humidity, temperature: temperature, light: lux }, timestamp: new Date().getTime() - 1 });
		msg.payload = new_payload;
	}
	// Check if the data is device information (battery level and voltage)
	else if (typeof (msg.payload.payload["air_util_tx"]) != "undefined") {
		// node.warn("Power found " + node_id);
		if (msg.payload.payload.voltage != 0) {
			batt_level = msg.payload.payload.battery_level;
			voltage = msg.payload.payload.voltage;
			new_payload.push({ measurement: node_id + "_pwr", fields: { voltage: voltage, batt_level: batt_level }, timestamp: new Date().getTime() - 1 });
			msg.payload = new_payload;
		} else {
			msg.valid = false;
		}
	}
	// Check if the data is air quality data
	else if (typeof (msg.payload.payload["pm10"]) != "undefined") {
		// node.warn("PM found " + node_id);
		pm_10 = msg.payload.payload.pm10;
		pm_25 = msg.payload.payload.pm25;
		pm_100 = msg.payload.payload.pm100;
		pm_10_e = msg.payload.payload.pm10_e;
		pm_25_e = msg.payload.payload.pm25_e;
		pm_100_e = msg.payload.payload.pm100_e;

		new_payload.push({ measurement: node_id + "_pms", fields: { pm_10: pm_10, pm_25: pm_25, pm_100: pm_100, pm_10_e: pm_10_e, pm_25_e: pm_25_e, pm_100_e: pm_100_e }, timestamp: new Date().getTime() - 1 });
		msg.payload = new_payload;
	}
	else {
		// node.warn("No Environment " + node_id);
		msg.valid = false;
	}
}
// Check if the data is location data
else if (msg.payload.type == "position") {
	if (typeof (msg.payload.payload["latitude_i"]) != "undefined") {
		// node.warn("Location found " + node_id);
		var altitude = msg.payload.payload.altitude;
		var latitude = msg.payload.payload.latitude_i / 10000000;
		var longitude = msg.payload.payload.longitude_i / 10000000;
		if (msg.payload.from == 1129595066) {
			new_payload.push({ measurement: node_id + "_loc", fields: { altitude_pocket: altitude, latitude_pocket: latitude, longitude_pocket: longitude }, timestamp: new Date().getTime() - 1 });
		} else if (msg.payload.from == 436487339) {
			new_payload.push({ measurement: node_id + "_loc", fields: { altitude_hub: altitude, latitude_hub: latitude, longitude_hub: longitude }, timestamp: new Date().getTime() - 1 });
		} else if (msg.payload.from == 647006344) {
			new_payload.push({ measurement: node_id + "_loc", fields: { altitude_ind: altitude, latitude_ind: latitude, longitude_ind: longitude }, timestamp: new Date().getTime() - 1 });
		} else if (msg.payload.from == 2471283960) {
			new_payload.push({ measurement: node_id + "_loc", fields: { altitude_gw: altitude, latitude_gw: latitude, longitude_gw: longitude }, timestamp: new Date().getTime() - 1 });
		} else {
			new_payload.push({ measurement: node_id + "_loc", fields: { altitude: altitude, latitude: latitude, longitude: longitude }, timestamp: new Date().getTime() - 1 });
		}
		msg.payload = new_payload;
	}
	else {
		// node.warn("No latitude found " + node_id);
		msg.valid = false;
	}
}
// We are not interested in this data, might be node info or other stuff
else {
	// node.warn("No known type " + node_id + " " + msg.payload.type);
	msg.valid = false;
}
return msg;