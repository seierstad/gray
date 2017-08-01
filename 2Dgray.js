const fs = require('fs');
const PNGlib = require('node-pnglib');

const SIZE = 16;
const DIGITS = Math.ceil(Math.log2(Math.pow(SIZE, 2)));

console.info(DIGITS, " bits");

let gray = [""];

const oddReducer = (acc, value) => [
    ...acc,
    (acc.length + 1 >> 1 & 1) + "" + value,
    (acc.length + 2 >> 1 & 1) + "" + value
];

for (let d = 1; d <= DIGITS; d += 1) {

    if (d % 2 === 0) {
        const rowLength = Math.sqrt(1 << d);
        const rowCount = (1 << d - 1) / rowLength;

        const doubled = [];

        for (let i = 0; i < rowCount; i += 1) {
            let row = gray.slice(i * rowLength, (i + 1) * rowLength);
            doubled.push(...row);
            doubled.push(...row);
        }

        gray = doubled.map((value, index) => ["0", "1", "1", "0"][((index / rowLength) >> 0) % 4] + "" + value);

    } else {
        gray = gray.reduce(oddReducer, []);
    }
}

let png = new PNGlib(SIZE, SIZE, (SIZE * SIZE) + 1);

for (let row = 0; row < SIZE; row += 1) {
    gray.slice(row * SIZE, (row + 1) * SIZE).map((value, index) => {
        const hex = parseInt(value, 2).toString(16);
        const hex2digits = (hex.length === 2) ? hex : "0" + "" + hex;
        const color = "#" + hex2digits + hex2digits + hex2digits;

        png.setPixel(row, index, color);
        console.log(hex, color);
    });

}

fs.writeFileSync('./block.png', png.getBuffer());

