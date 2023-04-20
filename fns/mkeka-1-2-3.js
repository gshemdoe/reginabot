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
                txt = txt + `<i>🕔 ${m.date},  ${m.time}</i>\n⚽️ ${m.match}\n<b>✅ ${m.bet.replace(/team/g, '').replace(/1 - /g, '1-').replace(/2 - /g, '2-')}</b> <i>@${m.odds}</i> \n\n\n`
                odds = (odds * m.odds).toFixed(2)
            }

            let gsb = 'https://track.africabetpartners.com/visit/?bta=35468&nci=5439'
            let ke = `https://go.aff.10betafrica.com/m2iyvtvv`
            let ug = `https://track.africabetpartners.com/visit/?bta=35468&nci=5740`

            let finaText = txt + `<b>🔥 Total Odds: ${odds}</b>\n\n▬▬▬▬▬▬▬▬▬▬▬▬\n\nOption hizi zinapatikana Gal Sport Betting, kama bado huna account,\n\n<b>✓ Jisajili Hapa \n\n👤 (Tanzania 🇹🇿)</b>\n<a href="${gsb}">https://m.gsb.co.tz/register\nhttps://m.gsb.co.tz/register</a>\n▬\n<b>👤 (Kenya 🇰🇪)</b>\n<a href="${ke}">https://10bet.co.ke/register</a>\n▬\n<b>👤 (Uganda 🇺🇬)</b>\n<a href="${ug}">https://gsb.ug/register</a>\n\n<u>Msaada </u>\nmsaada wa kuzielewa hizi option bonyeza <b>/maelezo</b>`

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
        let url = `http://mkekawaleo.com/#supa-za-leo`
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