//midds
const cheerio = require('cheerio')
const axios = require('axios').default
const { nanoid } = require('nanoid')

const supatips_Model = require('../database/supatips')
const bin_supatips_Model = require('../database/supatips-bin')

module.exports = (bot) => {
    bot.command('clear_supabin', async ctx=> {
        try {
            await bin_supatips_Model.deleteMany()
            await ctx.reply('supabin cleared successfully')
        } catch (err) {
            console.log(err.message)
        }
    })

    bot.command('supatoday', async ctx => {
        try {
            let sup_url = `https://www.supatips.com/`

            let html = await axios.get(sup_url)
            let $ = cheerio.load(html.data)

            let text = ''
            let nanoArr = ''

            let tday_table = $('#exTab2 .tab-content div#2 .widget-table-fixtures table tbody')
            tday_table.each(async(i, el) => {
                let time_data = $('td:nth-child(1)', el).text()
                let time_arr = time_data.split(':')
                let hrs = Number(time_arr[0])
                let min = time_arr[1]
                let time = `${hrs + 2}:${min}`
                
                let siku = new Date().toLocaleDateString('en-GB', {timeZone: 'Africa/Nairobi'})
                let nano = nanoid(4)

                let league = $('td:nth-child(2)', el).text()
                let match = $('td:nth-child(3)', el).text()
                match = match.replace(/ vs /g, ' - ')

                let tip = $('td:nth-child(4)', el).text()
                let matokeo = $('td:nth-child(5)', el).text()
                if(matokeo.length<2) {
                    matokeo = '-:-'
                }

                //create text
                text = text + `⌚ ${time}, ${league}\n<b>⚽ ${match}</b>\n🎯 Tip: <b>${tip} (${matokeo})</b>\n\n`
                if(i == tday_table.length - 1) {
                    nanoArr = nanoArr+ `${nano}`
                } else {
                    nanoArr = nanoArr+ `${nano}+`
                }

                await bin_supatips_Model.create({
                    time, league, match, tip, siku, nano, matokeo
                })
            })
            await ctx.reply(text + `Arrs: ${nanoArr}`, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: 'update as today', callback_data: `update2d_${nanoArr}`}
                        ],
                        [
                            {text: 'update as yesterday', callback_data: `updateyd_${nanoArr}`}
                        ],
                        [
                            {text: 'post afresh', callback_data: `post_${nanoArr}`}
                        ]
                    ]
                }
            })

        } catch (err) {
            await ctx.reply(err.message)
        }
    })
}