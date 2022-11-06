
const db = require('../../../lib/db.js');


// CREATE type product
module.exports.create = function (req, res) {
    const date = new Date();
    const dates = date.getDate() + "-" +  date.getMonth() + "-" +  date.getFullYear()
    const {product_id, qty, details} = req.body;

    try {
        db.query(
            "INSERT INTO weasted_product (product_id, qty, details, date) VALUES(?, ?, ?, ?)",
            [product_id, qty, details, dates],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while inserting a weasted product into the database", err);
                    return res.status(400).send();
                }
                return res.status(201).json({ message: "New weasted product successfully created!"});
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

module.exports.read = function (req, res) {
    db.query(
        "SELECT weasted_product.wst_product_id as id, product.name as name, product.qty as proqty, weasted_product.qty as qty, weasted_product.details as details, weasted_product.date as date FROM weasted_product JOIN product ON weasted_product.product_id = product.product_id ",
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            return res.status(201).json(results)
        }
    );
}

// module.exports.read = function (req, res) {
//     // return res.status(200).send("hello")
//     db.query(
//         "SELECT * FROM weasted_product",
//         (err, results) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(400).send();
//             }
//             return res.status(200).json(results)
//         }
//     );
// }

module.exports.update = function (req, res){
    const wst_product_id = req.params.wst_product_id;
    const {product_id, qty, details } = req.body;

    try {
        db.query("UPDATE weasted_product SET product_id = ?, qty = ?, details = ?, date = ? WHERE wst_product_id = ?", 
        [product_id, qty, details, Date.now(),wst_product_id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json({ message: "User weasted product updated successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

module.exports.delete = function (req, res){
    const wst_product_id = req.params.wst_product_id;

    try {
        db.query("DELETE FROM weasted_product WHERE wst_product_id = ?", [wst_product_id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                
                return res.status(404).json({ message: "No weasted product with that wst_product_id!"});
            }
            console.log(results)
            return res.status(200).json({ message: "weasted product deleted successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}