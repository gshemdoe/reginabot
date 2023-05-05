const tg_slips = require('../database/tg_slips')
const mkekaMega = require('../database/mkeka-mega')

const sendMkeka1 = async (ctx, delay, bot, imp) => {
    try {
        let td = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let mk = await tg_slips.findOne({ siku: td, brand: 'gsb' })
        if (mk) {
            await ctx.sendChatAction('upload_photo')
            await delay(1000)
            await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, mk.mid)
        } else {
            await ctx.sendChatAction('typing')
            await delay(2000)
            await ctx.reply('Mkeka namba 1 bado haujaandaliwa, jaribu mkeka namba 3 /mkeka3')
        }
    } catch (error) {
        console.log(error.message)
    }
}

const sendMkeka2 = async (ctx, delay, bot, imp) => {
    try {
        let td = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let mk = await tg_slips.findOne({ siku: td, brand: 'betway' })
        if (mk) {
            await ctx.sendChatAction('upload_photo')
            await delay(1000)
            await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, mk.mid)
        } else {
            await ctx.sendChatAction('typing')
            await delay(2000)
            await ctx.reply('Mkeka namba 2 bado haujaandaliwa, jaribu mkeka namba 3 /mkeka3')
        }
    } catch (error) {
        console.log(error.message)
    }
}

const sendMkeka3 = async (ctx, delay, bot, imp) => {
    try {
        await ctx.sendChatAction('typing')
        await delay(1000)
        let nairobi = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })
        let keka = await mkekaMega.find({ date: nairobi })
        let txt = `<b><u>🔥 Mkeka wa Leo [ ${nairobi} ]</u></b>\n\n\n`
        let odds = 1
        if (keka.length > 0) {
            for (let m of keka) {
                //changing parimatch options
                if (m.bet == 'Goal. From 1 to 15 minute: (NO)') {
                    txt = txt + `<u><i>${m.date},  ${m.time}</i></u>\n⚽️ ${m.match}\n<b>✅ First 10 minutes 1X2: (X)</b>\n<i>💰 Odds: 1.15</i> \n\n\n`
                    odds = (odds * 1.15).toFixed(2)
                } else {
                    txt = txt + `<u><i>${m.date},  ${m.time}</i></u>\n⚽️ ${m.match}\n<b>✅ ${m.bet}</b>\n<i>💰 Odds: ${m.odds}</i> \n\n\n`
                    odds = (odds * m.odds).toFixed(2)
                }
            }

            let gsb = 'https://track.africabetpartners.com/visit/?bta=35468&nci=5439'
            let pm = `https://pmaff.com/?serial=61291818&creative_id=304&anid=telegram&pid=telegram`
            let tenbet = `https://go.aff.10betafrica.com/ys6tiwg4?utm_source=telegram`
            let ke = `https://www.betway.co.ke/?btag=P94949-PR24943-CM78241-TS1971458&`
            let ug = `https://track.africabetpartners.com/visit/?bta=35468&nci=5740`

            let finaText = txt + `<b>🔥 Total Odds: ${odds}</b>\n\n▬▬▬▬▬▬▬▬▬▬▬▬\n\nMkeka huu umeandaliwa 10Bet\n\n<i>» Ofa ya 150% mara tatu mfululizo kila ukideposit\n» Bet Jackpot ya mechi 4\n» Rudishiwa nusu ya dau lako iwapo mechi moja itachana.</i> \n\nKama bado huna account,\n\n<b>✓ Jisajili Hapa \n\n👤 (Tanzania 🇹🇿)</b>\n<a href="${tenbet}">https://10bet.co.tz/register\nhttps://10bet.co.tz/register</a>\n▬\n<b>👤 (Kenya 🇰🇪)</b>\n<a href="${ke}">https://betway.co.ke/register</a>\n▬\n<b>👤 (Uganda 🇺🇬)</b>\n<a href="${ug}">https://gsb.ug/register</a>`

            await ctx.reply(finaText, { parse_mode: 'HTML', disable_web_page_preview: true })
        } else {
            await ctx.sendChatAction('typing')
            setTimeout(() => {
                ctx.reply('Mkeka wa leo bado sijauandaa... ndo niko kwenye maandalizi hadi baadae kidogo utakuwa tayari.')
                    .catch(e => console.log(e.message))
            }, 1000)
        }
    } catch (error) {
        console.log(error.message)
    }
}

const supatips = async (ctx, bot, delay, imp) => {
    try {
        let url = `http://mikekayauhakika.com`
        await bot.telegram.copyMessage(ctx.chat.id, imp.mikekaDB, 255, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '⭐⭐⭐ Fungua SupaTips ⭐⭐⭐', url }
                    ]
                ]
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    sendMkeka1, sendMkeka2, sendMkeka3, supatips
}