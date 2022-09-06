const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

let params = {
    TableName: 'videoPlaylist'
};

const getAllData = async(_params) => {
    try {
        const data = await documentClient.scan(_params).promise();
        return data;
    }
    catch (err) {
        return err;
    }
};

exports.handler = async (event) => {
    
    try {
        const data = await getAllData(params);
        
        const response = {
            statusCode: 200,
            body: JSON.stringify(data)
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