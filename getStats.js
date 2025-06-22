const fs = require('fs').promises;
const axios = require("axios");

axios
    .get("https://starrailstation.com/api/v1/datav2/V3.3Live-10472532-e5f5/1htif2w")
    // Show response data
    .then((res) => writeKeyToFile(res.data))
    .catch((err) => console.log(err));

async function writeKeyToFile(data) {
    try {
        const jsonString = JSON.stringify(data, null, 2); // pretty print with indentation
        await fs.writeFile('key.json', jsonString);
        console.log('Key written successfully.');
    } catch (err) {
        console.error('Error writing files:', err);
    }
}



// https://starrailstation.com/api/v1/warp_fetch/2004 -> 2076 at the time of writing
axios
    .get("https://starrailstation.com/api/v1/warp_fetch/2076")
    // Show response data
    .then((res) => writeBannerDataToFile(res.data))
    .catch((err) => console.log(err));

async function writeBannerDataTofile(data) {
    try {
        const jsonString = JSON.stringify(data, null, 2); // pretty print with indentation
        await fs.writeFile('bannerData.json', jsonString);
        console.log('File written successfully.');
    } catch (err) {
        console.error('Error writing files:', err);
    }
}