const fs = require('fs').promises;
const fsSync = require('fs');
const axios = require("axios");

function getKey() {
    axios
        .get("https://starrailstation.com/api/v1/datav2/V3.3Live-10472532-e5f5/1htif2w")
        // Show response data
        .then((res) => writeKeyToFile(res.data))
        .catch((err) => console.log(err));
}

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
async function getBannerData() {
    let bannerDataArray = [];
    let requests = [];

    for (let index = 2004; index <= 2076; index++) {
        requests.push(
            axios.get("https://starrailstation.com/api/v1/warp_fetch/" + index)
            .then(res => bannerDataArray.push(res.data))
            .catch(err => console.log(err))
        );
    }

    await Promise.all(requests);

    fsSync.writeFileSync('bannerData.json', JSON.stringify(bannerDataArray, null, 2));
    console.log('Banner data written:', bannerDataArray.length, 'items.');
}

// getKey();
// getBannerData();
handleData();

function handleData() {
    const data = fsSync.readFileSync('bannerData.json');
    const json = JSON.parse(data); // NOW it's a real array
    json.forEach(element => {
        console.log("cID: " + element.stats.rateup + " Users: " + element.stats.users);
    });
}