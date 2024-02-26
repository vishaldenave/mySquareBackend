import JwtService from "../services/JwtServices.js"
import UserModel from "../model/user.js"
class Authorization{
    static authorization = async(req,res,next)=>{
        if (req.headers && req.headers.authorization) {
            //const {authorization} = req.header.authorization
            const parts = req.headers.authorization.split(' ');
            if(parts.length !== 2) return res.status(401).send({code: 'FAILED', message: 'Invalid Token'});
            var userType = parts[0];
            if (userType !== 'LUA') return res.status(401).send({code: 'Failed', message: 'Unauthorized request'});
            const token = parts[1];
            const isVerified = JwtService.verify(token,(error,isVerified)=>{
                return isVerified;
            })
            if(!isVerified)  return res.status(403).send({success: false, message:"Access Denied"});
            const user  =  await UserModel.findById({_id:isVerified.id})
            if (!user) return res.status(403).send({success: false, message:"Unauthorized request"});
            req.user = user;
            next();
        }
        else {
            return res.status(401).send({code: 'FAILED', message: 'Token Missing'});
        }
    }
}
export default Authorization