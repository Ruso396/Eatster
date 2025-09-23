const PDFDocument = require("pdfkit");
const db = require("../config/db");

exports.generateInvoice = (req, res) => {
  const orderId = req.params.orderId;

  const getOrderQuery = `SELECT * FROM orders WHERE order_id = ?`;
  const getItemsQuery = `
    SELECT item_name, quantity, price 
    FROM order_items 
    WHERE order_id = ?`; // 🔴 image_url removed

  db.query(getOrderQuery, [orderId], (err, orders) => {
    if (err || orders.length === 0) return res.status(404).send("Order not found");

    const order = orders[0];
    if (order.order_status !== "Delivered")
      return res.status(403).send("Invoice available only after delivery.");

    db.query(getItemsQuery, [orderId], (err2, items) => {
      if (err2) return res.status(500).send("Failed to fetch items");

      const invoiceId = Math.floor(100000 + Math.random() * 900000);
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const gst = +(total * 0.18).toFixed(2);
      const totalWithGst = +(total + gst).toFixed(2);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=invoice_${order.order_id}.pdf`);

      const doc = new PDFDocument({ margin: 50 });
      doc.pipe(res);

      // ✅ Header
      doc
        .fillColor("#FF5733")
        .fontSize(22)
        .font("Helvetica-Bold")
        .text("Zestaurant Invoice", { align: "center" })
        .moveDown(1);

      // ✅ Order Details
      doc
        .fontSize(12)
        .fillColor("#000")
        .font("Helvetica")
        .text(`Invoice ID: ${invoiceId}`)
        .text(`Order ID: ${order.order_id}`)
        .text(`Order Date: ${new Date(order.order_date_time).toLocaleString()}`)
        .text(`Status: Delivered`)
        .text(`Delivery Date: ${new Date(order.delivery_date_time).toLocaleDateString()}`)
        .moveDown(1.5);

      // ✅ Table Header Background
      const tableTop = doc.y;
      doc
        .fillColor("#007BFF")
        .rect(60, tableTop, 480, 25)
        .fill();

      doc
        .fillColor("#fff")
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Product", 65, tableTop + 7, { width: 150 })
        .text("Qty", 240, tableTop + 7, { width: 50 })
        .text("Unit Price", 310, tableTop + 7, { width: 80 })
        .text("Total", 420, tableTop + 7, { width: 80 });

      doc.moveDown(2);

      // ✅ Table Rows
      doc.font("Helvetica").fontSize(11).fillColor("#000");
      let rowY = doc.y;
      items.forEach((item, index) => {
        const itemTotal = item.quantity * item.price;
        doc
          .text(item.item_name, 65, rowY, { width: 150 })
          .text(item.quantity.toString(), 240, rowY, { width: 50 })
          .text(`Rs. ${item.price.toFixed(2)}`, 310, rowY, { width: 80 })
          .text(`Rs. ${itemTotal.toFixed(2)}`, 420, rowY, { width: 80 });
        rowY += 20;
      });

      doc.moveDown(2);

      // ✅ Summary Box
      const summaryTop = doc.y;
      doc
        .lineWidth(1)
        .rect(320, summaryTop, 220, 80)
        .stroke("#888");

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#000")
        .text("Grand Total:", 330, summaryTop + 10)
        .font("Helvetica")
        .text(`Rs. ${total.toFixed(2)}`, 440, summaryTop + 10);

      doc
        .font("Helvetica-Bold")
        .text("GST (18%):", 330, summaryTop + 30)
        .font("Helvetica")
        .text(`Rs. ${gst.toFixed(2)}`, 440, summaryTop + 30);

      doc
        .font("Helvetica-Bold")
        .text("Total with GST:", 330, summaryTop + 50)
        .font("Helvetica")
        .text(`Rs. ${totalWithGst.toFixed(2)}`, 440, summaryTop + 50);

      doc.moveDown(6);

      // ✅ Clean Footer (NO weird characters or emojis)
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#333")
        .text(`Delivery Address: ${order.delivery_address_ || "Not Available"}`)
        .text(`Payment Method: ${order.paymentmethod || "Not Available"}`)
        // .text(`Customer Email: ${order.customer_email || "Not Available"}`);

      doc.end();
    });
  });
};

// ✅ Fetch all invoices for a restaurant
exports.getInvoicesByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT ri.*, o.order_date_time 
       FROM restaurant_invoices ri
       JOIN orders o ON ri.order_id = o.order_id
       WHERE o.restaurant_id = ?`,
      [restaurantId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).send("Internal Server Error");
  }
};

