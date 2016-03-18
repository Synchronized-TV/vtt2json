### Usage
```
vtt-json.js input (output) (opts)
```

* `input` : a path to a VTT file.
* `output` (optional) : a path to the output JSON file. Will use input filename with .json extension if not provided.
* `opts` :
  * `--plugins` : a comma separated list of plugins. a plugin can either be one of the included plugins, npm modules, or a relative path to a custom plugin. Order of plugins matter. *default value*: `timecodes,regions,text,json,html`

#### Example
```
./bin/vtt-json.js tests/samples/cue.vtt cue.json --plugins=timecodes,regions,json,jsx,./my-custom-plugin
```

### File structure
An input file looks like this :
```
WEBVTT
Region: id=left

00:00:05.000 --> 00:00:12.000 region:left
{
  "message": "Hello !"
}
```

The output object looks like this :
```js
{
  "cues": [
    {
      "region": "left",
      "start": 5,
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
```js
export function headerParser(input) {};
export function cueMetadataParser(input) {};
export function cueBodyParser(input) {};
```

#### An example using all included plugins
```
WEBVTT
Region: id=bottom
Region: id=left

<template>
  <style>
    .title {
      border: 2px solid brown;
    }
  </style>
  <div class="outer">
    <div class="title">
      <content select="title"></content>
    </div>
    <div class="name">
      <content select="name"></content>
    </div>
  </div>
</template>

<style>
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>

00:00:00.000 --> 00:00:10.000 region:left
Hello John !

00:00:10.000 --> 00:00:20.000 region:bottom
<div>
  Hello John !
</div>

00:00:20.000 --> 00:00:30.000 region:bottom
{
  "text": "Hello John !"
}

00:00:30.000 --> 00:00:40.000 region:bottom
<Button type='important'>
  Hello John !
</Button>

00:00:40.000 --> 00:00:50.000 region:bottom
<apply-template id="name-box">
  <div>
    <title>Hello</title>
    <name>John</name>
  </div>
</apply-template>

00:00:50.000 --> 00:00:60.000 region:bottom
<style>
  body {
    transform: rotate(45deg);
  }
  #header {
    animation: pulse 2s;
  }
</style>
```
