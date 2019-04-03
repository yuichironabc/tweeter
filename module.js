/**
 * Twitterへの投稿を行う。
 * @param {投稿するメッセージ} message 
 */
module.exports = {

    sendTweet: function (event, message) {

        console.log("投稿処理を開始しました。");

        // Twitterクライアントオブジェクトの作成
        let twitter = require('twitter');
        let twitter_client = new twitter({
            consumer_key: process.env.TWITTER_CONSUMERKEY,
            consumer_secret: process.env.TWITTER_CONSUMERSECRET,
            access_token_key: process.env.TWITTER_ACCESSTOKENKEY,
            access_token_secret: process.env.TWITTER_ACCESSTOKENSECRET,
        });

        // TwitterAPIに対してPOSTリクエストを投げる
        twitter_client.post('statuses/update', {
            status: message
        }, function (error, tweet, response) {

            console.log("Tweet投稿後のポストバック");

            if (error) {
                console.log(error);
                throw error;
            }

            // LINEクライアントオブジェクト
            const line = require('@line/bot-sdk');
            const line_client = new line.Client({
                channelAccessToken: process.env.LINE_ACCESSTOKEN
            });

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

            // console.log(tweet);
            // console.log(response);
        });
    }
};