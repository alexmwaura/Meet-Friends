
const isEmpty = (string) => {
	if (string.trim() === '') return true;
	else return false;
};

// post validators
exports.validatePostData = (data) => {

	let errors = {};
	if (isEmpty(data.author)) {
		errors.author = 'Must not be empty';
    }
    if (isEmpty(data.title)) {
		errors.title = 'Must not be empty';
    }
    if (isEmpty(data.post)) {
		errors.post = 'Must not be empty';
	}
	
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true:false
    }

}

// post reducers
exports.postReducers = (data) => {
    let postData = {}
    if (!isEmpty(data.category))postData.category= data.category
    if (data.website.trim().substring(0,4)){
		postData.website = `http://${data.website.trim()}`
    }else postData.website = data.website

    return postData


}