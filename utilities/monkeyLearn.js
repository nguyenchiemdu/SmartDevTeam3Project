const axios = require('axios');
const MonkeyLearn = require('monkeylearn')
// Use the API key from your account
const ml = new MonkeyLearn('0f57fb9be4617a9e76a06c310680613ea760378b');

module.exports = {
    monkeyLearnAnalysis: async (comment) => {
        // Sentiment analysis ID
        let model_id = 'cl_pi3C7JiL'
        let data = []
        var commentAnalyzed, analyzeComment;
        data.push(comment);
        analyzeComment = await ml.classifiers.classify(model_id, data).then(async (response) => {
            const res = await response.body;
            res.forEach((data) => {
                data.classifications.forEach(data => {
                    commentAnalyzed = data.tag_name;
                })
            })
            return commentAnalyzed;
        }).catch(error => {
            console.log(error.response)
        })
        return analyzeComment;
    }
}