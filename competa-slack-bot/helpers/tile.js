const fs = require('fs');
const PImage = require('canvas');
const CanvasTextWrapper = require('canvas-text-wrapper').CanvasTextWrapper;

const generateTile = (item) => {
  return new Promise(async (resolve, reject) => {
    PImage.registerFont(__dirname + '/../public/fonts/slab.ttf', {family: 'Slab'});
    PImage.registerFont(__dirname + '/../public/fonts/curly.ttf', {family: 'Curly'});

    const canvas = PImage.createCanvas(400, 400);
    const ctx = canvas.getContext('2d');

    const image = await PImage.loadImage('https://picsum.photos/400/400?blur=3');
    ctx.drawImage(image, 0, 0);
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    CanvasTextWrapper(canvas, item.content, {
      font: '25px Slab',
      textAlign: 'center',
      verticalAlign: 'middle',
      paddingX: 10,
      lineHeight: 1.4
    });

    CanvasTextWrapper(canvas, 'Just Pieter Things', {
      font: '20px Curly',
      textAlign: 'right',
      verticalAlign: 'bottom',
      paddingX: 10,
      paddingY: 10,
    });

    // ctx.fillText(item.quote, 250, 274);
    const out = fs.createWriteStream(__dirname + '/../public/images/' + item._id + '.png');
    const stream = canvas.createPNGStream();
    stream.on('data', (chunk) => {
      out.write(chunk);
    });

    stream.on('end', () => {
      resolve();
    })
  })
};

module.exports = generateTile;
