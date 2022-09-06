const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

function YouTubeGetID(url){
    
    let ID = '';
  
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  
    if(url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    }
    else {
        ID = url;
    }
    
    return ID;
}

const addVideo = async(_params) => {
    try {
        await documentClient.put(_params).promise();
    }
    catch (err) {
        console.log(err);
        return err;
    }
};

exports.handler = async (event) => {
    
    try {
        let form = event.body;

        let url = form.url;
        let videoID = YouTubeGetID(url);
        
        let params = {
            Item: { id: Date.now().toString(), url: url, videoID: videoID },
            TableName: 'videoPlaylist'
        };
        
        await addVideo(params);
        
        const response = {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": JSON.stringify('Video added!')
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