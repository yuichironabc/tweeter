'use strict'
const module = require("./module.js");
const line = require('@line/bot-sdk');

// POSTエンドポイント
const express = require('express');
const app = express();
app.post('/', line.middleware(module.line_config), (request, main_response) => {

    try {
        console.log("bot関数がアクセスされました。");

        // 認証用の設定
        const signature = module.generateSignature(request.body);
        const checkHeader = (request.headers || {})['x-line-signature'];

        console.log(signature);
        console.log(checkHeader);
        if (signature === checkHeader) {

            let event = request.body.events[0];
            // if (event.replyToken === '00000000000000000000000000000000') {

            //     main_response.succeed({
            //         statusCode: 200,
            //         headers: {
            //             "X-Line-Status": "OK"
            //         },
            //         body: '{"result": "connect check"}'
            //     });
            //     main_response.status(200).end();
            // } else {

            // エラーチェック
            let message = event.message.text;
            if (message.length > 140) {
                module.replyToLINE(event, "140文字を超えています。", "140文字を超えています。");
                main_response.status(400).end();
                throw new Error("140文字を超えています。");
            }

            // Twitterへの投稿            
            module.sendTweet(event, message);
            main_response.status(200).end();
            // }
        } else {
            console.log("署名認証エラー");
            throw new Error("署名認証エラー");
        }

    } catch (e) {
        console.log(e);
        main_response.status(500).end();
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('node server is running!');
});