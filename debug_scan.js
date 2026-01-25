const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const DIR_INHUMAN = 'D:\\contents\\inhuman';
const CSV_TRACKS = path.resolve('..', 'tracks.csv');

console.log('Checking Dir:', DIR_INHUMAN);
if (!fs.existsSync(DIR_INHUMAN)) {
    console.error('Dir NOT found!');
} else {
    const files = fs.readdirSync(DIR_INHUMAN);
    console.log(`Found ${files.length} files in inhuman.`);
    if (files.length > 0) console.log('First file:', files[0]);

    // Check CSV
    const csvContent = fs.readFileSync(CSV_TRACKS, 'utf8');
    const parsed = Papa.parse(csvContent, { header: true });
    const seeds = parsed.data.map(t => t.seed).filter(s => s);
    console.log(`Found ${seeds.length} seeds in CSV.`);

    // Check Match
    let matches = 0;
    for (const seed of seeds) {
        const found = files.find(f => f.includes(seed) && f.endsWith('.mp4'));
        if (found) {
            matches++;
            if (matches === 1) console.log(`Match example: ${seed} -> ${found}`);
        }
    }
    console.log(`Total Matches: ${matches}`);

    // Check specific
    const targetSeed = 'ALB10_T01_SEED11223';
    const targetFound = files.find(f => f.includes(targetSeed));
    console.log(`Specific check for ${targetSeed}: ${targetFound}`);
}
