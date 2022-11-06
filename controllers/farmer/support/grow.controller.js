const db = require('../../../lib/db');


// CREATE type product
module.exports.create = function (req, res) {

    const date = new Date();
    const dates = date.getDate().toString() + " - " + date.getMonth().toString() +  " - " + date.getFullYear().toString() 

    const {farmer_id, name, qty, unit} = req.body;
    try {
        db.query(
            "INSERT INTO grow_vege (farmer_id, name, date, qty, unit) VALUES(?, ?, ?, ?, ?)",
            [farmer_id, name, dates, qty, unit ],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while inserting a grow vage into the database", err);
                    return res.status(400).send();
                }
                return res.status(200).json({ message: "New grow vage successfully created!"});
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

module.exports.read = function (req, res) {

    const farmer_id = req.query.farmer_id;
    db.query(
        "SELECT * FROM grow_vege WHERE farmer_id = ?",
        [farmer_id],
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
    const {grow_id, name, qty, unit} = req.body;

    try {
        db.query("UPDATE grow_vege SET name = ?, qty = ?, unit = ? WHERE grow_id = ?", 
        [ name, qty, unit, grow_id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json({ message: "User grow_vege updated successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

module.exports.delete = function (req, res){
    const grow_id = req.params.grow_id;

    try {
        db.query("DELETE FROM grow_vege WHERE grow_id = ?", [grow_id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "No user with that grow_id!"});
            }
            return res.status(200).json({ message: "grow_vege deleted successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}


