const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../../lib/db.js');

module.exports.signup = function (req, res) {

  const image_link = "use.png"
  const { name, lastname,  tell, position, email} = req.body;
  db.query(
    `SELECT * FROM employee WHERE LOWER(email) = LOWER(${db.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: 'This email is already in use!'
        })
      } else {
        // username is available
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err
            });
          } else {
            // has hashed pw => add to database
            db.query(
              "INSERT INTO employee (name, lastname, Image_link, tell, position, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [name, lastname, image_link, tell, position, email, hash],
              (err) => {
                if (err) {
                  console.log("mysql error : ",err);
                  return res.status(400).send({
                    msg: err
                  });
                }
                return res.status(201).send({
                  status: 'OK', 
                  msg: 'Registered!'
                });
              }
            );
          }
        });
      }
    }
  );
}

// module.exports.login = function (req, res) {
//   db.query(
//     "SELECT * FROM employee WHERE email = ?", [req.body.email],
//     (err, result) => {
//       console.log(result)
//       // user does not exists
//       if (err) {
//         console.log("mysql error: ",err);
//         return res.status(400).send({
//           msg: err
//         });
//       }
      
//       if (!result.length) {
//         console.log(result.length)
//         return res.status(401).send({
//           msg: 'email or password is incorrect!'
//         });
//       }

//       // check password
//       //bcrypt.hash(req.body.password, 10, (err, hash)
//       bcrypt.compare(
//         req.body.password,
//         result[0]['password'],
//         (berr, bresult) => {
//           // wrong password
//           if (berr) {
//             console.log("mysql error : ",err);
//             return res.status(400).send({
//               msg: err
//             });
//           }

//           if (bresult) {
//             const token = jwt.sign({
//                 id: result[0].id,
//                 role: result[0]
//               },
//               'SECRETKEY', {
//                 expiresIn: '7d'
//               }
//             );
//             return res.status(201).send({
//               status: 'OK', 
//               msg: 'Logged in!',
//               token,
//             });
//           }
//           return res.status(401).send({
//             msg: 'email or password is incorrect!'
//           });
//         }
//       );
//     }
//   );
// }

module.exports.update = function (req, res) {

  const emp = req.params.emp
  const { name, lastname, Image_link, tell, position, email,password} = req.body;
  console.log(req.body)
  db.query(
    `SELECT * FROM employee WHERE LOWER(email) = LOWER(${db.escape(
      req.body.username
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: 'This email is already in use!'
        })
      } else {
        // username is available
        if(password == ""){
          db.query(
            `UPDATE employee SET name = ?, lastname = ?, Image_link = ?, tell = ?, position = ?, email = ? WHERE employee_id = ?`,
            [name, lastname, Image_link, tell, position, email, emp],
            (err) => {
              if (err) {
                console.log("mysql error : ",err);
                return res.status(400).send({
                  msg: err
                });
              }
              return res.status(201).send({
                status: 'OK', 
                msg: 'update success!'
              });
            }
          );
        } else {
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                msg: err
              });
            } else { 
              db.query(
                `UPDATE employee SET name = ?, lastname = ?, Image_link = ?, tell = ?, position = ?, email = ?, password = ? WHERE employee_id = ?`,
                [name, lastname, image_link, tell, position, email, hash, emp],
                (err) => {
                  if (err) {
                    console.log("mysql error : ",err);
                    return res.status(400).send({
                      msg: err
                    });
                  }
                  return res.status(201).send({
                    status: 'OK', 
                    msg: 'update success!'
                  });
                }
              );
            }
          });
        }

      }
    }
  );
}

// module.exports.passread = function (req, res) {
//   const employee_id = req.params.employee_id;
//   db.query(
//       "SELECT * FROM employee WHERE employee_id = ?",
//       [employee_id],
//       (err, results) => {
//           if (err) {
//               console.log(err);
//               return res.status(400).send();
//           }
//          return res.status(200).send(results)
//       }
//   );
// }

module.exports.auth = function (req, res) {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
}


module.exports.read = function (req, res) {
  db.query(
      "SELECT * FROM employee",
      (err, results) => {
          if (err) {
              console.log(err);
              return res.status(400).send();
          }
          res.status(201).json(results)
      }
  );
}

module.exports.singleread = function (req, res) {
  const employee_id = req.params.employee_id;
  db.query(
      "SELECT * FROM employee WHERE employee_id = ?",
      [employee_id],
      (err, results) => {
          if (err) {
              console.log(err);
              return res.status(400).send();
          }
          res.status(201).json(results)
      }
  );
}

module.exports.delete = function (req, res){
  const employee_id = req.params.employee_id;

  try {
      db.query("DELETE FROM employee WHERE employee_id = ?", [employee_id], (err, results, fields) => {
          if (err) {
              console.log(err);
              return res.status(400).send();
          }
          if (results.affectedRows === 0) {
              return res.status(404).json({ message: "No user with that employee_id!"});
          }
          return res.status(200).json({ message: "employee deleted successfully!"});
      })
  } catch(err) {
      console.log(err);
      return res.status(500).send();
  }
}
