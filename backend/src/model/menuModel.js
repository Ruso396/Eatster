const db = require('../config/db');

exports.getAllMenu = (callback) => {
  db.query("SELECT * FROM menu", callback);
};

exports.getMenuById = (id, callback) => {
  db.query("SELECT * FROM menu WHERE id = ?", [id], callback);
};

exports.addMenu = (data, callback) => {
  const { foodname, type, img } = data;
  db.query(
    "INSERT INTO menu (foodname, type, img) VALUES (?, ?, ?)",
    [foodname, type, img],
    callback
  );
};

exports.updateMenu = (id, data, callback) => {
  const { foodname, type, img } = data;
  db.query(
    "UPDATE menu SET foodname = ?, type = ?, img = ? WHERE id = ?",
    [foodname, type, img, id],
    callback
  );
};

exports.updateMenuWithoutImage = (id, data, callback) => {
  const { foodname, type } = data;
  db.query(
    "UPDATE menu SET foodname = ?, type = ? WHERE id = ?",
    [foodname, type, id],
    callback
  );
};

exports.deleteMenu = (id, callback) => {
  db.query("DELETE FROM menu WHERE id = ?", [id], callback);
};

exports.getMenuByType = (type, callback) => {
  if (type === "all") {
    db.query("SELECT * FROM menu", callback);
  } else {
    db.query("SELECT * FROM menu WHERE type = ?", [type], callback);
  }
};
