const { Telegraf } = require('telegraf')
require('dotenv').config()
const nyumbuModel = require('./database/chats')
const my_channels_db = require('./database/my_channels')
const mongoose = require('mongoose')

const bot = new Telegraf(process.env.BOT_TOKEN)

mongoose.connect(`mongodb://${process.env.USER}:${process.env.PASS}@nodetuts-shard-00-00.ngo9k.mongodb.net:27017,nodetuts-shard-00-01.ngo9k.mongodb.net:27017,nodetuts-shard-00-02.ngo9k.mongodb.net:27017/ohmyNew?ssl=true&replicaSet=atlas-pyxyme-shard-0&authSource=admin&retryWrites=true&w=majority`)
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
                if (u.blocked != true) {
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
                }
            })
        } catch (err) {
            console.log(err.message)
        }
    }

})

bot.command('/sll', async ctx => {
    await nyumbuModel.updateMany({}, { $set: { blocked: false } })
    ctx.reply('Updated')
})

bot.command('/post_to_channels', async ctx => {
    let txt = ctx.message.text
    let ch_link = 'https://t.me/+804l_wD7yYgzM2Q0'
    let keyb = [
        [{ text: "❌❌ VIDEO ZA KUTOMBANA HAPA ❤️", url: ch_link },],
        [{ text: "🔥 Unganishwa Na Malaya Mikoa Yote 🔞", url: ch_link },],
        [{ text: "🍑🍑 Magroup Ya Ngono na Madada Poa 🔞", url: ch_link },],
        [{ text: "💋 XXX ZA BONGO ❌❌❌", url: ch_link },],
        [{ text: "🔥🔥 Connection Za Chuo na Mastaa 🔞", url: ch_link }]
    ]

    let mid = Number(txt.split('post_to_channels=')[1])

    let channels = await my_channels_db.find()

    for (ch of channels) {
        await bot.telegram.copyMessage(ch.ch_id, imp.pzone, mid, {
            disable_notification: true,
            reply_markup: {
                inline_keyboard: keyb
            }
        })
    }
})

bot.on('channel_post', async ctx => {
    let txt = ctx.channelPost.text
    let txtid = ctx.channelPost.message_id

    try {
        if (ctx.channelPost.text) {
            if (txt.toLowerCase().includes('add me')) {
                let ch_id = ctx.channelPost.sender_chat.id
                let ch_title = ctx.channelPost.sender_chat.title

                let check_ch = await my_channels_db.findOne({ ch_id })
                if (!check_ch) {
                    await my_channels_db.create({ ch_id, ch_title })
                    let uj = await ctx.reply('channel added to db')
                    await bot.telegram.deleteMessage(ch_id, txtid)
                    setTimeout(() => {
                        bot.telegram.deleteMessage(ch_id, uj.message_id)
                            .catch((err) => console.log(err))
                    }, 1000)
                } else {
                    let already = await ctx.reply('Channel Already existed')
                    setTimeout(() => {
                        bot.telegram.deleteMessage(ch_id, already.message_id)
                            .catch((err) => console.log(err))
                    }, 1000)
                }
            }
        }

    } catch (err) {
        console.log(err)
        if (!err.message) {
            await bot.telegram.sendMessage(imp.shemdoe, err.description)
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
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
        if (ctx.message.reply_to_message && ctx.chat.id == imp.halot) {
            if (ctx.message.reply_to_message.text) {
                let my_msg = ctx.message.text
                let umsg = ctx.message.reply_to_message.text
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let mid = Number(ids.split('&mid=')[1])

                if (my_msg == 'block 666') {
                    await nyumbuModel.findOneAndUpdate({ chatid: userid }, { blocked: true })
                    await ctx.reply(userid + ' blocked for mass massaging')
                } else {
                    await bot.telegram.sendMessage(userid, my_msg, { reply_to_message_id: mid })
                }

            }

            else if (ctx.message.reply_to_message.photo) {
                let my_msg = ctx.message.text
                let umsg = ctx.message.reply_to_message.caption
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let mid = Number(ids.split('&mid=')[1])


                await bot.telegram.sendMessage(userid, my_msg, { reply_to_message_id: mid })
            }
        }


        else {
            let userid = ctx.chat.id
            let txt = ctx.message.text
            let username = ctx.chat.first_name
            let mid = ctx.message.message_id

            await bot.telegram.sendMessage(imp.halot, `<b>${txt}</b> \n\nfrom = <code>${username}</code>\nid = <code>${userid}</code>&mid=${mid}`, { parse_mode: 'HTML', disable_notification: true })
        }

    } catch (err) {
        if (!err.message) {
            await bot.telegram.sendMessage(imp.shemdoe, err.description)
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
        }
    }
})

bot.on('photo', async ctx => {
    try {
        let mid = ctx.message.message_id
        let username = ctx.chat.first_name
        let chatid = ctx.chat.id
        let cap = ctx.message.caption

        if (ctx.message.reply_to_message && chatid == imp.halot) {
            if (ctx.message.reply_to_message.text) {
                let umsg = ctx.message.reply_to_message.text
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let rmid = Number(ids.split('&mid=')[1])


                await bot.telegram.copyMessage(userid, chatid, mid, {
                    reply_to_message_id: rmid
                })
            }

            else if (ctx.message.reply_to_message.photo) {
                let umsg = ctx.message.reply_to_message.caption
                let ids = umsg.split('id = ')[1].trim()
                let userid = Number(ids.split('&mid=')[0])
                let rmid = Number(ids.split('&mid=')[1])


                await bot.telegram.copyMessage(userid, chatid, mid, {
                    reply_to_message_id: rmid
                })
            }
        }


        else {
            await bot.telegram.copyMessage(imp.halot, chatid, mid, {
                caption: cap + `\n\nfrom = <code>${username}</code>\nid = <code>${chatid}</code>&mid=${mid}`,
                parse_mode: 'HTML'
            })
        }
    } catch (err) {
        if (!err.message) {
            await bot.telegram.sendMessage(imp.shemdoe, err.description)
            console.log(err)
        } else {
            await bot.telegram.sendMessage(imp.shemdoe, err.message)
            console.log(err)
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