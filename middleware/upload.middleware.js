const multer = require('multer')
const maxSize = 10 * 1024 * 1024;
const date = new Date();
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,__basedir + "/public/images/product")
    },
    filename:function(req,file,cb){
        const fullname = date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString()  + file.originalname;
        console.log(fullname)
        cb(null,fullname)
    },
});

const filter = (req,file,cb) =>{
    if((file.mimetype == 'image/png') || (file.mimetype == 'image/jpg') || ( file.mimetype == 'image/jpeg')){
        cb(null,true)
    }else{
        cb(null,false)
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}

const uploadFile = multer({
    storage: storage,
    fileFilter:filter,
    limits:{fileSize:maxSize},
})

module.exports = uploadFile;