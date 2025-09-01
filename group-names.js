const fs = require('fs');
const { parse } = require('csv-parse/sync');

// Read the CSV
const input = fs.readFileSync('finalBannerData.csv', 'utf8');
const records = parse(input, { columns: true });

// Group names by BannerDay
const bannerGroups = {};
for (const row of records) {
    const key = row.BannerDay;
    if (!bannerGroups[key]) bannerGroups[key] = [];
    bannerGroups[key].push(row.Name);
}

// Prepare output CSV
let output = 'BannerDay,Names\n';
for (const [bannerDay, names] of Object.entries(bannerGroups)) {
    output += `${bannerDay},${names.join(' + ')}\n`;
}

// Write the new CSV
fs.writeFileSync('output.csv', output, 'utf8');

console.log('Done! Check output.csv');