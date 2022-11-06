const db = require('../../../lib/db');

// CREATE type product


module.exports.read = function (req, res) {

    const farmer_id = req.params.farmer_id;

    db.query(
        "SELECT care_vege.care_id as id, grow_vege.name as name, grow_vege.qty as qty, grow_vege.unit as unit, grow_vege.date as date FROM care_vege JOIN grow_vege ON care_vege.grow_id = grow_vege.grow_id  WHERE farmer_id = ?",
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