const db = require("../../../lib/db.js");

module.exports.create = function (req, res) {
  const { customer_id, product_id, qty } = req.body;
  try {
    db.query(
      "INSERT INTO cart (customer_id, product_id, qty) VALUES(?, ?, ?)",
      [customer_id, product_id, qty],
      (err, results, fields) => {
        if (err) {
          console.log(
            "Error while inserting a cart detail into the database",
            err
          );
          return res.status(400).send();
        }
        return res
          .status(201)
          .json({ message: "New cart detail successfully created!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
};

module.exports.fullcart = function (req, res) {
  const { cart_id, customer, product_id, qty } = req.body;
  try {
    db.query(
      { sql: "SELECT customer_id FROM cart WHERE customer_id = ?" },
      [customer],
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        if (result.length == 0) {
          // don't have customer_id
          db.query(
            { sql: "SELECT product_id FROM cart WHERE product_id = ?" },
            [customer],
            (err, result) => {
              if (err) {
                return res.status(500).send(err);
              }
              // don't have product_id
              db.query(
                "INSERT INTO cart (customer_id, product_id, qty) VALUES(?, ?, ?)",
                [customer, product_id, qty],
                (err, results, fields) => {
                  if (err) {
                    console.log(
                      "Error while inserting a cart into the database",
                      err
                    );
                    return res.status(400).send();
                  }
                  return res
                    .status(201)
                    .json({ message: "New cart successfully created!" });
                }
              );
            }
          );
        } else {
          // have customer_id
          db.query(
            { sql: "SELECT product_id FROM cart WHERE product_id = ?" },
            [product_id],
            (err, result) => {
              if (err) {
                return res.status(500).send(err);
              }
              if (result.length == 0) {
                // don't have product_id
                db.query(
                  "INSERT INTO cart (customer_id, product_id, qty) VALUES(?, ?, ?)",
                  [customer, product_id, qty],
                  (err, results, fields) => {
                    if (err) {
                      console.log(
                        "Error while inserting a cart into the database",
                        err
                      );
                      return res.status(400).send();
                    }
                    return res
                      .status(201)
                      .json({
                        message: "New cart have customer successfully created!",
                      });
                  }
                );
              } else {
                db.query(
                  { sql: "SELECT cart_id FROM cart WHERE cart_id = ?" },
                  [cart_id],
                  (err, result) => {
                    if (err) {
                      return res.status(500).send(err);
                    }
                    if (result.length == 0) {
                      db.query(
                        "INSERT INTO cart (customer_id, product_id, qty) VALUES(?, ?, ?)",
                        [customer, product_id, qty],
                        (err, results, fields) => {
                          if (err) {
                            console.log(
                              "Error while inserting a cart into the database",
                              err
                            );
                            return res.status(400).send();
                          }
                          return res
                            .status(201)
                            .json({
                              message: "New cart successfully created!",
                            });
                        }
                      );
                    } else {
                      console.log(qty);
                      if (qty === 0) {
                        db.query(
                          "DELETE FROM cart WHERE cart_id = ?",
                          [cart_id],
                          (err, results, fields) => {
                            if (err) {
                              console.log(err);
                              return res.status(400).send();
                            }
                            return res
                              .status(200)
                              .json({ message: "delete successfully!" });
                          }
                        );
                      } else {
                        db.query(
                          "UPDATE cart SET qty = ? WHERE cart_id = ?",
                          [qty, cart_id],
                          (err, results, fields) => {
                            if (err) {
                              console.log(err);
                              return res.status(400).send();
                            }
                            return res
                              .status(200)
                              .json({ message: "updated successfully!" });
                          }
                        );
                      }
                    }
                  }
                );
              }
              // have product_id
            }
          );
        }
      }
    );
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.cutomerread = function (req, res) {
  const customer_id = req.params.customer_id;
  db.query("SELECT * FROM cart WHERE customer_id", (err, results) => {
    if (err) {
      console.log(err);
      return res.status(400).send();
    }
    res.status(201).json(results);
  });
};

module.exports.read = function (req, res) {
  const customer_id = req.params.customer_id;
  db.query(
    `SELECT cart.cart_id as cart_id, cart.customer_id as cus_id, product.product_id as id, product.name as name, product.price_sell as price, product.picture as picture , cart.qty as qty FROM cart INNER JOIN product ON product.product_id = cart.product_id WHERE cart.customer_id = ?`,
    [customer_id],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      return res.status(201).json(results);
    }
  );
};

module.exports.delete = function (req, res) {
  const cart_id = req.params.cart_id;
  db.query(
    "DELETE FROM cart  WHERE cart_id = ?",
    [cart_id],
    (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      return res.status(200).json({ message: "delete successfully!" });
    }
  );
};

module.exports.deleteformcus = function (req, res) {
  const cus_id = req.params.customer_id;
  db.query(
    "DELETE FROM cart  WHERE customer_id = ?",
    [cus_id],
    (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      return res.status(200).json({ message: "delete successfully!" });
    }
  );
};

