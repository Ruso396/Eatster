const db = require('../config/db');

exports.getFoodSuggestions = (query, callback) => {
  const sql = `
    SELECT DISTINCT name, image 
    FROM menu_items 
    WHERE name LIKE CONCAT('%', ?, '%') 
       OR name LIKE CONCAT('% ', ?, '%') 
    LIMIT 10
  `;
  db.query(sql, [query, query], callback);
};
// exports.getRestaurantsByFoodNearby = (lat, lng, radius, food, callback) => {
//   const sql = `
//     SELECT 
//       r.*, 
//       m.foodname, 
//       m.price, 
//       m.preparation_time,
//       (
//         6371 * acos(
//           cos(radians(?)) *
//           cos(radians(r.latitude)) *
//           cos(radians(r.longitude) - radians(?)) +
//           sin(radians(?)) *
//           sin(radians(r.latitude))
//         )
//       ) AS distance
//     FROM restaurants r
//     JOIN menu m ON r.id = m.restaurant_id
//     WHERE m.foodname = ?
//     HAVING distance <= ?
//     ORDER BY distance ASC
//   `;

//   db.query(sql, [lat, lng, lat, food, radius], callback);
// };