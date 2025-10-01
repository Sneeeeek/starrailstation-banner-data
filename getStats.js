const fs = require('fs').promises;
const fsSync = require('fs');
const axios = require('axios');

async function getKey() {
    axios
        .get("https://starrailstation.com/api/v1/datav2/V3.5Live-11434325-7325/1htif2w")
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

// https://starrailstation.com/api/v1/warp_fetch/2004 -> 2085 at the time of writing
async function getBannerData() {
    let bannerDataArray = [];
    let requests = [];

    for (let index = 2003; index <= 2090; index++) {
        requests.push(
            axios.get("https://starrailstation.com/api/v1/warp_fetch/" + index)
            .then(res => bannerDataArray.push(res.data))
            .catch(err => console.log(err))
        );
    }

    requests.push(
        axios.get("https://starrailstation.com/api/v1/warp_fetch/" + 5001)
        .then(res => bannerDataArray.push(res.data))
        .catch(err => console.log(err))
    );

    requests.push(
        axios.get("https://starrailstation.com/api/v1/warp_fetch/" + 5002)
        .then(res => bannerDataArray.push(res.data))
        .catch(err => console.log(err))
    );

    await Promise.all(requests);

    fsSync.writeFileSync('bannerData.json', JSON.stringify(bannerDataArray, null, 2));
    console.log('Banner data written:', bannerDataArray.length, 'items.');
}

async function handleData() {
    const nameArray = {};

    const key = fsSync.readFileSync('key.json');
    const jsonKey = JSON.parse(key); // NOW it's a real array

    Object.values(jsonKey.items).forEach(element => {
        nameArray[element.id] = element.name;
    });

    const bannerData = fsSync.readFileSync('bannerData.json');
    const jsonBannerData = JSON.parse(bannerData); // NOW it's a real array
    await fs.writeFile('finalBannerData.csv', "Name,Users,TotalPulls,Rerun,BannerDay\n", 'utf8');
    await jsonBannerData.forEach(element => {
        appendContent = nameArray[element.stats.rateup] + "," + element.stats.users + "," + element.stats.total_pulls + "," +  (element.stats.rerun ? 1 : 0) + "," + (element.stats.day - 738635) + "\n"
        fs.appendFile('finalBannerData.csv', appendContent, 'utf8');
    });
}

async function run() {
    await getKey();
    await getBannerData();
    await handleData();
}

run();