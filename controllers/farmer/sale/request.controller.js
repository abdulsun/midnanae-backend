const db = require('../../../lib/db');


// CREATE type product
module.exports.create = function (req, res) {

    const date = new Date();
    const dates = date.getDate().toString() + " - " + date.getMonth().toString() +  " - " + date.getFullYear().toString() 

    const {farmer_id, subject, status	} = req.body;
    console.log(req.body)
    try {
        db.query(
            "INSERT INTO request (farmer_id, subject, status, date) VALUES(?, ?, ?, ?)",
            [farmer_id,  subject, status, dates ],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while inserting a request into the database", err);
                    return res.status(400).send();
                }
                return res.status(200).json({ message: "New request successfully created!"});
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

module.exports.read = function (req, res) {

    
    db.query(
        "SELECT request.req_id as id, farmer.name as fmname, farmer.lastname as fmlname, request.subject as name, request.status as status, request.date as date FROM request INNER JOIN farmer ON farmer.farmer_id = request.farmer_id ",
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

module.exports.farmerread = function (req, res) {
    
    const farmer_id = req.query.farmer_id;
    db.query(
        "SELECT * FROM request WHERE farmer_id = ?",
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

    const {req_id, subject, status} = req.body;

    try {
        db.query("UPDATE request SET subject = ?, status = ? WHERE req_id = ?", 
        [subject, status, req_id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json({ message: "User request updated successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

module.exports.delete = function (req, res){
    const req_id = req.params.req_id;

    try {
        db.query("DELETE FROM request WHERE req_id = ?", [req_id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "No request with that req_id!"});
            }
            return res.status(200).json({ message: "request deleted successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}


