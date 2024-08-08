[
	{
		"id": "f4c463c3062df8db",
		"type": "tab",
		"label": "Meshtastic-Gateway",
		"disabled": false,
		"info": "",
		"env": []
	},
	{
		"id": "32fc3bbf555b00cb",
		"type": "mqtt in",
		"z": "f4c463c3062df8db",
		"name": "MQTT JSON in",
		"topic": "msh/SG_923_bg/2/json/LongFast/#",
		"qos": "2",
		"datatype": "auto-detect",
		"broker": "dacd71f403d24fd2",
		"nl": false,
		"rap": true,
		"rh": 0,
		"inputs": 0,
		"x": 180,
		"y": 140,
		"wires": [
			[
				"ba7f9c482d0391d1"
			]
		]
	},
	{
		"id": "ba7f9c482d0391d1",
		"type": "function",
		"z": "f4c463c3062df8db",
		"name": "Parse JSON",
		"func": "var node_id = '';\nif (msg.payload.from == 1129595066) {\n    node_id = 'pocket';\n} else if (msg.payload.from == 436487339) {\n    node_id = 'hub';\n} else if (msg.payload.from == 647006344) {\n    node_id = 'ind';\n} else if (msg.payload.from == 2471283960) {\n    node_id = 'gw';\n} else {\n    node_id = msg.payload.from.toString();\n}\nvar new_payload = [];\nvar humidity = 0.0;\nvar iaq = 0.0;\nvar pressure = 0.0;\nvar temperature = 0.0;\nvar lux = 0.0;\nvar batt_level = 0.0;\nvar voltage = 0.0;\nvar pm_10 = 0.0;\nvar pm_25 = 0.0;\nvar pm_100 = 0.0;\nvar pm_10_e = 0.0;\nvar pm_25_e = 0.0;\nvar pm_100_e = 0.0;\n\nmsg.valid = true;\n\nif (msg.payload.type == \"telemetry\") {\n    if (typeof (msg.payload.payload[\"barometric_pressure\"]) != \"undefined\") {\n        // node.warn(\"Environment found \" + node_id);\n        pressure = msg.payload.payload.barometric_pressure;\n        iaq = msg.payload.payload.iaq;\n        humidity = msg.payload.payload.relative_humidity;\n        temperature = msg.payload.payload.temperature;\n        lux = msg.payload.payload.lux;\n        new_payload.push({ measurement: node_id + \"_env\", fields: { pressure: pressure, iaq: iaq, humidity: humidity, temperature: temperature, light: lux }, timestamp: new Date().getTime() - 1 });\n        msg.payload = new_payload;\n    }\n    else if (typeof (msg.payload.payload[\"air_util_tx\"]) != \"undefined\") {\n        // node.warn(\"Power found \" + node_id);\n        if (msg.payload.payload.voltage != 0) {\n            batt_level = msg.payload.payload.battery_level;\n            voltage = msg.payload.payload.voltage;\n            new_payload.push({ measurement: node_id + \"_pwr\", fields: { voltage: voltage, batt_level: batt_level }, timestamp: new Date().getTime() - 1 });\n            msg.payload = new_payload;\n        } else {\n            msg.valid = false;\n        }\n    }\n    else if (typeof (msg.payload.payload[\"pm10\"]) != \"undefined\") {\n        // node.warn(\"PM found \" + node_id);\n        pm_10 = msg.payload.payload.pm10;\n        pm_25 = msg.payload.payload.pm25;\n        pm_100 = msg.payload.payload.pm100;\n        pm_10_e = msg.payload.payload.pm10_e;\n        pm_25_e = msg.payload.payload.pm25_e;\n        pm_100_e = msg.payload.payload.pm100_e;\n\n        new_payload.push({ measurement: node_id + \"_pms\", fields: { pm_10: pm_10, pm_25: pm_25, pm_100: pm_100, pm_10_e: pm_10_e, pm_25_e: pm_25_e, pm_100_e: pm_100_e }, timestamp: new Date().getTime() - 1 });\n        msg.payload = new_payload;\n    }\n    else {\n        // node.warn(\"No Environment \" + node_id);\n        msg.valid = false;\n    }\n}\nelse if (msg.payload.type == \"position\") {\n    if (typeof (msg.payload.payload[\"latitude_i\"]) != \"undefined\") {\n        // node.warn(\"Location found \" + node_id);\n        var altitude = msg.payload.payload.altitude;\n        var latitude = msg.payload.payload.latitude_i / 10000000;\n        var longitude = msg.payload.payload.longitude_i / 10000000;\n        if (msg.payload.from == 1129595066) {\n            new_payload.push({ measurement: node_id + \"_loc\", fields: { altitude_pocket: altitude, latitude_pocket: latitude, longitude_pocket: longitude }, timestamp: new Date().getTime() - 1 });\n        } else if (msg.payload.from == 436487339) {\n            new_payload.push({ measurement: node_id + \"_loc\", fields: { altitude_hub: altitude, latitude_hub: latitude, longitude_hub: longitude }, timestamp: new Date().getTime() - 1 });\n        } else if (msg.payload.from == 647006344) {\n            new_payload.push({ measurement: node_id + \"_loc\", fields: { altitude_ind: altitude, latitude_ind: latitude, longitude_ind: longitude }, timestamp: new Date().getTime() - 1 });\n        } else if (msg.payload.from == 2471283960) {\n            new_payload.push({ measurement: node_id + \"_loc\", fields: { altitude_gw: altitude, latitude_gw: latitude, longitude_gw: longitude }, timestamp: new Date().getTime() - 1 });\n        } else {\n            new_payload.push({ measurement: node_id + \"_loc\", fields: { altitude: altitude, latitude: latitude, longitude: longitude }, timestamp: new Date().getTime() - 1 });\n        }\n        msg.payload = new_payload;\n    }\n    else {\n        // node.warn(\"No latitude found \" + node_id);\n        msg.valid = false;\n    }\n}\nelse {\n    // node.warn(\"No known type \" + node_id + \" \" + msg.payload.type);\n    msg.valid = false;\n}\nreturn msg;",
		"outputs": 1,
		"timeout": 0,
		"noerr": 0,
		"initialize": "",
		"finalize": "",
		"libs": [],
		"x": 430,
		"y": 140,
		"wires": [
			[
				"fbd5b2bd889caede"
			]
		]
	},
	{
		"id": "fbd5b2bd889caede",
		"type": "switch",
		"z": "f4c463c3062df8db",
		"name": "Check Valid",
		"property": "valid",
		"propertyType": "msg",
		"rules": [
			{
				"t": "true"
			},
			{
				"t": "else"
			}
		],
		"checkall": "true",
		"repair": false,
		"outputs": 2,
		"x": 710,
		"y": 140,
		"wires": [
			[
				"fdc8dba64f93c551",
				"13629b9d72441736"
			],
			[]
		]
	},
	{
		"id": "fdc8dba64f93c551",
		"type": "influxdb batch",
		"z": "f4c463c3062df8db",
		"influxdb": "f37681d73732be05",
		"precision": "",
		"retentionPolicy": "",
		"name": "To InfluxDB",
		"database": "database",
		"precisionV18FluxV20": "ms",
		"retentionPolicyV18Flux": "",
		"org": "RAKwireless",
		"bucket": "RAKwireless",
		"x": 970,
		"y": 140,
		"wires": []
	},
	{
		"id": "13629b9d72441736",
		"type": "debug",
		"z": "f4c463c3062df8db",
		"name": "InfluxDB packet",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "payload",
		"targetType": "msg",
		"statusVal": "",
		"statusType": "auto",
		"x": 980,
		"y": 200,
		"wires": []
	},
	{
		"id": "dacd71f403d24fd2",
		"type": "mqtt-broker",
		"name": "Meshtastic",
		"broker": "mqtt://mqtt.meshtastic.org",
		"port": "1883",
		"clientid": "contabo",
		"autoConnect": true,
		"usetls": false,
		"protocolVersion": "4",
		"keepalive": "60",
		"cleansession": true,
		"autoUnsubscribe": true,
		"birthTopic": "msh/SG_923_bg/2/stat/node_red",
		"birthQos": "0",
		"birthRetain": "false",
		"birthPayload": "connected",
		"birthMsg": {},
		"closeTopic": "msh/SG_923_bg/2/stat/node_red",
		"closeQos": "0",
		"closeRetain": "false",
		"closePayload": "close connection",
		"closeMsg": {},
		"willTopic": "msh/SG_923_bg/2/stat/node_red",
		"willQos": "0",
		"willRetain": "false",
		"willPayload": "lost connection",
		"willMsg": {},
		"userProps": "",
		"sessionExpiry": ""
	},
	{
		"id": "f37681d73732be05",
		"type": "influxdb",
		"hostname": "127.0.0.1",
		"port": "8086",
		"protocol": "http",
		"database": "database",
		"name": "Local InfluxDB",
		"usetls": false,
		"tls": "",
		"influxdbVersion": "2.0",
		"url": "http://giesecke.tk:8086",
		"timeout": "10",
		"rejectUnauthorized": false
	}
]