### Usage
```
vtt-json.js input (output) (opts)
```

* `input` : a path to a VTT file.
* `output` (optional) : a path to the output JSON file. Will use input filename with .json extension if not provided.
* `opts` :
	* `--plugins` : a comma separated list of plugins. a plugin can either be one of the default plugins, npm modules, or a relative path to a custom plugin. *default value*: `timecodes,regions,text,json,html`

#### Example
```
./bin/vtt-json.js tests/samples/cue.vtt cue.json --plugins=timecodes,regions,json,jsx,./my-custom-plugin
```

### File structure
An input file looks like this :
```js
WEBVTT
Region: id=left

00:00:05.123 --> 00:00:12.000 region:left
{
  "message": "Hello !"
}
```

The output object looks like this :
```
{
  "cues": [
    {
      "region": "left",
      "start": 5.123,
      "end": 12,
      "json": {
        "message": "Hello !"
      }
    },
    //...
  ],
  "regions": [
    "left"
  ]
}
```

### Plugins
Each plugin can parse the vtt header, the cue metadata, the cue body, and returns corresponding objects. The output is a merged object of what plugins return, at either the root level for headers, or in cue objects for cues.

For example, the `timecodes` plugin parses the cue metadata timecode :
`00:00:05.123 --> 00:00:12.000`

And returns the following values that will be added to the cue object : 
`{ "start": 5.123, "end": 12 }`

Only one plugin can parse the cue body. The first plugin that successfully parses the content is used.

#### Included plugins
* `timecodes`
* `regions`
* `json`
* `html`
* `jsx`
* `style`
* `text`
* `templates`

#### Plugin API
```
export function headerParser(input) {};
export function cueMetadataParser(input) {};
export function cueBodyParser(input) {};
```
