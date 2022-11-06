
const db = require('../../../lib/db.js');


// CREATE type product

module.exports.create = function (req, res) {
    const date = new Date();
    const dates = date.getDate() + "-" +  date.getMonth() + "-" +  date.getFullYear()
    const {employee, cusName, address , sell_type, pmtype , status, payment, totalPrice, cartItems} = req.body;
    try {
        db.query(
            "INSERT INTO payment_sell (type, date, picture) VALUES(?, ?, ?)",
            [pmtype, dates, payment],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while inserting a payment sell into the database", err);
                    return res.status(400).send();
                } 
                else{
                    db.query(
                        "INSERT INTO sell (employee_id, customer_id, payment_sell_id ,address, date, type, status, total_price) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
                        [ employee , cusName , results.insertId, address , dates, sell_type, status, totalPrice],
                        (err, results, fields) => {
                            if (err) {
                                return res.status(400).send(err);
                            }else{
                                for(let i = 0; i < cartItems.length; i++){
                                    const { id, qty, price} = cartItems[i]
                                    try {
                                        db.query(
                                            "INSERT INTO sell_detail (sell_id, product_id, qty, price) VALUES(?, ?, ?, ?)",
                                            [results.insertId, id, qty, price],
                                            (err, results, fields) => {
                                                if (err) {
                                                    return res.status(400).send(err);
                                                }    
                                            }
                                        )
                                    } catch(err) {
                                        console.log(err);
                                        return res.status(500).send(err);
                                    }
                                }
                                return res.status(200).send("success sell detail");
                            }
                        }
                    )
                }
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}


module.exports.read = function (req, res) {
    db.query(
        `SELECT sell.sell_id as id, customer.customer_id as cus_id, customer.name as cusname, customer.lastname as cuslname, sell.type as type, sell.date as date, sell.status as status, sell.total_price as total FROM sell INNER JOIN customer ON customer.customer_id = sell.customer_id`,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            return res.status(201).json(results)
        }
    );
}

module.exports.singleread = function (req, res) {
    const sell_id = req.params.sell_id
    db.query(
        `SELECT sell.sell_id as id, employee.name as empname, employee.lastname as emplname, customer.customer_id as cus_id, customer.name as cusname, customer.lastname as cuslname, sell.address as address , sell.type as type_sell, sell.date as date, sell.status as status, sell.total_price as total,payment_sell.payment_sell_id as pm_id, payment_sell.type as pmtype, payment_sell.picture as picture FROM sell INNER JOIN customer ON customer.customer_id = sell.customer_id INNER JOIN employee ON employee.employee_id = sell.employee_id INNER JOIN payment_sell ON payment_sell.payment_sell_id = sell.payment_sell_id WHERE sell.sell_id =  ?`,
        [sell_id],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            return res.status(201).json(results)
        }
    );
}

module.exports.update = function (req, res) {

    const sell_id = req.params.sell_id; 
    const {payment_sell_id, emp_id, cus_id, address , status, total_price, pmtype, fileName} = req.body;
    console.log(req.body)
    try {
        db.query(
            "UPDATE payment_sell SET type = ?, picture = ? WHERE payment_sell_id = ?",
            [pmtype, fileName, payment_sell_id],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while inserting a payment sell into the database", err);
                    return res.status(400).send();
                } 
                else{
                    db.query(
                        "UPDATE sell SET employee_id = ?, customer_id = ?, address = ?, status = ?, total_price = ? WHERE sell_id = ?",
                        [ emp_id , cus_id, address , status, total_price, sell_id],
                        (err, results, fields) => {
                            if (err) {
                                return res.status(400).send(err);
                            }else{
                                return res.status(200).json({ message: "User sell updated successfully!"});
                            }
                        }
                    )
                }
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

// module.exports.update = function (req, res){
//     const sell_id = req.params.sell_id;
//     const {employee_id, address, type, status, total_price } = req.body;

//     try {
//         db.query("UPDATE sell SET employee_id = ?, address = ? , date_sell = ? , type = ?, status = ?, total_price = ? WHERE sell_id = ?", 
//         [employee_id, address, Date.now(), type, status, sell_id, total_price], (err, results, fields) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send();
//             }
//             return res.status(200).json({ message: "User sell product updated successfully!"});
//         })
//     } catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// }

module.exports.delete = function (req, res){
    const {sell_id, payment_sell_id } = req.body;

    try {
        db.query("DELETE FROM sell_detail WHERE sell_id = ?", 
        [sell_id], 
        (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "No detail order with that sell_id!"});
            }
                try {
                    db.query("DELETE FROM sell WHERE sell_id = ?",
                    [sell_id], 
                    (err, results, fields) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).send();
                        }
                        if (results.affectedRows === 0) {
                            return res.status(404).json({ message: "No order product with that sell_id!"});
                        }
                            try {
                                db.query("DELETE FROM payment_sell WHERE payment_sell_id = ?",
                                [payment_sell_id], 
                                (err, results, fields) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(400).send();
                                    }
                                    if (results.affectedRows === 0) {
                                        return res.status(404).json({ message: "No order product with that payment_sell_id!"});
                                    }
                                    return res.status(200).json({ message: "payment sell deleted successfully!"});
                                })
                            } catch(err) {
                                console.log(err);
                                return res.status(500).send();
                            }
                    })
                } catch(err) {
                    console.log(err);
                    return res.status(500).send();
                }
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    } 
}

// module.exports.delete = function (req, res){
//     const sell_id = req.params.sell_id;

//     try {
//         db.query("DELETE FROM sell WHERE sell_id = ?", [sell_id], (err, results, fields) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send();
//             }
//             if (results.affectedRows === 0) {
//                 return res.status(404).json({ message: "No sell sell with that sell_id!"});
//             }
//             return res.status(200).json({ message: "sell product deleted successfully!"});
//         })
//     } catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// }