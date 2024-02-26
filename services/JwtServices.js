import jwt from "jsonwebtoken"
class JwtService{
   
static issue  = payload => {
    return jwt.sign(
        payload,
        process.env.SECRETKEY,
        // {expiresIn: 60 * 60 * 24 * 7}
    )
}
static isseueExpireTokenWithSecretKey = (payload,expireTime,secretKey)=>{
    return jwt.sign(
        payload,
        secretKey,
        {expiresIn: expireTime}
    )
}
static verifyExpireTokenWithSecretKey = (token,secretKey, cb) => {
    return jwt.verify(token,secretKey,{},cb);
}
static verify = (token, cb) => {
    return jwt.verify(token,process.env.SECRETKEY,{},cb);
}

}
export default JwtService