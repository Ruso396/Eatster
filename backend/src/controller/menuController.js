// const menuModel = require("../model/menuModel");
const menuModel = require("../model/menuModel");
// ...existing code...

// exports.getAllMenu = (req, res) => {
//   menuModel.getAllMenu((err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };

exports.getMenuById = (req, res) => {
  menuModel.getMenuById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
};

// ✅ Add new item
exports.addMenu = (req, res) => {
  const { foodname, type } = req.body;
  const img = req.file ? req.file.filename : null;

  menuModel.addMenu({ foodname, type, img }, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Menu added", id: result.insertId });
  });
};

// ✅ Update item
exports.updateMenu = (req, res) => {
  const { foodname, type } = req.body;
  const img = req.file ? req.file.filename : null;
  const id = req.params.id;

  if (img) {
    menuModel.updateMenu(id, { foodname, type, img }, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Menu updated with new image" });
    });
  } else {
    menuModel.updateMenuWithoutImage(id, { foodname, type }, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Menu updated without changing image" });
    });
  }
};

exports.deleteMenu = (req, res) => {
  menuModel.deleteMenu(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Menu deleted" });
  });
};

exports.getAllMenu = (req, res) => {
  const { type } = req.query;

  const menuType = type?.toLowerCase() || "all"; // Default to 'all'
  
  menuModel.getMenuByType(menuType, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
