const credentials=require('../../../private/google-services.json')
const client_id=credentials.client[0].oauth_client[1].client_id
 module.exports={credentials,client_id}