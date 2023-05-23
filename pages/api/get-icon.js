import axios from 'axios';
import jssoup from 'jssoup';
export default async function handler(req, res) {
    if (req.method !== 'POST') return
    const { url } = req.body
    const response = await axios.get(url);
    const soup = new jssoup(response.data)
    const str = soup.findAll('div', 'FnImage')
    const icon = []
    str.map((it) => icon.push({ iconURL: it.find("span").attrs.style.substring(21, it.find("span").attrs.style.length - 2) }))
    const title = soup.find("p", "mdCMN38Item01Ttl").text
    res.status(200).json({ data: icon, name: title });
}

