module.exports = {
    /**
     * Twitterに投稿する。
     * @param {投稿するメッセージ} message 
     */
    sendTweet: (event, message) => {

        console.log("投稿処理を開始しました。");

        // Twitterクライアントオブジェクトの作成
        const twitter = require('twitter');
        const twitter_client = new twitter(module.exports.twitter_config);

        // TwitterAPIに対してPOSTリクエストを投げる
        twitter_client.post('statuses/update', {
            status: message
        }, (error, tweet, response) => {

            console.log("Tweet投稿後のポストバック");
            // エラーチェック
            if (error) {
                console.log(error);
                throw error;
            }
            // エラーが発生していないことが確認できたのでログを出力する。
            console.log("Tweetを投稿しました。");

            // LINEへの返答
            module.exports.replyToLINE(event, "下記のメッセージを投稿しました。\n\n" + message, "TweetをLINEに投稿しました。");
        });
    },

    /**
     * LINEに返答する。
     * @param {投稿メッセージ} massage 
     * @param {投稿成功時のログメッセージ} log_success 
     */
    replyToLINE: (event, message, log_message) => {

        // LINEクライアントオブジェクト
        const line = require('@line/bot-sdk');
        const line_client = new line.Client(module.exports.line_client_config);

        // LINEへの返答
        line_client.replyMessage(event.replyToken, {
            'type': 'text',
            'text': message
        }).then((context) => {
            console.log(log_message);
        }).catch((err) => {
            throw err;
        });
    },

    /**
     * signatureを生成する。
     */
    generateSignature: (body) => {
        const crypto = require('crypto');
        return crypto.createHmac('sha256', process.env.LINE_SECRET)
            .update(Buffer.from(JSON.stringify(body)))
            .digest('base64');
    },

    /**
     * Twitterの情報にアクセスするための設定
     */
    twitter_config: {
        consumer_key: process.env.TWITTER_CONSUMERKEY,
        consumer_secret: process.env.TWITTER_CONSUMERSECRET,
        access_token_key: process.env.TWITTER_ACCESSTOKENKEY,
        access_token_secret: process.env.TWITTER_ACCESSTOKENSECRET,
    },

    /**
     * LINEの情報にアクセスするための設定
     */
    line_config: {
        channelAccessToken: process.env.LINE_ACCESSTOKEN,
        channelSecret: process.env.LINE_SECRET
    },

    /**
     * LINEクライアントを作成するための設定
     */
    line_client_config: {
        channelAccessToken: process.env.LINE_ACCESSTOKEN
    }
};