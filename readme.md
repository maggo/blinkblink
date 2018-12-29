# <blink>blinkblink</blink>

Convert GIFs and strings to [Blinkenrocket](http://blinkenrocket.de) animations with this handy CLI tool!!11

## Install

```
$ npm -g install @maggo/blinkblink
$ # OR
$ yarn global add @maggo/blinkblink
```

## --help

```
Usage: index.js [file|message..]}
Pass an array of either .gif files or strings and set their properties with
--[index].[speed|delay|repeat|direction]

GIFs must be 8x8 pixels, true black (#000000) or 0 alpha means OFF, everything
else ON. Maximum recommended framecount: 255

!!!!!PLEASE make sure that you have your Blinkenrocket safely connected to the
audio jack and your output is set correctly. The volume has to be VERY loud and
could blow away your eardrums (and everyone elses) if you play it on
speakers!!!!!!1

Options:
  --[0..].speed      Playback speed of animation
                     Range of 0 to 15; Default 8
  --[0..].delay      Delay of the animation before it starts to play.
                     Range of 0 to 7.5; Default 0
  --[0..].repeat     How many times should the animation repeat before jumping
                     to the next animation?
                     Range of 0 to 15; Default 0
  --[0..].direction  Animation direction (RTL for text)
                     0 or 1; Default 0
  -c, --clear        Clear the Blinkenrocket storage
  -h, --help         Show help                                         [boolean]
  -v, --version      Show version number                               [boolean]

Examples:
  index.js --0.speed=12 --1.repeat=1 "foo" foo.gif "bar" "baz"
```
