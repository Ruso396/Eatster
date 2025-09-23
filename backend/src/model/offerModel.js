const db = require("../config/db");

exports.addOffer = (offer, callback) => {
  const sql = `
    INSERT INTO restaurant_offers 
    (restaurant_id, title, description, discount_percent, valid_from, valid_to, active, image_url, price, foodname)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [
    offer.restaurant_id,
    offer.title,
    offer.description,
    offer.discount_percent,
    offer.valid_from,
    offer.valid_to,
    offer.active ?? true,
    offer.image_url,
    offer.price,
    offer.foodname
  ], callback);
};

exports.getOffersByRestaurantId = (restaurantId, callback) => {
  const sql = `
    SELECT id, title, description, discount_percent, valid_from, valid_to, active, image_url, price, foodname
    FROM restaurant_offers
    WHERE restaurant_id = ?
    ORDER BY valid_from DESC
  `;
  db.query(sql, [restaurantId], callback);
};

exports.deleteOffer = (offerId, callback) => {
  const sql = 'DELETE FROM restaurant_offers WHERE id = ?';
  db.query(sql, [offerId], callback);
};

exports.updateOffer = (offerId, offer, callback) => {
  const sql = `UPDATE restaurant_offers SET title=?, description=?, discount_percent=?, valid_from=?, valid_to=?, active=?, image_url=?, price=?, foodname=? WHERE id=?`;
  db.query(sql, [offer.title, offer.description, offer.discount_percent, offer.valid_from, offer.valid_to, offer.active, offer.image_url, offer.price, offer.foodname, offerId], callback);
};

exports.getAllOffersWithRestaurant = (callback) => {
  const sql = `
    SELECT o.*, r.name as restaurant_name, r.id as restaurant_id
    FROM restaurant_offers o
    JOIN restaurants r ON o.restaurant_id = r.id
    ORDER BY o.valid_from DESC
  `;
  db.query(sql, callback);
};





