'use strict'
const express = require('express');
const app = express();
const line = require('@line/bot-sdk');
const crypto = require('crypto');
// const client = new line.Client({
//     channelAccessToken: process.env.ACCESSTOKEN
// });

function sendTweet(message) {

    console.log("投稿処理を開始しました。");

    let twitter = require('twitter');
    let twitter_client = new twitter({
        consumer_key: process.env.TWITTER_CONSUMERKEY,
        consumer_secret: process.env.TWITTER_CONSUMERSECRET,
        access_token_key: process.env.TWITTER_ACCESSTOKENKEY,
        access_token_secret: process.env.TWITTER_ACCESSTOKENSECRET,
    });

    console.log(process.env.TWITTER_CONSUMERKEY);
    console.log(process.env.TWITTER_CONSUMERSECRET);
    console.log(process.env.TWITTER_ACCESSTOKENKEY);
    console.log(process.env.TWITTER_ACCESSTOKENSECRET);

    twitter_client.post('statuses/update', {
        status: message
    }, function (error, tweet, response) {

        console.log("Tweet投稿後のポストバック");

        if (error) {
            console.log(error);
            throw error;
        }
        console.log(tweet);
        console.log(response);
    });
}

app.set('port', 5000);
app.post('/callback', function (request, response) {
    console.log("bot関数がアクセスされました。");

    let signature = crypto.createHmac('sha256', process.env.CHANNELSECRET).update(request.body).digest('base64');
    let checkHeader = (request.headers || {})['X-Line-Signature'];
    let body = JSON.parse(request.body);
    console.log("準備が完了しました。" + body.events[0].replyToken);

    if (signature === checkHeader) {
        if (body.events[0].replyToken === '00000000000000000000000000000000') {
            let lambdaResponse = {
                statusCode: 200,
                headers: {
                    "X-Line-Status": "OK"
                },
                body: '{"result": "connect check"}'
            };
            response.succeed(lambdaResponse);

        } else {

            sendTweet(body.events[0].message.text);
            console.log("Tweetを投稿しました。メッセージ➞" + body.events[0].message.text);

            // let text = body.events[0].message.text;
            // const message = {
            //     'type': 'text',
            //     'text': text
            // };
            // client.replyMessage(body.events[0].replyToken, message)
            //     .then((response) => {
            //         let lambdaResponse = {
            //             statusCode: 200,
            //             headers: {
            //                 "X-Line-Status": "OK"
            //             },
            //             body: '{"result": "completed"}'
            //         };
            //         context.succeed(lambdaResponse);
            //     }).catch((err) => console.log(err));
        }
    } else {
        console.log('署名認証エラー');
    }
});

app.listen(app.PORT, function () {
    console.log('node server is running!')
});