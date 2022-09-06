const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const removeVideo = async(_params) => {
    try {
        await documentClient.delete(_params).promise();
    }
    catch (err) {
        console.log(err);
        return err;
    }
};

exports.handler = async (event) => {
    
    try {
        let form = event.body;

        let params = {
            TableName: 'videoPlaylist',
            Key: {
                id: form.id
            }
        };
        
        await removeVideo(params);
        
        const response = {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": JSON.stringify('Video removed!')
        };
        
        return response;
    } 
    catch (err) 
    {
        const response = {
            statusCode: 400,
            body: JSON.stringify(err)
        };
        
        return response;
    }
    

};