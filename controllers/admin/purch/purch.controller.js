
const db = require('../../../lib/db.js');

module.exports.create = function (req, res) {
    const date = new Date();
    const dates = date.getDate() + "-" +  date.getMonth() + "-" +  date.getFullYear()
    const {employee, farmername, address , productDetial, status, total_price, kindOfPay, fileName} = req.body;
    try {
        db.query(
            "INSERT INTO payment_purch (type, date, picture) VALUES(?, ?, ?)",
            [kindOfPay, dates, fileName],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while inserting a payment purch into the database", err);
                    return res.status(400).send();
                } 
                else{
                    db.query(
                        "INSERT INTO order_product (employee_id, farmer_id, payment_purch_id ,address, date, status, total_price) VALUES(?, ?, ?, ?, ?, ?, ?)",
                        [ employee , farmername,results.insertId, address , dates ,status, total_price],
                        (err, results, fields) => {
                            if (err) {
                                return res.status(400).send(err);
                            }else{
                                for(let i = 0; i < productDetial.length; i++){
                                    const { name, price, qty, prqty} = productDetial[i]
                                    // console.log(qty, prqty)
                                    try {
                                        db.query(
                                            "INSERT INTO detail_order_product (	order_product_id, product_id, qty, price ) VALUES( ?, ?, ?, ?)",
                                            [results.insertId, name, qty, price],
                                            (err, results, fields) => {
                                                if (err) {
                                                    return res.status(400).send(err);
                                                } else{
                                                    const value = Number(qty) + Number(prqty);
                                                    db.query("UPDATE product SET qty = ? WHERE product_id = ?", 
                                                    [ value, name], (err, results, fields) => {
                                                        if (err) {
                                                            console.log(err);
                                                            return res.status(400).send();
                                                        }
                                                    })
                                                }   
                                            }
                                        )
                                    } catch(err) {
                                        console.log(err);
                                        return res.status(500).send(err);
                                    }
                                }
                                return res.status(200).send("success pursh detail");
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
        `SELECT order_product.order_product_id as id, payment_purch.payment_purch_id as pm_id , employee.name as empname, employee.lastname as emplname,farmer.name as fmname, farmer.lastname as fmlnamme , order_product.address as address, order_product.date as date, order_product.status as status, order_product.total_price as total FROM order_product INNER JOIN employee ON employee.employee_id = order_product.employee_id INNER JOIN farmer ON farmer.farmer_id = order_product.farmer_id INNER JOIN payment_purch ON payment_purch.payment_purch_id = order_product.payment_purch_id `,
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
    const order_product_id = req.params.order_product_id;
    db.query(
        `SELECT order_product.order_product_id as id, employee.employee_id as emp_id, employee.name as empname, employee.lastname as emplname, farmer.farmer_id as fm_id, farmer.name as fmname, farmer.lastname as fmlname , order_product.address as address, order_product.date as date, order_product.status as status, order_product.total_price as total, payment_purch.payment_purch_id as pm_id, payment_purch.type as pmtype, payment_purch.date as pmdate, payment_purch.picture as picture FROM order_product INNER JOIN employee ON employee.employee_id = order_product.employee_id INNER JOIN farmer ON farmer.farmer_id = order_product.farmer_id INNER JOIN payment_purch ON payment_purch.payment_purch_id = order_product.payment_purch_id WHERE order_product.order_product_id = ?`,
        [order_product_id],
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

    const order_product_id = req.params.order_product_id; 
    const {payment_purch_id, emp_id , farmername, address , status, total_price, kindOfPay, fileName} = req.body;
    try {
        db.query(
            "UPDATE payment_purch SET type = ?, picture = ? WHERE payment_purch_id = ?",
            [kindOfPay, fileName, payment_purch_id],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while inserting a payment purch into the database", err);
                    return res.status(400).send();
                } 
                else{
                    db.query(
                        "UPDATE order_product SET employee_id = ?, farmer_id = ?, address = ?, status = ?, total_price = ? WHERE order_product_id = ?",
                        [ emp_id  , farmername, address , status, total_price, order_product_id],
                        (err, results, fields) => {
                            if (err) {
                                return res.status(400).send(err);
                            }else{
                                return res.status(200).json({ message: "User order product updated successfully!"});
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
//     const order_product_id = req.params.order_product_id;   
//     const {employee_id, address, status, total_price } = req.body;

//     try {
//         db.query("UPDATE order_product SET employee_id = ?, address = ? , date = ? , status = ?, total_price = ? WHERE order_product_id = ?", 
//         [employee_id, address, Date.now(), status, total_price, order_product_id], (err, results, fields) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send();
//             }
//             return res.status(200).json({ message: "User order product updated successfully!"});
//         })
//     } catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// }



module.exports.delete = function (req, res){
    // const { payment_purch_id, order_product_id } = req.body;
    // 
    const  payment_purch_id  = req.params.payment_purch_id;
    const   order_product_id  = req.params.order_product_id ;
    // console.log( payment_purch_id, order_product_id)
    try {
        db.query("DELETE FROM detail_order_product WHERE order_product_id = ?", 
        [order_product_id], 
        (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                // console.log(results)
                return res.status(404).json({ message: "No detail order with that detail_order_id!"});
            }
            // return res.status(200).json({ message: "payment purch deleted successfully!"});
                try {
                    db.query("DELETE FROM order_product WHERE order_product_id = ?",
                    [order_product_id], 
                    (err, results, fields) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).send();
                        }
                        if (results.affectedRows === 0) {
                            return res.status(404).json({ message: "No order product with that order_product_id!"});
                        }
                            try {
                                db.query("DELETE FROM payment_purch WHERE payment_purch_id = ?",
                                [payment_purch_id], 
                                (err, results, fields) => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(400).send();
                                    }
                                    if (results.affectedRows === 0) {
                                        return res.status(404).json({ message: "No order product with that payment_purch_id!"});
                                    }
                                    return res.status(200).json({ message: "order product  deleted successfully!"});
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