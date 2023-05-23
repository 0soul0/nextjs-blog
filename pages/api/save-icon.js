import axios from 'axios';
import fs from 'fs';
export default async function handler(req, res) {
    if (req.method !== 'POST') return
    const { iconData, title } = req.body
    const folderName = title;
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
    } catch (err) {
        console.error(err);
    }

    iconData.forEach((e, index) => {

        axios({
            url: e.iconURL,
            responseType: 'stream'
        }).then(response => {
            response.data.pipe(fs.createWriteStream(folderName + "/" + index + ".png"))
        })
        // res.status(200).json({ data: iconData[0].iconURL });
    })
}

