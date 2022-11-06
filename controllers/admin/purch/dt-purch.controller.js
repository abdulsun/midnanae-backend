const db = require("../../../lib/db.js");

// CREATE
module.exports.create = function (req, res) {
  const { id, productDetial } = req.body;
  console.log(req.body)

  try {
    for (let i = 0; i < productDetial.length; i++) {
      const { name, price, qty, prqty } = productDetial[i];
      // console.log(qty, prqty)
      try {
        db.query(
          "INSERT INTO detail_order_product (	order_product_id, product_id, qty, price ) VALUES( ?, ?, ?, ?)",
          [id, name, qty, price],
          (err, results, fields) => {
            if (err) {
              return res.status(400).send(err);
            } else {
              const value = Number(qty) + Number(prqty);
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
    return res.status(200).send("success pursh detail");
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

module.exports.read = function (req, res) {
  const order_product_id = req.params.order_product_id;

  db.query(
    `SELECT detail_order_product.detail_order_id as dt_id, order_product.order_product_id as pursh_id , type_product.name as type, product.product_id as pro_id , product.name as name ,detail_order_product.qty as qty, detail_order_product.price as price FROM detail_order_product INNER JOIN order_product ON order_product.order_product_id = detail_order_product.order_product_id INNER JOIN product ON product.product_id = detail_order_product.product_id INNER JOIN type_product ON type_product.type_product_id = product.type_product_id WHERE order_product.order_product_id =  ?`,
    [order_product_id],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      return res.status(201).json(results);
    }
  );
};

module.exports.update = function (req, res) {
  const detail_order_id = req.params.detail_order_id;
  const { product_id, qty, price } = req.body;

  try {
    db.query(
      "UPDATE detail_order_product SET product_id = ? , qty = ?, price = ? WHERE detail_order_id = ?",
      [product_id, qty, price, detail_order_id],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        return res
          .status(200)
          .json({ message: "User detail order product updated successfully!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

module.exports.delete = function (req, res) {
  const detail_order_id = req.params.detail_order_id;

  try {
    db.query(
      "DELETE FROM detail_order_product WHERE detail_order_id = ?",
      [detail_order_id],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "No detail order with that detail_order_id!" });
        }
        return res
          .status(200)
          .json({ message: "detail order product deleted successfully!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};
