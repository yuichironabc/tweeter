function sendTweet(message) {

    let TWITTER_CONSUMERKEY = "tNEsCMNsHiE3ho6jC4p5odIaf";
    let TWITTER_CONSUMERSECRET = "o5qOVU4siyH25mg7szpimrs84lfVLoWSZTqhEPNXI1JIAzFJ6k";
    let TWITTER_ACCESSTOKENKEY = "1078876364634185728-THKhAwEUvai6tPAE43x52zEP14VdTx";
    let TWITTER_ACCESSTOKENSECRET = "U1salgbYPmkfeyoHWVKS0gx13GQlI4bruwx8OixsljfqY";

    let twitter = require('twitter');
    var client = new twitter({
        // consumer_key: process.env.TWITTER_CONSUMERKEY,
        // consumer_secret: process.env.TWITTER_CONSUMERSECRET,
        // access_token_key: process.env.TWITTER_ACCESSTOKENKEY,
        // access_token_key: process.env.TWITTER_ACCESSTOKENSECRET,

        consumer_key: TWITTER_CONSUMERKEY,
        consumer_secret: TWITTER_CONSUMERSECRET,
        access_token_key: TWITTER_ACCESSTOKENKEY,
        access_token_secret: TWITTER_ACCESSTOKENSECRET,
    });

    // console.log(process.env.TWITTER_CONSUMERKEY);
    // console.log(process.env.TWITTER_CONSUMERSECRET);
    // console.log(process.env.TWITTER_ACCESSTOKENKEY);
    // console.log(process.env.TWITTER_ACCESSTOKENSECRET);

    // let params = {
    //     screen_name: 'Twitter',
    //     count: 10,
    //     include_rts: false,
    //     exclude_replies: true
    // };

    // client.get('statuses/user_timeline', params, function (error, tweets, response) {

    //     console.log("Tweet投稿後のポストバック");

    //     if (error) {
    //         console.log(error);
    //         throw error;
    //     }
    //     console.log(tweets);
    //     console.log(response);
    // });

    client.post('statuses/update', {
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

sendTweet("Apiテスト");