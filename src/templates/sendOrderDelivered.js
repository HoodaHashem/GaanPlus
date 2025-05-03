const sendOrderDeliveredData = async (order) => {
  let itemsList = "";

  order.orderItems.forEach((item) => {
    itemsList += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${
          item.quantity
        }x ${item.menuItemId.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.menuItemId.price.toFixed(
          2
        )}</td>
      </tr>
    `;
  });
  const emailHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Delivered #${order.id}</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
      .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
      .content { padding: 20px; }
      .order-details { margin-bottom: 20px; }
      .customer-info { margin-bottom: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
      .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      .total-row { font-weight: bold; background-color: #f1f1f1; }
      .delivery-details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
      .instructions { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
      .footer { background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 0.8em; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>ORDER DELIVERED #${order.id}</h1>
    </div>
    
    <div class="content">
      <div class="customer-info">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${order.userId.firstName} ${
    order.userId.lastName
  }</p>
        <p><strong>Email:</strong> ${order.userId.email}</p>
      </div>
      
      <div class="order-details">
        <h3>Order Items</h3>
        <table class="items-table">
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Item</th>
            <th style="text-align: right; padding: 8px; border-bottom: 2px solid #ddd;">Price</th>
          </tr>
          ${itemsList}

          <tr class="total-row">
            <td style="padding: 8px; border-bottom: none;"><strong>TOTAL</strong></td>
            <td style="padding: 8px; border-bottom: none; text-align: right;"><strong>$${order.totalPrice.toFixed(
              2
            )}</strong></td>
          </tr>
        </table>
      </div>
      <div class="delivery-details">
        <h3>Delivery Details</h3>
        <p><strong>Address:</strong> ${order.deliveryAddress}</p>
        <p><strong>Instructions:</strong> ${
          order.deliveryInstructions || "None"
        }</p>
      </div>
      <p style="text-align: center;"><strong>Your order has been delivered!</strong></p>
    </div>
    <div class="footer">
      <p>Thank you,<br>Gaan Plus Team</p>
    </div>
  </body>
  </html>
  `;
  const emailText = `
ORDER DELIVERED #${order.id}
Customer: ${order.userId.firstName} ${order.userId.lastName}
Email: ${order.userId.email}
ITEMS:
${order.orderItems
  .map(
    (item) =>
      `- ${item.quantity}x ${
        item.menuItemId.name
      } - $${item.menuItemId.price.toFixed(2)}`
  )
  .join("\n")}
TOTAL: $${order.totalPrice.toFixed(2)}
DELIVERY DETAILS:
Address: ${order.deliveryAddress}
Instructions: ${order.deliveryInstructions || "None"}
Your order has been delivered!
Thank you,
Gaan Plus Team
  `;

  return { emailHtml, emailText };
};

export default sendOrderDeliveredData
