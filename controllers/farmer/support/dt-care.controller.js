const db = require('../../../lib/db');

module.exports.create = function (req, res) {

    const date = new Date();
    const dates = date.getDate() + "-" +  date.getMonth() + "-" +  date.getFullYear()
    const {farmer_id, name, care} = req.body;

    console.log(req.body)
    try {
        db.query(
            "INSERT INTO care_vege (grow_id, farmer_id, date) VALUES( ?, ?, ?)",
            [ name , farmer_id, dates ],
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send(err);
                }else{
                    for(let i = 0; i < care.length; i++){
                        const { way, tool, amount, unit	} = care[i]
                        try {
                            db.query(
                                "INSERT INTO care_detail (care_id ,way, tool, amount, unit) VALUES( ?, ?, ?, ?, ?)",
                                [results.insertId, way , tool, amount, unit ],
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
                    return res.status(201).send({ message: "New grow detail successfully created!"});
                }
            }
        )
    } catch(err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

// CREATE type product
// module.exports.create = function (req, res) {

//     const date = new Date();
//     const dates = date.getDate().toString() + " - " +  date.getMonth().toString() + " - " +  date.getFullYear().toString() 

//     const {care_id, way, tool, amount, unit	} = req.body;
//     try {
//         db.query(
//             "INSERT INTO care_vege (farmer_id, grow_id , date) VALUES( ?, ?, ?)",
//             [care_id, way, tool, amount, unit ],
//             (err, results, fields) => {
//                 if (err) {
//                     console.log("Error while inserting a care_vege into the database", err);
//                     return res.status(400).send();
//                 }
//                 return res.status(200).json({ message: "New care_vege successfully created!"});
//             }
//         )
//     } catch(err) {
//         console.log(err);
//         return res.status(500).send();
//     }
// }


module.exports.read = function (req, res) {

    const care_id = req.params.care_id;

    // return res.status(200).send(care_id)
    db.query(
        "SELECT care_vege.care_id as id, grow_vege.name as name, grow_vege.qty as qty, grow_vege.unit as grow_unit, grow_vege.date as date_grow, care_vege.date as date_care, care_detail.way as way, care_detail.tool as tool, care_detail.amount as amount, care_detail.unit as care_unit FROM care_detail JOIN care_vege ON care_vege.care_id = care_detail.care_id JOIN grow_vege ON care_vege.grow_id = grow_vege.grow_id WHERE care_vege.care_id = ?",
        [care_id],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            
           return res.status(201).send(results)
        }
    );
}


module.exports.delete = function (req, res){
    const care_id = req.params.care_id;

    try {
        db.query("DELETE FROM care_vege WHERE care_id = ?", [care_id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "No user with that care_id!"});
            }
            return res.status(200).json({ message: "care_vege deleted successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}