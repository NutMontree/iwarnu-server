
const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User.cjs");
const Report = require("./models/Report.cjs");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

const app = express();

// Line Notify
const { notifyLine } = require('./models/Notify.cjs');
const tokenLine = 'LuVp1mV6NLHuAdPxbf3+XlqWBsxtEhLElHYlDjWAwURwKk2XGtjXvkYmevwGX02HqxLceZsEEtbsVDrmbTTeArQcRg9q8RsCopa7niK+DyoAkZl87MfgjV1bVPK3TO/QSbobW/UNW4y8TsSMYpze0QdB04t89/1O/w1cDnyilFU='
// const { notifyLine } = require('./models/Notify.cjs');
// const tokenLine = '0rCsNHpJ+sX8clcyGapEkKJAFeDdg7QkM2Idl/oGnbbcJeLR1PGmaN/zEg4ihKrEly9KvCC+OQhtbXkrU+daI1UADj6fRs99DxOlpiKgqm/RrWSD9MOfICgU0fenUGDNaRLAjlPS8yD3WGRKDzvR0AdB04t89/1O/w1cDnyilFU='

require("dotenv").config();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Line Notify OA
// const line = require('@line/bot-sdk')
// const axios = require('axios').default
// const dotenv = require('dotenv')
// const env = dotenv.config().parsed

// const lineConfig = {
//   channelAccessToken: env.ACCESS_TOKEN,
//   channelSecret: env.SECRET_TOKEN
// }

// const client = new line.Client(lineConfig);

// app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
//   try {
//     const events = req.body.events
//     console.log('event=>>>>', events)
//     return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send("OK")

//   } catch (err) {
//     res.status(500).end()
//   }
// });

// const handleEvent = async (event) => {
//   if (event.type !== 'message' || event.message.type !== 'text') {
//     return null;
//   }
//   else if (event.type === 'message') {
//     const { data } = await axios.get(`https://${env.RAPID_URL}/words/${event.message.text}/synoyms`, {
//       headers: {
//         'x-rapidapi-host': env.RAPID_URL,
//         'x-rapidapi-key': env.RAPID_KEY
//       }
//     })
//     const { synonyms } = data
//     let str = ''
//     synonyms.forEach((result, i) => {
//       str += synonyms.length - 1 !== i ? `${result}\n` : result
//     })
//     console.log("STR =>>>>>>>>", str)
//     return client.raplyMessage(event.replayToken, { type: 'text', text: str });
//   }
// }

// End Line Notify OA

// const request = require('request-promise');
// const axios = require('axios');

// const token = 'Bearer 0rCsNHpJ+sX8clcyGapEkKJAFeDdg7QkM2Idl/oGnbbcJeLR1PGmaN/zEg4ihKrEly9KvCC+OQhtbXkrU+daI1UADj6fRs99DxOlpiKgqm/RrWSD9MOfICgU0fenUGDNaRLAjlPS8yD3WGRKDzvR0AdB04t89/1O/w1cDnyilFU='

// const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
// const LINE_HEADER = {
//   'Content-Type': 'application/json',
//   'Authorization': token
// };

// const Chatbot = ((request, _response) => {

//   let event = request.body.events[0]
//   let message = event.message.text

//   // https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects

//   if (event.type === "message") {
//     switch (event.message.type) {
//       case 'text':
//         if (message === 'สวัสดี') {
//           replyText(request);
//         } else if (message === 'ข่าว') {
//           NewPost(request);
//         }
//         break;
//       default:
//         break;
//     }
//   }
// });

// const replyText = request => {
//   return axios({
//     method: 'post',
//     url: `${LINE_MESSAGING_API}/reply`,
//     headers: LINE_HEADER,
//     data: JSON.stringify({
//       replyToken: request.body.events[0].replyToken,
//       messages: [{
//         type: "text",
//         text: request.body.events[0].message.text
//       }]
//     })
//   });
// };


// const NewPost = res => {
//   return request({
//     method: `GET`,
//     uri: `924b9e34870fa7dba35b689861d70be6`,
//     json: true
//   }).then((response) => {
//     const message = JSON.stringify(response.data[0])
//     return push(res, message);
//   }).catch((error) => {
//     return res.status(500).send(error);
//   });
// }

// const push = (res, msg) => {
//   return axios({
//     method: 'post',
//     url: `${LINE_MESSAGING_API}/reply`,
//     headers: LINE_HEADER,
//     data: JSON.stringify({
//       replyToken: res.body.events[0].replyToken,
//       messages: [{
//         type: "text",
//         text: msg
//       }]
//     })
//   });
// }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

app.get("/test", (_req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json("test ok");
  console.log("connect database")
});

app.post("/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, email, password, number, phone, agency } = req.body;
  const userDoc = await User.findOne();
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      number,
      phone,
      agency,
    });
    res.json(userDoc);
  } catch (e) {
    res.status(404).json(e);
  }
});

app.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found");
  };
  // notify
  const axios = require('axios');
  let data = JSON.stringify({
    "to": "Cff6e2d23bf3c718620c38c98c3462ba1",
    "messages": [
      {
        "type": "text",
        "text": 'User' + ' ' + userDoc.email + ' ' + 'Login'
      }
    ]
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.line.me/v2/bot/message/push',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer LuVp1mV6NLHuAdPxbf3+XlqWBsxtEhLElHYlDjWAwURwKk2XGtjXvkYmevwGX02HqxLceZsEEtbsVDrmbTTeArQcRg9q8RsCopa7niK+DyoAkZl87MfgjV1bVPK3TO/QSbobW/UNW4y8TsSMYpze0QdB04t89/1O/w1cDnyilFU=",
    },
    data: data
  };

  axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });


  // const text = 'User' + ' ' + userDoc.email + ' ' + 'Login'
  // await notifyLine(tokenLine, text)
});

app.get("/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { _id, name, email, number, phone, agency } = await User.findById(
        userData.id
      );
      res.json({ _id, name, email, number, phone, agency });
    });
  } else {
    res.json(null);
  }

});

app.post("/logout", (_req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/reports", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id, title, phone, date, time, address, description, district, amphoe, province, zipcode } = req.body;
  try {
    const reportDoc = await Report.create({
      id, title, phone, date, time, address, description, district, amphoe, province, zipcode
    });
    // notify
    const text = 'มีข้อความเข้าใหม่ ' + ', ' + ' ' + 'เรื่องที่ร้องเรียน :' + ' ' + reportDoc.title + ', ' + ' ' + 'เบอร์โทรศัพท์ผู้ร้องเรียน :' + ' ' + reportDoc.phone + ', ' + ' ' + 'วันที่เกิดเหตุ :' + ' ' + reportDoc.date + ', ' + ' ' + 'เวลาที่เกิดเหตุ :' + ' ' + reportDoc.time + ', ' + ' ' + 'ตำบล / แขวง :' + ' ' + reportDoc.district + ', ' + ' ' + 'จังหวัด :' + ' ' + reportDoc.province + ', ' + ' ' + 'รหัสไปรษณีย์ :' + ' ' + reportDoc.zipcode + ', ' + ' ' + 'คำอธิบาย :' + ' ' + reportDoc.description + ' '
    await notifyLine(tokenLine, text)
    res.json(reportDoc);
  } catch (e) {
    res.status(404).json;
  };
});

app.get("/reports", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (_err, _reportData) => {
    res.json(await Report.find({}));
    console.log()
  });
});

app.get("/reports/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Report.findById(id));
});

app.put("/reports", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const { id, title, phone, date, time, address, description, district, amphoe, province, zipcode } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, reportData) => {
    if (err) throw err;
    const reportDoc = await Report.findById(id);
    if (reportData.id === reportDoc.owner.toString()) {
      reportDoc.set({
        id,
        title,
        phone,
        date,
        time,
        address,
        description,
        district,
        amphoe,
        province,
        zipcode,
      });
      await reportDoc.save();
      res.json("ok");
    }
  });
});

app.delete("/reports/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params.id;
  const data = await Report.deleteOne({ id });
  res.send({ success: true, message: "ระบบทำการลบข้อมูลเรียบร้อยแล้ว", data: data })
});

app.get("/reports", async (_req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Report.find());
});

app.listen(4000, () => {
  console.log('listening on 4000')
});