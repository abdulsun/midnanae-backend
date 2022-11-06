
const db = require('../../../lib/db.js');


// CREATE type product
module.exports.create = function (req, res) {
    const { id, productDetial } = req.body;
    console.log(req.body)
  
    try {
      for (let i = 0; i < productDetial.length; i++) {
        const { name, price, qty, prqty } = productDetial[i];
        // console.log(qty, prqty)
        try {
          db.query(
            "INSERT INTO sell_detail (	sell_id, product_id, qty, price ) VALUES( ?, ?, ?, ?)",
            [id, name, qty, price],
            (err, results, fields) => {
              if (err) {
                return res.status(400).send(err);
              } else {
                const value = Number(prqty) - Number(qty);
                db.query(
                  "UPDATE product SET qty = ? WHERE product_id = ?",
                  [value, name],
                  (err, results, fields) => {
                    if (err) {
                      console.log(err);
                      return res.status(400).send();
                    }
                  }
                );
              }
            }
          );
        } catch (err) {
          console.log(err);
          return res.status(500).send(err);
        }
      }
      return res.status(200).send("success sell detail");
    } catch (err) {
      console.log(err);
      return res.status(500).send();
    }
}

module.exports.read = function (req, res) {
    const sell_id = req.params.sell_id;

    db.query(`SELECT sell_detail.sell_detail_id as dt_id, sell.sell_id as sell_id, product.name as name, type_product.name as type, sell_detail.qty as qty, sell_detail.price as price FROM sell_detail INNER JOIN sell ON sell.sell_id = sell_detail.sell_id INNER JOIN product ON product.product_id = sell_detail.product_id INNER JOIN type_product ON type_product.type_product_id = product.type_product_id WHERE sell_detail.sell_id = ? `,
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



module.exports.update = function (req, res){
    const sell_detail_id = req.params.sell_detail_id;
    const {product_id, qty, price } = req.body;

    try {
        db.query("UPDATE sell_detail SET product_id = ?, qty = ?, price = ? WHERE sell_detail_id = ?", 
        [product_id, qty, price, sell_detail_id], 
        (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            return res.status(200).json({ message: "User sell detail updated successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}

module.exports.delete = function (req, res){
    const sell_detail_id = req.params.sell_detail_id;

    try {
        db.query("DELETE FROM sell_detail WHERE sell_detail_id = ?", [sell_detail_id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "No detail order with that detail_order_id!"});
            }
            return res.status(200).json({ message: "detail order product deleted successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
}