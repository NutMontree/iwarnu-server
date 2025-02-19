// const axios = require("axios");
// const { response } = require("express");

// exports.notifyLine = async (token, message) => {
//     try {
//         // code 
//         const response = await axios({
//             method: "POST",
//             url: "https://api.line.me/v2/bot/message/push",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": "LuVp1mV6NLHuAdPxbf3+XlqWBsxtEhLElHYlDjWAwURwKk2XGtjXvkYmevwGX02HqxLceZsEEtbsVDrmbTTeArQcRg9q8RsCopa7niK+DyoAkZl87MfgjV1bVPK3TO/QSbobW/UNW4y8TsSMYpze0QdB04t89/1O/w1cDnyilFU=",
//                 "to": "Cff6e2d23bf3c718620c38c98c3462ba1",
//             },
//             message: "message=" + message,
//         });
//         console.log("notify response", response);
//     } catch (err) {
//         // console.log(err, response);
//         console.log('response', response.err);
//     }
// };



const axios = require('axios');

let data = JSON.stringify({
    "to": "Cff6e2d23bf3c718620c38c98c3462ba1",
});

let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.line.me/v2/bot/message/push',
    headers: {
        'Content-Type': 'application/json',
        "Authorization": "LuVp1mV6NLHuAdPxbf3+XlqWBsxtEhLElHYlDjWAwURwKk2XGtjXvkYmevwGX02HqxLceZsEEtbsVDrmbTTeArQcRg9q8RsCopa7niK+DyoAkZl87MfgjV1bVPK3TO/QSbobW/UNW4y8TsSMYpze0QdB04t89/1O/w1cDnyilFU=",
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
