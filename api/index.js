const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path');

const songsFolder = './songs';

/*const songs =
  {
    "title": "Let Me Entertain You",
    "by": "Robbie Williams",
    "lyrics": [
      {
        "rowNumber": 1,
        "text": "Hell is gone and heaven's here There's nothing left for you to fear"
      },
      {
        "rowNumber": 2,
        "text": "Shake your ass, come over here, now scream"
      },
      {
        "rowNumber": 3,
        "text": "I'm a burning effigy of everything I used to be"
      },
      {
        "rowNumber": 4,
        "text": "You're my rock of empathy, my dear"
      },
      {
        "rowNumber": 5,
        "text": "So come on, let me entertain you"
      },
      {
        "rowNumber": 6,
        "text": "Let me entertain you"
      },
      {
        "rowNumber": 7,
        "text": "Life's too short for you to die"
      },
      {
        "rowNumber": 8,
        "text": "So grab yourself an alibi"
      },
      {
        "rowNumber": 9,
        "text": "Heaven knows your mother lied, mon cher"
      },
      {
        "rowNumber": 10,
        "text": "Separate your right from wrongs"
      },
      {
        "rowNumber": 11,
        "text": "Come and sing a different song"
      },
      {
        "rowNumber": 12,
        "text": "The kettle's on, so don't be long, mon cher"
      },
      {
        "rowNumber": 13,
        "text": "So come on, let me entertain you"
      },
      {
        "rowNumber": 14,
        "text": "Let me entertain you"
      },
      {
        "rowNumber": 15,
        "text": "Look me up in the yellow pages"
      },
      {
        "rowNumber": 16,
        "text": "And I will be your rock of ages"
      },
      {
        "rowNumber": 17,
        "text": "You see through fads and your crazy phrases, yeah"
      },
      {
        "rowNumber": 18,
        "text": "Little Bo Peep has lost his sheep"
      },
      {
        "rowNumber": 19,
        "text": "He popped a pill and fell asleep"
      },
      {
        "rowNumber": 20,
        "text": "The dew is wet, but the grass is sweet, my dear"
      },
      {
        "rowNumber": 21,
        "text": "Your mind gets burned with the habits you've learned"
      },
      {
        "rowNumber": 22,
        "text": "But we're the generation that's got to be heard"
      },
      {
        "rowNumber": 23,
        "text": "You're tired of your teachers and your school's a drag"
      },
      {
        "rowNumber": 24,
        "text": "You're not going to end up like your mum and dad"
      },
      {
        "rowNumber": 25,
        "text": "So come on, let me entertain you"
      },
      {
        "rowNumber": 26,
        "text": "Let me entertain you"
      },
      {
        "rowNumber": 27,
        "text": "Let me entertain you"
      },
      {
        "rowNumber": 28,
        "text": "He may be good, he may be out of sight"
      },
      {
        "rowNumber": 29,
        "text": "But he can't be here, so come around tonight"
      },
      {
        "rowNumber": 30,
        "text": "Here is the place where the feeling grows"
      },
      {
        "rowNumber": 31,
        "text": "You gotta get high before you taste the lows"
      },
      {
        "rowNumber": 32,
        "text": "Come on"
      },
      {
        "rowNumber": 33,
        "text": "Let me entertain you"
      },
      {
        "rowNumber": 34,
        "text": "Let me entertain you (let me entertain you)"
      },
      {
        "rowNumber": 35,
        "text": "So come on, let me entertain you (let me entertain you)"
      },
      {
        "rowNumber": 36,
        "text": "Let me entertain you (let me entertain you)"
      },
      {
        "rowNumber": 37,
        "text": "Come on, come on, come on, come on"
      },
      {
        "rowNumber": 38,
        "text": "Come on, come on, come on, come on"
      },
      {
        "rowNumber": 39,
        "text": "Come on, come on, come on, come on"
      },
      {
        "rowNumber": 40,
        "text": "Come on, come on, come on, come on"
      },
      {
        "rowNumber": 41,
        "text": "Come on, come on, come on, come on"
      },
      {
        "rowNumber": 42,
        "text": "Come on, come on, come on, come on"
      },
      {
        "rowNumber": 43,
        "text": "Let me entertain you"
      },
      {
        "rowNumber": 44,
        "text": "Let me entertain you"
      },
      {
        "rowNumber": 45,
        "text": "Let me entertain you"
      },
      {
        "rowNumber": 46,
        "text": "Let me entertain you"
      },
      {
        "rowNumber": 47,
        "text": "Let me entertain you"
      },
      {
        "rowNumber": 48,
        "text": "Let me entertain you"
      },
      {
        "rowNumber": 49,
        "text": "Let me entertain you"
      }
    ]
  }

  */

app.get('/set-list', async (req, res) => {
    try {
      var dataArray = [];   
      console.log("hi");
        try {
          const jsonData = fs.readFileSync("data.json", 'utf-8');
        
          // Parse JSON data into a JavaScript array
          dataArray = JSON.parse(jsonData);
        
          // Log the data array (or use it as needed)
          console.log("kuku" + dataArray);
        } catch (error) {
          console.error('Error reading JSON file:', error);
        }
        //const songStructures = await getSongStructuresFromFolder(songsFolder);
        //console.log("returning "+ songStructures)
        //res.send('Hi there!');
        res.json(dataArray);
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
  }


const port = 3000; 

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});