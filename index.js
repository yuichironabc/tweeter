'use strict'
const lib = require("./module.js");
const line = require('@line/bot-sdk');

// POSTエンドポイント
const express = require('express');
const app = express();
app.post('/', line.middleware(lib.line_config), (request, main_response) => {

    try {
        console.log("bot関数がアクセスされました。");

        // 認証用の設定
        const signature = lib.generateSignature(request.body);
        const checkHeader = (request.headers || {})['x-line-signature'];

        console.log(signature);
        console.log(checkHeader);
        if (signature === checkHeader) {

            // エラーチェック
            let event = request.body.events[0];
            let message = event.message.text;
            if (message.length > 140) {
                lib.replyToLINE(event, "140文字を超えています。", "140文字を超えています。");
                main_response.status(400).end();
                throw new Error("140文字を超えています。");
            }

            // Twitterへの投稿            
            lib.sendTweet(event, message);
            main_response.status(200).end();
        } else {
            console.log("署名認証エラー");
            throw new Error("署名認証エラー");
        }
    } catch (e) {
        console.log(e);
        main_response.status(500).end();
    }
});

// アクセス待機処理
app.listen(process.env.PORT || 3000, () => {
    console.log('node server is running!');
});