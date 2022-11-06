
const db = require('../../../lib/db.js');





module.exports.singleread = function (req, res) {
    const customer_id = req.params.customer_id
    db.query(
        `SELECT address FROM sell WHERE customer_id = ? GROUP BY address`,
        [customer_id],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            return res.status(201).send(results)
        }
    );
}

