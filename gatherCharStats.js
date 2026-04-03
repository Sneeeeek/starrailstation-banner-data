// install first: npm i csv-parse csv-stringify
// this is vibe coded btw i got lazy

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");

const nameToExtract = "Yao Guang"; // change this
const startDate = "2026-03-01";  // change this (YYYY-MM-DD)
const maxMissingFiles = 5;

function nextDateStr(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(Date.UTC(year, month - 1, day + 1));
    return d.toISOString().slice(0, 10);
}

function filenameForDate(dateStr) {
    return `finalBannerData${dateStr}.csv`;
}

let date = startDate;
let missingCount = 0;
let allRows = [];
let headerSet = false;
const outputColumns = ["Date", "Name", "Users", "TotalPulls", "Rerun", "BannerDay"];

// stop after maxMissingFiles consecutive missing dates
while (missingCount < maxMissingFiles) {
    const filePath = path.join(__dirname, filenameForDate(date));
    console.log(filePath);

    if (!fs.existsSync(filePath)) {
        missingCount++;
        date = nextDateStr(date);
        continue;
    }

    missingCount = 0; // reset if we successfully found a file

    const content = fs.readFileSync(filePath, "utf8");
    const records = parse(content, { columns: true, skip_empty_lines: true });

    const filtered = records.filter(r => r.Name && r.Name.trim() === nameToExtract);

    if (filtered.length > 0) {
        if (!headerSet) {
            allRows.push(outputColumns);
            headerSet = true;
        }
        filtered.forEach(r => {
            allRows.push([
                date,
                r.Name,
                r.Users,
                r.TotalPulls,
                r.Rerun,
                r.BannerDay
            ]);
        });
    }

    date = nextDateStr(date);
}

if (allRows.length > 0) {
    const out = stringify(allRows);
    const outName = `${ nameToExtract }_extracted.csv`;
    fs.writeFileSync(outName, out, "utf8");
    console.log("Wrote", outName);
} else {
    console.log("No rows found for", nameToExtract);
}