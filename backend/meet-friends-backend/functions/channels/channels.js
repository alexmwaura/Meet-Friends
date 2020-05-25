const {db} = require("../util/admin")
const {channelValidator} =require( "../validator/channel_validators/validator")

exports.addChannel = (req,res) => {
    const channelData = {
        channelName: req.body.channelName,
        details: req.body.details 
    }
    const {errors,valid} = channelValidator(channelData)
    if(!valid)return res.status(400).json(errors)

    try {
        db.collection("channels").where("channelName", "==", channelData.channelName).get().then(channel => {
            if(!channel.empty){
                console.log("error")
                return res.status(400).json({channelName: `${channelData.channelName} already in use`})}
            const channelCollection = channelData
            channelCollection.createdBy = req.user.userId
            db.collection("channels").add(channelCollection).then(data=>{
                channelId= data.id
                data.update({channelId: data.id})
                channelCollection.channelId = data.id
                return res.status(200).json(channelCollection)
            }).catch(err=> {
                console.error(err)
                return res.status(500).json({error: "Something went wrong"})
            })
        }).catch(err=> {
            console.error(err)
            return res.status(500).json({error: "Something went wrong"})
        })
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Something went wrong"})
    }
}