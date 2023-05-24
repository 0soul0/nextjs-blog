import Layout from '../components/layout';
import { Image, Input, Button, Grid, Card, Row, Text, Col, Spacer, Link, Container } from "@nextui-org/react";
import axios from 'axios';
import fs from 'fs';
import { saveAs } from 'file-saver'
import React, { useState, useRef } from 'react';
import styles from '../styles/Home.module.css';
import path from 'path'
import JSZip from 'jszip'
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
        const zip = new JSZip();
        responses.forEach((e, index) => {
          zip.file(Date.now() + "-" + index + '.png', new Blob([e.data]));
        })
        zip.generateAsync({ type: 'blob' })
          .then((content) => {
            saveAs(content, title + ".zip")
          })
      }))
      .catch(error => {
        // 处理错误
        console.error('Error:', error.message);
      });
  };


  return (
    <Layout>
      <Row gap={1}>
        <Col>
          <Card>
            <Card.Body>
              <div className={styles.text_center}>
                <Link color="secondary" onClick={() => { window.open("https://store.line.me/home/zh-Hant") }}>
                  <Text h1 size={30} color="secondary" >
                    LINE
                  </Text>
                </Link>
              </div>

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

