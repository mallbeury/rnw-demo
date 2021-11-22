const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Curl } = require("node-libcurl");

// use .env for dev use
if (process.env.NODE_ENV != "staging" && process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', function(req, res) {
      var myVar = 99;
      res.render('pages/index', { rnwAPIKey : process.env.RAISENOW_API_KEY });
    })
    .get('/api', function(req, res) {
        var curlTest = new Curl();

        // filter to show successful transactions and with a stored_custom_data matching 123456
//        var url = 'https://api.raisenow.com/epayment/api/' + process.env.RAISENOW_API_ID + '/transactions/search?&filters[0][field_name]=last_status&displayed_fields=stored_custom_data,stored_customer_firstname,stored_customer_lastname,stored_customer_nickname,stored_customer_message,stored_tip_amount,amount,currency_identifier,last_status&filters[0][type]=fulltext&filters[0][value]=final_success&filters[1][field_name]=stored_custom_data&filters[1][type]=fulltext&filters[1][value]=123456';
        // filter to show successful transactions
        var url = 'https://api.raisenow.com/epayment/api/' + process.env.RAISENOW_API_ID + '/transactions/search?&filters[0][field_name]=last_status&displayed_fields=stored_custom_data,stored_customer_firstname,stored_customer_lastname,stored_customer_nickname,stored_customer_message,stored_tip_amount,amount,currency_identifier,last_status&filters[0][type]=fulltext&filters[0][value]=final_success';

        curlTest.setOpt(Curl.option.URL, url);
        curlTest.setOpt(Curl.option.SSLVERSION, 1);
        curlTest.setOpt(Curl.option.USERPWD, process.env.RAISENOW_USERNAME + ':' + process.env.RAISENOW_PASSWORD);

        curlTest.on("end", function (statusCode, data, headers) {
            res.json(JSON.parse(data));
            this.close();
        });
        curlTest.perform();
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
