'use strict'
const line = require('@line/bot-sdk');
const crypto = require('crypto');

// LINEの情報にアクセスするための設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESSTOKEN,
    channelSecret: process.env.LINE_SECRET
};

// POSTエンドポイント
const express = require('express');
const app = express();
app.post('/', line.middleware(line_config), function (request, response) {

    console.log("bot関数がアクセスされました。");
    let signature = crypto.createHmac('sha256', process.env.LINE_SECRET).update(JSON.stringify(request.body)).digest('base64');
    let checkHeader = (request.headers || {})['X-Line-Signature'];
    if (signature === checkHeader) {

        let event = request.body.events[0];
        if (event.replyToken === '00000000000000000000000000000000') {

            response.succeed({
                statusCode: 200,
                headers: {
                    "X-Line-Status": "OK"
                },
                body: '{"result": "connect check"}'
            });
            response.status(200).end();
        } else {

            // LINEクライアントオブジェクト
            const line_client = new line.Client({
                channelAccessToken: process.env.LINE_ACCESSTOKEN
            });

            let message = event.message.text;
            // エラーチェック
            if (message.length > 140) {

                line_client.replyMessage(event.replyToken, {
                    'type': 'text',
                    'text': '140文字を超えています。'
                }).then((context) => {
                    response.status(400).end();

                }).catch((err) => console.log(err));

                console.log("140文字を超えています。");
                return;
            }

            // Twitterへの投稿
            const module = require("./module.js");
            module.sendTweet(message);
            console.log("Tweetを投稿しました。");

            // LINEへの返答
            line_client.replyMessage(event.replyToken, {
                'type': 'text',
                'text': '下記のメッセージを投稿しました。\n\n' + message
            }).then((context) => {
                // let lambdaResponse = {
                //     statusCode: 200,
                //     headers: {
                //         "X-Line-Status": "OK"
                //     },
                //     body: '{"result": "completed"}'
                // };
                // context.succeed(lambdaResponse);

                console.log("TweetをLINEに投稿しました。")
                response.status(200).end();

            }).catch((err) => console.log(err));
        }
    } else {
        console.log('署名認証エラー');
    }
});

app.listen(process.env.PORT || 3000, function () {
    console.log('node server is running!');
});