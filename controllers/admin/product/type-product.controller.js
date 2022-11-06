
const db = require('../../../lib/db.js');


// CREATE type product
module.exports.create = function (req, res) {
    const {name,description } = req.body;
    try {
        db.query(
            "INSERT INTO type_product (name,description) VALUES(?, ?)",
            [name,description ],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while inserting a type product into the database", err);
                    return res.status(400).send();
                }
                return res.status(201).json({ message: "New type product successfully created!"});
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}
 
module.exports.read = function (req, res) {
    db.query(
        "SELECT * FROM type_product",
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(201).json(results)
        }
    );
}

module.exports.update = function (req, res){

    const { type_product_id, name,description } = req.body;

    try {
        db.query("UPDATE type_product SET name = ?, description = ? WHERE type_product_id = ?", 
        [name,description,type_product_id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json({ message: "User type product updated successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

module.exports.delete = function (req, res){
    const type_product_id = req.params.type_product_id;

    try {
        db.query("DELETE FROM type_product WHERE type_product_id = ?", [type_product_id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "No user with that type_product_id!"});
            }
            return res.status(200).json({ message: "type product deleted successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}