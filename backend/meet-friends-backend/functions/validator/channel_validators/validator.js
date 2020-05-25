const isEmpty = string => {
    if(string.trim() === "")return true
    else return false
}


exports.channelValidator = (data) => {
    let errors = {}
    console.log(data)
    if(isEmpty(data.channelName)) return errors.channelName = "Must not be empty"
    if(isEmpty(data.details)) return errors.channelDetails = "Must not be empty"

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true: false
    }

}