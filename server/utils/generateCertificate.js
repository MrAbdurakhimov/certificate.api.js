const sharp = require('sharp');
const Certificate = require('../models/Certificate.model');
const generateQR = require('./generateQR');

const generateCertificate = async ({ name, field }) => {
  try {
    const certificate = new Certificate({
      name: name,
      field: field,
    });
    const width = 2000;
    const height = 1414;
    const svgImage = `
        <svg width="${width}" height="${height}">
          <style>
          .name { fill: #001; font-size: 72px; font-weight: 600; text-anchor: middle;
            dominant-baseline: middle; }
          .field { fill: #001; font-size: 32px; font-weight: 600; text-anchor: middle;
            dominant-baseline: middle;}
          </style>
          <text x="50%" y="790" text-anchor="start" class="name">${name}</text>
          <text x="50%" y="960" text-anchor="start" class="field">${field}</text>
        </svg>
        `;
    const svgBuffer = Buffer.from(svgImage);
    const qrBuffer = await generateQR(
      `${process.env.BASE_URL + '/certificates/' + certificate._id + '.png'}`,
      { width: 200, height: 200 }
    );
    const image = await sharp(
      './public/templates/certificate_01.png'
    ).composite([
      {
        input: svgBuffer,
        top: 0,
        left: 0,
      },
      {
        input: qrBuffer,
        top: 1214,
        left: 0,
      },
    ]);

    await image.toFile('./public/certificates/' + certificate._id + '.png');
    certificate.image = `${process.env.BASE_URL}/certificates/${certificate._id}.png`;
    await certificate.save();
    return certificate;
  } catch (error) {
    console.log(error);
  }
};

module.exports = generateCertificate;
