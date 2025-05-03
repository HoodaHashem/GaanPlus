const sendOrderRejectedByRestaurantData = (order) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Rejected #${order.id}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 0.8em; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>ORDER REJECTED #${order.id}</h1>
      </div>
      
      <div class="content">
        <p>Dear ${order.userId.firstName},</p>
        <p>We regret to inform you that your order has been rejected by the restaurant.</p>
        <p>If you have any questions, please contact our support team.</p>
      </div>
      
      <div class="footer">
        <p>Thank you,<br>Gaan Plus Team</p>
      </div>
    </body>
    </html>
    `;

  const emailText = `
  ORDER REJECTED #${order.id}
  Dear ${order.userId.firstName},
  We regret to inform you that your order has been rejected by the restaurant.
  If you have any questions, please contact our support team.
  Thank you,
  Gaan Plus Team
    `;
  return {
    html: emailHtml,
    text: emailText,
  };
};

export default sendOrderRejectedByRestaurantData;
