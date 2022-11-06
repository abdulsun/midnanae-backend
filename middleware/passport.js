const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt  = require('passport-jwt').ExtractJwt

const db = require('../lib/db')

passport.use('user_auth',new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:"SECRETKEY"
},(jwtPayload,done)=>{
    if(jwtPayload.role == '0'){
        db.query("SELECT * FROM employee WHERE employee_id = ?",[jwtPayload.id],
        (err,result)=>{
            if(err) return done(err)
            if(result.length == 0 ){
                return done(null,false);
            }else{
                return done(null,result[0])
            }
        })
    } else if(jwtPayload.role == '1'){
        db.query("SELECT * FROM customer WHERE customer_id = ?",[jwtPayload.id],
        (err,result)=>{
            if(err) return done(err)
            if(result.length == 0 ){
                return done(null,false);
            }else{
                return done(null,result[0])
            }
        })
    } else if(jwtPayload.role == '2'){
        db.query("SELECT * FROM farmer WHERE farmer_id = ?",[jwtPayload.id],
        (err,result)=>{
            if(err) return done(err)
            if(result.length == 0 ){
                return done(null,false);
            }else{
                return done(null,result[0])
            }
        })
    }
}))