const { Telegraf } = require('telegraf')
require('dotenv').config()
const nyumbuModel = require('./database/chats')
const mongoose = require('mongoose')

const bot = new Telegraf(process.env.BOT_TOKEN)

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASS}@nodetuts.ngo9k.mongodb.net/ohmyNew?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connected to the database')
    }).catch((err) => {
        console.log(err)
        bot.telegram.sendMessage(741815228, err.message)
    })

const imp = {
    replyDb: -1001608248942,
    pzone: -1001352114412,
    prem_channel: -1001470139866,
    local_domain: 't.me/rss_shemdoe_bot?start=',
    prod_domain: 't.me/ohmychannelV2bot?start=',
    shemdoe: 741815228,
    halot: 1473393723,
    xzone: -1001740624527,
    ohmyDB: -1001586042518,
    xbongo: -1001263624837,
    mylove: -1001748858805
}


bot.start(ctx => {
    ctx.reply('Hello karibu, nakusikiliza')
})

bot.command('/broadcast', async ctx => {
    let myId = ctx.chat.id
    let txt = ctx.message.text
    let msg_id = Number(txt.split('/broadcast-')[1].trim())
    if (myId == imp.shemdoe || myId == imp.halot) {
        try {
            let all_users = await nyumbuModel.find()

            all_users.forEach((u, index) => {
                setTimeout(() => {
                    if (index == all_users.length - 1) {
                        ctx.reply('Nimemaliza kutuma offer')
                    }
                    bot.telegram.copyMessage(u.chatid, imp.pzone, msg_id, {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: '🎯 Bonyeza Kujisajili 🎯', url: 'https://track.africabetpartners.com/visit/?bta=35468&nci=5377' }
                                ]
                            ]
                        }
                    })
                        .then(() => console.log('Offer sent to ' + u.chatid))
                        .catch((err) => {
                            if (err.message.includes('blocked') || err.message.includes('initiate')) {
                                nyumbuModel.findOneAndDelete({ chatid: u.chatid })
                                    .then(() => { console.log(u.chatid + ' is deleted') })
                            }
                        })
                }, index * 40)
            })
        } catch (err) {
            console.log(err.message)
        }
    }

})

bot.command('/convo', async ctx => {
    let myId = ctx.chat.id
    let txt = ctx.message.text
    let msg_id = Number(txt.split('/convo-')[1].trim())
    if (myId == imp.shemdoe || myId == imp.halot) {
        try {
            let all_users = await nyumbuModel.find()

            all_users.forEach((u, index) => {
                setTimeout(() => {
                    if (index == all_users.length - 1) {
                        ctx.reply('Nimemaliza conversation')
                    }
                    bot.telegram.copyMessage(u.chatid, imp.pzone, msg_id)
                        .then(() => console.log('convo sent to ' + u.chatid))
                        .catch((err) => {
                            if (err.message.includes('blocked') || err.message.includes('initiate')) {
                                nyumbuModel.findOneAndDelete({ chatid: u.chatid })
                                    .then(() => { console.log(u.chatid + ' is deleted') })
                            }
                        })
                }, index * 40)
            })
        } catch (err) {
            console.log(err.message)
        }
    }

})

bot.command('send', async ctx => {
    let txt = ctx.message.text
    if (ctx.chat.id == imp.shemdoe || ctx.chat.id == imp.halot) {
        let chatid = txt.split('=')[1]
        let ujumbe = txt.split('=')[2]

        await bot.telegram.sendMessage(chatid, ujumbe)
            .catch((err) => console.log(err))
    }
})

bot.on('chat_join_request', async ctx => {
    try {

        let username = ctx.chatJoinRequest.from.first_name
        let chatid = ctx.chatJoinRequest.from.id
        let cha_id = ctx.chatJoinRequest.chat.id
        let title = ctx.chatJoinRequest.chat.title
        let info = await bot.telegram.getChat(cha_id)
        let invite_link = info.invite_link

        let nyumbu = await nyumbuModel.findOne({ chatid })
        if (!nyumbu) {
            await nyumbuModel.create({ chatid, username })
        }
        await bot.telegram.approveChatJoinRequest(cha_id, chatid)
        await bot.telegram.sendMessage(chatid, `Hi <b>${username}</b> \nHongera 🎉 ombi lako la kujiunga na channel yetu <b>${title}</b> limekubaliwa, karibu sana.`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[{ text: 'Ingia sasa', url: invite_link }]]
            }
        })

    } catch (err) {
        console.log(err)
        if (!err.message) {
            await bot.telegram.sendMessage(imp.shemdoe, err.description)
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
        }
    }
})

bot.on('text', async ctx => {
    try {
        let userid = ctx.chat.id
        let txt = ctx.message.text
        let username = ctx.chat.first_name

        await bot.telegram.sendMessage(imp.halot, `<b>${txt}</b> \n\nfrom = <code>${username}</code>\nid = <code>${userid}</code>`, {parse_mode: 'HTML', disable_notification: true})
    } catch (err) {
        if (!err.message) {
            await bot.telegram.sendMessage(imp.shemdoe, err.description)
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
        }
    }
})



bot.launch()
    .then((console.log('Bot is running')))
    .catch((err) => {
        console.log('Bot is not running')
        bot.telegram.sendMessage(imp.shemdoe, err.message)
    })


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

process.on('unhandledRejection', (reason, promise) => {
    bot.telegram.sendMessage(imp.shemdoe, reason + ' It is an unhandled rejection.')
    console.log(reason)
    //on production here process will change from crash to start cools
})

//caught any exception
process.on('uncaughtException', (err) => {
    console.log(err)
    bot.telegram.sendMessage(741815228, err.message + ' - It is ana uncaught exception.')
})