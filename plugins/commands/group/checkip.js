import axios from 'axios';

const config = {
    "name": "checkip",
    "aliases": ["infoip","ip"],
    "description": "Check ip information",
    "usage": "<ip>",
    "cooldown": 5,
    "permissions": [ 0, 1, 2 ],
    "credits": "WaifuCat",
    "extra": {}
}

async function onCall({ message, args }) {
    const ip = args[0];

    if (!ip) {
        message.send("Please provide IP address for checking.");
        return;
    }

    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}?fields=66846719`);
        const infoip = response.data;

        const infoMessage = `
Continent: ${infoip.continent}
Country: ${infoip.country}
County Code: ${infoip.countryCode}
Region: ${infoip.region}
Region / State: ${infoip.regionName}
City: ${infoip.city}
District: ${infoip.district}
Postal code: ${infoip.zip}
Latitude: ${infoip.lat}
Longitude: ${infoip.lon}
Timezone: ${infoip.timezone}
Organization: ${infoip.org}
Currency: ${infoip.currency}
`;

        message.send(infoMessage);
    } catch (error) {
        console.error("An error occurred while checking IP:", error);
        message.send("An error occurred while checking IP.");
    }
}

export default {
    config,
    onCall
};