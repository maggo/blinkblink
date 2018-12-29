# <blink>blinkblink</blink>

Convert GIFs and strings to Blinkenrocket animations with this handy CLI tool!!11

## --help

```
Usage: blinkblink [file|message..]}
Pass an array of either .gif files or strings and set their properties with
--[index].[speed|delay|repeat|direction]

GIFs must be 8x8 pixels, true black (#000000) or 0 alpha means OFF, everything
else ON. Maximum recommended framecount: 255


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
  blinkblink --0.speed=12 --1.repeat=1 "foo" foo.gif "bar" "baz"
```
