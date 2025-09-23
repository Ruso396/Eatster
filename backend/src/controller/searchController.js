const searchModel = require("../model/searchModel");

exports.getSuggestions = (req, res) => {
  const query = req.query.query;

  console.log("Suggestion Query:", query); // ✅ log

  if (!query) return res.status(400).json({ error: "Query is required" });

  searchModel.getFoodSuggestions(query, (err, results) => {
    if (err) {
      console.error("Suggestion Error:", err);
      return res.status(500).json({ error: "Internal error" });
    }

    res.json(results);
  });
};