import Layout from '../components/layout';
import { Image, Input, Button, Grid, Card, Row, Text, Col, Spacer } from "@nextui-org/react";
import axios from 'axios';
import fs from 'fs';
import React, { useState, useRef } from 'react';
import styles from '../styles/Home.module.css';
// npm run dev
// "build": "next build",
export default function Home() {
  const [iconData, setIcon] = useState([]);
  const [title, setTitle] = useState("");
  const [inputUrl, setInputUrl] = useState([]);

  const fetchData = async () => {
    axios({
      method: 'post',
      url: '/api/get-icon',
      //API要求的資料
      data: {
        url: inputUrl
      }
    }).then(response => {
      console.log(response.data)
      setIcon(response.data.data)
      setTitle(response.data.name)
    })
      .catch(error => {
        setIcon([])
      });
  };


  const saveImage = async (iconData, title) => {

    const requests = iconData.map(url => axios({
      url: url.iconURL,
      method: 'GET',
      responseType: 'blob'
    }));

    axios.all(requests)
      .then(axios.spread((...responses) => {
        responses.forEach((e, index) => {
          setTimeout(() => {
            console.log(index)
            const url = window.URL.createObjectURL(new Blob([e.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', index + ".png");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            if (index == responses.length - 1) {
              alert("download finish!")
            }
          }, 200 * index)
        })
      }))
      .catch(error => {
        // 处理错误
        console.error('Error:', error.message);
      });

    // axios({
    //   url: iconData[0].iconURL,
    //   method: 'GET',
    //   responseType: 'blob',
    // })
    //   .then(response => {
    //     const url = window.URL.createObjectURL(new Blob([response.data]));
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', "myImage.png");
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //   })
    //   .catch(error => {
    //     console.error('Error downloading image:', error.message);
    //   });

    // const link = document.createElement('a');
    // link.href = iconData[0].iconURL;
    // link.download = "myImage.png";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    // axios({
    //   method: 'post',
    //   url: '/api/save-icon',
    //   //API要求的資料
    //   data: {
    //     iconData: iconData,
    //     title: title
    //   }
    // }).then(response => {
    //   var data = JSON.parse(response.data)
    //   console.log(data)

    //   // const folderName = title;
    //   // try {
    //   //   if (!fs.existsSync(folderName)) {
    //   //     fs.mkdirSync(folderName);
    //   //   }
    //   // } catch (err) {
    //   //   console.error(err);
    //   // }
    //   // data.forEach((e, index) => {
    //   //   e.data.pipe(fs.createWriteStream(folderName + "/" + index + ".png"))
    //   // })
    //   alert("save success!")
    // })
    //   .catch(error => {

    //   });
  };


  return (
    <Layout>
      <Row gap={1}>
        <Col>
          <Card >
            <Card.Body>
              <Input clearable bordered placeholder="Input URL" aria-label='Input URL' value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} />
              <Spacer y={1} />
              <Button color="success" auto onPress={fetchData} >
                Search
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Spacer y={1} />
      <Row gap={1}>
        <Col>
          <Card>
            <Card.Body>
              <Grid.Container gap={1} justify="center">
                <Grid xs={12}>
                  <Text h1 size={20}>
                    {title}
                  </Text>
                </Grid>
                {iconData && (iconData.map((it) =>
                  <Grid key={it.iconURL} xs={3}>
                    <Image
                      src={it.iconURL}
                      alt="Default Image"
                      objectFit="fill" /></Grid>))}
                <Grid key="download">
                  <Button color="success" onPress={() => saveImage(iconData, title)} >
                    Download
                  </Button>
                </Grid>
              </Grid.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Layout>
  );
}

