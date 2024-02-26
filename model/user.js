import mongoose from "mongoose";
import encrypt from "bcrypt"
const userSchema  = new mongoose.Schema({
    name:{type:String, require:true,trim:true},
    email:{type:String, require:true,trim:true,unique:true},
    personalEmail:{type:String,default:"",unique:true},
    password:{type:String, require:true,trim:true},
    empId:{type:String, require:true,trim:true,unique:true},
    contactNo:{type:String, require:true,trim:true},
    alternativeContactNo :{type:String, default:""},
    currentAddress:{type:String,default:""},
    permanetAddress:{type:String,default:""},
   
    dateOfJoining:{type:String,default:""},
    dateOfBirth:{type:String,default:""},
    gender:{type:String,default:""},
    bloodGroup:{type:String,default:""},
    maritalStatus:{type:String,default:""},
    languagesKnown:{type:String,default:""},
    higherEducationQualification:{type:String,default:""},

    employeeType:{type:String,default:""},
    probationDuration:{type:Number,default:0},
    workingStatus:{type:String,default:""},
    department:{type:String,default:""},
    designation:{type:String,default:""},
    reportTo:{type:String,default:""},
    reportUserId:{type:mongoose.Schema.Types.ObjectId,
        ref:'Users'},
    role:{type:String,default:""}
},{
    timestamps:true,
    strict:true
});


userSchema.pre('save', function (next) {
    encrypt.genSalt(10, (error, salt) => {
        if (error) return console.log(error);
        encrypt.hash(this.password, salt, (error,hash) => {
            this.password = hash;
            next();
        })
    })
});

userSchema.methods.comparePassword = function (password, cb) {
    encrypt.compare(password, this.password, function (error,match) {
        if (error) return cb(false);
        if (match) return cb(true);
        cb(false);
    });
};

const UserModel = mongoose.model("Users",userSchema);
export default UserModel