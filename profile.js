const cheerio = require('cheerio');
const request = require('request');

let regno = process.argv[2];
let pswd = process.argv[3];
//console.log(regno, pswd)

var options1 = {
    'method': 'POST',
    formData: {
        'username-login': regno,
        'password-login': pswd,
        'login-form-button': ''
    }
};

request('https://vitchennaievents.com/conf1/login/', options1,
    (error, response, body) => {
        var cookie = response.headers['set-cookie'];
        cookie[0] = cookie[0].split(';');
        cookie = cookie[0];
        cookie = cookie[0]
        // console.log(cookie);
        var options2 = {
            'method': 'GET',
            'url': 'https://vitchennaievents.com/conf1/profile/',
            headers: {
                'Cookie': cookie
            },
        };
        request(options2, (error, response) => {
            if (error) throw new Error(error);
            var $ = cheerio.load(response.body);
            var msg = $('.error').text()
            //$ ->parsed html
            // console.log(response.statusCode);
            //console.log(response.body);
            var keys = [];
            var val = [];
            var EventName = [];
            var EventId = [];
            var EventVenue = [];
            var temp;
            var info_profile = {};
            var EventDate = []
            var EventTime = []
            Events = []
            $("body > div.card2 > table > tbody > tr > td > p").each((i, ele) => {
                if (i % 2 == 0) {
                    keys.push($(ele).text());
                }
                else {
                    val.push($(ele).text());
                }
            })
            for (let i = 0; i < keys.length; i++) {
                if (i === 0) {
                    info_profile['RegNo'] = val[i];
                }
                if (i === 1) {
                    info_profile['Name'] = val[i];
                }
                if (i === 2) {
                    info_profile['Email'] = val[i];
                }
                if (i === 3) {
                    info_profile['Phone'] = val[i];
                }
                if (i === 4) {
                    info_profile['Institute'] = val[i];
                }
            }
            delete keys;
            delete val;
            //Events
            $('#card > span > table > tbody > tr').each((i, ele) => {
                temp = $(ele).children('td[id="name"]').text().trim().split('    ')[0];
                if (temp) {
                    EventName.push(temp)
                }
                temp = $(ele).children('td').children('p').text().split(' ')[3];
                if (temp) {
                    EventId.push(temp)
                }
                temp = $(ele).children('td[id="value"]').html();
                if (temp) {
                    EventVenue.push(temp)
                }
            });
            $('#card > span > table > tbody > tr:nth-child(2)').each((i, ele) => {
                temp = $(ele).text().trim().split('\n')
                EventDate.push(temp[1].trim())
                EventTime.push(temp[2].trim())
            });
            for (let i = 0; i < EventName.length; i++) {
                temp = {}
                temp['EventName'] = EventName[i];
                temp['EventId'] = EventId[i];
                temp['EventVenue'] = EventVenue[i];
                temp['EventDate'] = EventDate[i];
                temp['EventTime'] = EventTime[i];
                Events.push(temp)
            }
            delete EventName;
            delete EventId;
            delete EventVenue;
            delete EventDate;
            delete EventTime;

            info_profile["Events"] = Events
            console.log(info_profile)
        });

    }
)













