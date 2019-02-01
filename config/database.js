if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: 'mongodb://ryan:Rps04trojans/@ds219055.mlab.com:19055/checklist-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/checklist-dev'
    }
}
