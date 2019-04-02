exports = {

    /**
     * Twitterへの投稿を行う。
     * @param {投稿するメッセージ} message 
     */
    sendTweet: function (message) {

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
            console.log(tweet);
            console.log(response);
        });
    }
};