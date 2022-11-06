// middleware/users.js

const db = require("../lib/db")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')

module.exports.validateRegister = function (req, res, next) {
  // email min length 3
  if (!req.body.email || req.body.email.length < 3) {
    return res.status(400).send({
      msg: 'Please enter a email with min. 3 chars'
    });
  }

  // password min 6 chars
  if (!req.body.password || req.body.password.length < 6) {
    return res.status(400).send({
      msg: 'Please enter a password with min. 6 chars'
    });
  }

  // password (repeat) does not match
  if (
    !req.body.password_repeat ||
    req.body.password != req.body.password_repeat
  ) {
    return res.status(400).send({
      msg: 'Both passwords must match'
    });
  }
  next();
}

module.exports.checkRole = function (req, res, next) {

  const email = req.query.email
  console.log(req.query.email)

  let role = []

  try {
    if (!email) {
      return res.status(400).send("bad request email is undifined")
    }
    db.query(
      { sql: "SELECT email FROM employee WHERE email=?" },
      [email], (err, result) => {
        console.log(result)
        if (err) {
          return res.status(500).send(err)
        }
        if (result.length == 0) {
          db.query({ sql: "SELECT email FROM customer WHERE email=?" },
            [email], (err, result) => {
              if (err) {
                return res.status(500).send(err)
              }

              if (result.length == 0) {
                db.query({ sql: "SELECT email FROM farmer WHERE email=?" },
                  [email], (err, result) => {
                    if (err) {
                      return res.status(500).send(err)
                    }
                    if (result.length == 0) {
                        return res.status(200).send(role)
                    }
                    else {
                      role.push({ roleFlage: 2, roleName: "farmer" })
                      return res.status(200).send(role)
                    }
                  }
                )
              }
              else {
                role.push({ roleFlage: 1, roleName: "customer" })

                db.query({ sql: "SELECT email FROM farmer WHERE email=?" },
                  [email], (err, result) => {
                    if (err) {
                      return res.status(500).send(err)
                    }
                    if (result.length == 1) {
                      role.push({ roleFlage: 2, roleName: "farmer" })
                      console.log(role)
                      return res.status(200).send(role)
                    }else{
                      return res.status(200).send(role)
                    }
                  }
                )
              }
            }
          )
        }
        else {
          role.push({ roleFlage: 0, roleName: "admin" })
          console.log(role)

          db.query({ sql: "SELECT email FROM customer WHERE email=?" },
            [email], (err, result) => {
              if (err) {
                return res.status(500).send(err)
              }
              if (result.length == 0) {
                db.query({ sql: "SELECT email FROM farmer WHERE email=?" },
                  [email], (err, result) => {
                    if (err) {
                      return res.status(500).send(err)
                    }
                    if (result.length == 1) {
                      role.push({ roleFlage: 2, roleName: "farmer" })
                      console.log(role)
                      return res.status(200).send(role)
                    }else{
                      return res.status(200).send(role)
                    }
                  }
                )
              } else {
                role.push({ roleFlage: 1, roleName: "customer" })

                db.query({ sql: "SELECT email FROM farmer WHERE email=?" },
                  [email], (err, result) => {
                    if (err) {
                      return res.status(500).send(err)
                    }
                    if (result.length == 1) {
                      role.push({ roleFlage: 2, roleName: "farmer" })
                      return res.status(200).send(role)
                    }else{
                      return res.status(200).send(role)
                    }
                  }
                )
              }
            }
          )
        }
      }
    )
  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports.authLogin = function (req, res, next) {
  const { email, password, role } = req.body
  console.log(email, password, role)
  if (!email && !password && !role) {
    return res.status(400).send({ message: 'email and password invalid' })
  }
  try {
    if (role == '0') {
      db.query({ sql: "SELECT * FROM employee WHERE email = ? " }, [email]
        , async (err, result) => {
          if (err) {
            return res.status(500).send(err)
          }
          if (result.length == 0) {
            return res.status(404).send({ message: 'not found' })
          } else {
            bcrypt.compare(password, result[0].password)
              .then((value) => {
                if (value) {
                  const token = jwt.sign(
                    {
                      id: result[0].employee_id,
                      role: role,
                    },
                    'SECRETKEY',
                    {
                      expiresIn: '1d'
                    }
                  )
                  return res.status(200).send({ token, role })
                } else {
                  return res.status(404).send({ message: 'email or password incorrect' })
                }
                
              })
          }
        })
    } else if (role == '1') {
      db.query({ sql: "SELECT * FROM customer WHERE email = ? " }, [email]
        , (err, result) => {
          if (err) {
            return res.status(500).send(err)
          }
          if (result.length == 0) {
            return res.status(404).send({ message: 'not found' })
          } else {
            bcrypt.compare(password, result[0].password)
              .then((value) => {
                if (value) {
                  const token = jwt.sign(
                    {
                      id: result[0].customer_id,
                      role: role,
                    },
                    'SECRETKEY',
                    {
                      expiresIn: '1d'
                    }
                  )
                  return res.status(200).send({ token, role })
                } else {
                  return res.status(404).send({ message: 'email or password incorrect' })
                }
                
              })

          }
        })
    } else if (role == '2') {

      db.query({ sql: "SELECT * FROM farmer WHERE email = ? " }, [email]
        , (err, result) => {
          if (err) {
            return res.status(500).send(err)
          }
          if (result.length == 0) {
            return res.status(404).send({ message: 'not found' })
          } else {
            bcrypt.compare(password, result[0].password)
              .then((value) => {
                if (value) {
                  const token = jwt.sign(
                    {
                      id: result[0].farmer_id,
                      role: role,
                    },
                    'SECRETKEY',
                    {
                      expiresIn: '1d'
                    }
                  )
                  return res.status(200).send({ token, role })
                } else {
                  return res.status(404).send({ message: 'email or password incorrect' })
                }
                
              })

          }
        })
    } else {
      return res.status(400).send({ message: 'role is not correct' })
    }
  } catch (error) {
    console.error(error)
  }

}

module.exports.verifyUser = function(req,res,next){

}


module.exports.isLoggedIn = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(
      token,
      'SECRETKEY'
    );
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      msg: 'Your session is not valid!'
    });
  }
}





