const fs = require('fs');
const path = require('path');

// Create first directory
const dir1 = String.raw`c:\Users\Bixbie\Documents\event\bl4cksite\app\innovation-lab\submit`;
fs.mkdirSync(dir1, { recursive: true });
console.log('✓ Created: ' + dir1);

// Create second directory
const dir2 = String.raw`c:\Users\Bixbie\Documents\event\bl4cksite\app\build-with-us-DELETE`;
fs.mkdirSync(dir2, { recursive: true });
console.log('✓ Created: ' + dir2);

console.log('All directories created successfully!');
