Usage
=====

Use a vtt file like this :
```json
WEBVTT
Region: id=aside
Region: id=wrapper

1
00:00:05.000 --> 00:00:10.000 region:aside
{
    "type": "Badge",
    "props": {
        "title": "Badge in region aside"
    }
}

2
00:00:07.000 --> 00:00:12.000 region:wrapper
{
    "type": "div",
    "props": {
        "className": "test"
    }
}

3
00:00:20.000 --> 00:00:23.000 region:wrapper
{
    "className": "wide"
}
```

```
./bin/vtt-json.js parse cue.vtt --output=cue.json
```

It will first internally convert the vtt file to json :
```json
{
	"items": [
		{
			"id": "1",
			"startTime": 5,
			"endTime": 10,
			"payload": {
				"type": "Badge",
				"props": {
					"title": "Badge in region aside"
				}
			},
			"region": "aside",
			"type": "cue"
		},
    ...
	]
}
```

And then compute the state for each step :
```
[
	{
		"time": "5",
		"state": {
			"aside": [
				{
					"type": "Badge",
					"props": {
						"title": "Badge in region aside"
					}
				}
			]
		}
	},
	{
		"time": "7",
		"state": {
			"aside": [
				{
					"type": "Badge",
					"props": {
						"title": "Badge in region aside"
					}
				}
			],
			"wrapper": [
				{
					"type": "div",
					"props": {
						"className": "test"
					}
				}
			]
		}
	},
	{
		"time": "10",
		"state": {
			"wrapper": [
				{
					"type": "div",
					"props": {
						"className": "test"
					}
				}
			]
		}
	},
	{
		"time": "12",
		"state": {}
	},
	{
		"time": "20",
		"state": {
			"wrapper": [
				{
					"className": "wide"
				}
			]
		}
	},
	{
		"time": "23",
		"state": {}
	}
]
```
