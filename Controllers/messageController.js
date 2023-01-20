const messageModel = require("../Models/messageModel");

const addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await messageModel.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });

        if (data) {
            return res.status(200).json({ msg: "Msg sent...." })
        } else {
            return res.json({ msg: "Msg not sent...." })
        }

    } catch (ex) {
        next(ex)
    }
}

const getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await messageModel.find({
            users: { $all: [from, to] }
        }).sort({ updatedAt: 1 });
        console.log(messages)

        const projectedMessages = messages.map((msg) => {
            const d = new Date(msg.createdAt);
            return {
                fromSelf: msg.sender.toString() === from, /* this will return true or false */
                message: msg.message.text,
                time: d.toLocaleTimeString(),
                date: d.toLocaleDateString(),
            };
        });

        res.json({ projectedMessages, status: true });
        // console.log(projectedMessages);
    } catch (ex) {
        next(ex)
    }
}

module.exports = {
    addMessage,
    getAllMessage
}