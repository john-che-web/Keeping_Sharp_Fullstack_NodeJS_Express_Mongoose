const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
//In charge of making sure that users only access the apis they have authorization for

//Should decipher and extract PII from JWT tokens for downstream controllers to use: 
//      should verify JWT tokens in the api request
//      

/*
Algo:
define function that will return the middleware function. It should verify that user access is legit

export the middleware function(s)
*/


    /*get authorization token from header
      if null, stop the request, return a status error and an error message as a response
      
      detokenize using secret
      extract payload and add to request NOT response
      send the req body to the caller as your res
    */


const authMiddleware= async function (req,res,next){
        // console.log('reg header content: ', req.headers)
        const authJWT =req.headers.authorization;
        if(!authJWT){//we're return only the status and error message
            return res.status(401).json({error: 'Missing auth header'})
        }
        
        
        //auth value looks like this "Bearer <token>", so we need to extract <token>
        const token=authJWT.split(' ')[1]
        try{//now we decode
            const decoded=await jwt.verify(token, process.env.JWT_SECRET); 
            //this will be the json payload that was encoded to create the token e.g
            // {
            // "id": "676abcd1234ef56789a01234",
            // "email": "user@example.com",
            // "iat": 1733020000, //issued at
            // "exp": 1733023600 expiration timestamp
            // }
            req.user=decoded; //note that user was not an original subfield we are adding user to req json!
            next();
        }catch(err){
            return res.status(401).json({error: 'invalid or expired token'})
        }

}


module.exports=authMiddleware;