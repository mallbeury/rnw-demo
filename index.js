const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const querystring = require("querystring");
const { Curl } = require("node-libcurl");
//const terminate = curlTest.close.bind(curlTest);

const curlTest = new Curl();

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
    .get('/api', function(req, res) {

//        var providerServerCauseCode = 'raise-477d';
        var providerServerCauseCode = 'amp-wbrde';
        var credentials = 'matt@trailburning.com:M0r3I5B3tt3r!';
        var hashGameID = 'ky4eaea41L';
        var url = 'https://api.raisenow.com/epayment/api/' + providerServerCauseCode + '/transactions/search?sort[0][field_name]=created&sort[0][order]=desc&displayed_fields=stored_anonymous_donation,stored_customer_firstname,stored_customer_lastname,stored_customer_nickname,stored_customer_additional_message,amount,currency_identifier,last_status&filters[0][field_name]=stored_TBGameID&filters[0][type]=fulltext&filters[0][value]=' +  hashGameID;
        console.info(url);

        curlTest.setOpt(Curl.option.URL, url);
//        curlTest.setOpt(Curl.option.POST, true);
        curlTest.setOpt(Curl.option.USERPWD, credentials);
/*
        curlTest.setOpt(
            Curl.option.POSTFIELDS,
            querystring.stringify({
                name: "section",
                job: "webdev",
            })
        );
*/
        curlTest.on("end", function (statusCode, data, headers) {
            res.json(data);

            this.close();
        });
//        curlTest.on("error", terminate);

        curlTest.perform();


    })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
