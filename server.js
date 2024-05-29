const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path');

const songsFolder = './songs';

app.get('/set-list', async (req, res) => {
    try {
        console.log("hi");
        const songStructures = await getSongStructuresFromFolder(songsFolder);
        console.log("returning "+ songStructures)
        res.json(songStructures);
        console.log("bye");
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
});


io.on('connection', (socket) => {
    // Code to handle socket connections
});


async function getSongStructuresFromFolder(folderPath) {
    const songStructures = [];
    try {
        const files = await fs.promises.readdir(folderPath);
        const processPromises = files.map(file => processFile(path.join(folderPath, file)));
        await Promise.all(processPromises);
        return songStructures;
      } catch (err) {
        console.error(`Error reading directory ${folderPath}: ${err}`);
        return [];
      }


    async function processFile(filePath) {
        try {
          const fileContent = await fs.promises.readFile(filePath, 'utf8');
          songStructures.push(fileContent);
        } catch (err) {
          console.error(`Error reading file ${filePath}: ${err}`);
        }
      }
    



    // function processFile(filePath) {
    //   fs.readFile(filePath, 'utf8', (err, fileContent) => {
    //     if (err) {
    //       console.error(`Error reading file ${filePath}: ${err}`);
    //       return;
    //     }
        
    //     console.log("added content to array: "+songStructures);        
    //   });
    // }
  
    // console.log("going to process files in "+ folderPath);
    // const files = fs.readdirSync(folderPath);
  
    // files.forEach(file => {
    //     console.log("going to process file "+ file);
    //   const filePath = path.join(folderPath, file);
    //   processFile(filePath);
    // });

    // console.log("returning:" + songStructures);  
  }


const port = 3000; 

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});