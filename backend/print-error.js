import fs from 'fs';
const text = fs.readFileSync('error.log', 'utf-16le');
console.log(text);
