#!/usr/bin/env node

const Modem = require("./vendor/modem");
const WebAudioApi = require("web-audio-api");
const Speaker = require("speaker");
const getPixels = require("get-pixels");
const { readFileSync } = require("fs");
const gifyParse = require("gify-parse");
const argv = require("yargs")
  .usage(
    "Transform your animated GIFs and strings into Blinkenrocket animations!!!1\n\n" +
      "Usage: $0 [file|message..]} \n" +
      "Pass an array of either .gif files or strings and set their properties with --[index].[speed|delay|repeat|direction]\n\n" +
      "GIFs must be 8x8 pixels, true black (#000000) or 0 alpha means OFF, everything else ON. Maximum recommended framecount: 255\n\n" +
      "!!!!!PLEASE make sure that you have your Blinkenrocket safely connected to the audio jack and your output is set correctly. The volume has to be VERY loud and could blow away your eardrums (and everyone elses) if you play it on speakers!!!!!!1"
  )
  .example(`$0 --0.speed=12 --1.repeat=1 "foo" foo.gif "bar" "baz"`)
  .describe("clear", "Clear the Blinkenrocket storage")
  .describe(
    "[0..].speed",
    "Playback speed of animation \nRange of 0 to 15; Default 8"
  )
  .describe(
    "[0..].delay",
    "Delay of the animation before it starts to play. \nRange of 0 to 7.5; Default 0"
  )
  .describe(
    "[0..].repeat",
    "How many times should the animation repeat before jumping to the next animation? \nRange of 0 to 15; Default 0"
  )
  .describe(
    "[0..].direction",
    "Animation direction (RTL for text) \n0 or 1; Default 0"
  )
  .alias("c", "clear")
  .alias("h", "help")
  .alias("v", "version")
  .check(args => {
    if (!args._.length && !args.clear)
      throw new Error("Please pass some arguments");

    return true;
  }).argv;

const path = require("path");

try {
  const animations = argv.clear
    ? []
    : argv._.map(async (arg, index) => {
        const speed =
          !!argv[index] && argv[index].speed !== undefined
            ? argv[index].speed
            : 8; // 0 - 15
        const delay =
          !!argv[index] && argv[index].delay !== undefined
            ? argv[index].delay
            : 0; // 0-7.5
        const repeat =
          !!argv[index] && argv[index].repeat !== undefined
            ? argv[index].repeat
            : 0; // 0-15
        const direction =
          !!argv[index] && argv[index].direction !== undefined
            ? argv[index].direction
            : 0; // 0|1
        if (arg.endsWith(".gif")) {
          // Gif
          const filePath = path.resolve(__dirname, arg);
          const file = readFileSync(filePath);

          const gifInfo = gifyParse.getInfo(file);
          if (!gifInfo.valid) {
            throw new Error(`GIF file ${filePath} is not valid`);
          }

          if (gifInfo.width > 8 || gifInfo.height > 8) {
            throw new Error(
              `GIF file ${filePath} must not be larger than 8 by 8 pixels`
            );
          }

          return new Promise((resolve, reject) => {
            getPixels(file, "image/gif", (err, pixels) => {
              let data = [];
              for (let frame = 0; frame < pixels.shape[0]; frame++) {
                for (let column = 0; column < 8; column++) {
                  let byte = 0;
                  for (let row = 0; row < 8; row++) {
                    const r = pixels.get(frame, column, row, 0);
                    const g = pixels.get(frame, column, row, 1);
                    const b = pixels.get(frame, column, row, 2);
                    const a = pixels.get(frame, column, row, 3);

                    if (r + g + b !== 0 || a !== 0) {
                      byte |= 1 << (7 - row);
                    }
                  }

                  data = [...data, byte];
                }
              }

              resolve({
                speed,
                delay,
                repeat,
                direction,
                type: "pixel",
                animation: {
                  data: data
                }
              });
            });
          });
        } else {
          // Text
          return {
            speed,
            delay,
            repeat,
            direction,
            type: "text",
            text: `${arg} `
          };
        }
      });

  Promise.all(animations).then(animations => {
    console.log(
      animations.length
        ? animations.reduce((agg, animation, index) => {
            return (
              `${agg}\n#${index}: Type: ${animation.type} Speed: ${
                animation.speed
              } Delay: ${animation.delay} Repeat: ${
                animation.repeat
              } LTR: ${!Boolean(animation.direction)} ` +
              (animation.text ? "Text: " + animation.text : "")
            );
          }, "Parsed animations:") + "\n"
        : "Clearing storage!\n"
    );

    const modem = new Modem(animations);
    const audioData = modem.generateAudio();

    let audioContext = new WebAudioApi.AudioContext({ sampleRate: 48000 });
    audioContext.sampleRate = 48000;

    audioContext.outStream = new Speaker({
      channels: audioContext.format.numberOfChannels,
      bitDepth: audioContext.format.bitDepth,
      sampleRate: audioContext.sampleRate
    });

    let buffer = audioContext.createBuffer(1, audioData.length, 48000);
    buffer.getChannelData(0).set(audioData);

    var source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    source.onended = () => {
      setTimeout(() => {
        console.log("Transmission finished");
        process.exit();
      }, 1000);
    };
    console.log("Starting transmission…");
    source.start(0);
  });
} catch (e) {
  console.error("Transmission error");
  console.error(e.message);
  process.exit(1);
}
