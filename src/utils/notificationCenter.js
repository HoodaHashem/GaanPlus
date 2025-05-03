import nodemailer from "nodemailer";
import sendOrderToRestaurantData from "../templates/sendOrderToRestaurant.js";
import sendOrderToUserData from "../templates/sendOrderToUser.js";
import sendOrderOutForDeliveryData from "../templates/sendOrderOutForDelivery.js";
import sendOrderDeliveredData from "../templates/sendOrderDelivered.js";
import sendOrderCancelledData from "../templates/sendOrderCancelled.js";
import sendOrderRejectedByRestaurantData from "../templates/sendOrderRejected.js";
import "dotenv/config";

class NotificationCenter {
  constructor(config) {

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || config.host,
      port: process.env.EMAIL_PORT || config.port,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || config.user,
        pass: process.env.EMAIL_PASS || config.pass,
      },
    });
    this.senderEmail = "orders@gaanplus.com" || config.senderEmail;
    this.appName = "Gaan Plus" || config.appName;
  }

  async sendOrderToRestaurant(order) {
    const restaurantEmail = order.restaurantId.email;
    const subject = `${this.appName} - New Order Received #${order.id}`;
    const data = sendOrderToRestaurantData(order);
    const emailText = data.text;
    const emailHtml = data.html;

    try {
      const info = await this.transporter.sendMail({
        from: `"${this.appName}" <${this.senderEmail}>`,
        to: restaurantEmail,
        subject: subject,
        text: emailText,
        html: emailHtml,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendOrderToUser(order) {
    const userEmail = order.userId.email;
    const subject = `${this.appName} - Order Confirmation #${order.id}`;
    const data = sendOrderToUserData(order)
    const emailText = data.text;
    const emailHtml = data.html;

    try {
      const info = await this.transporter.sendMail({
        from: `"${this.appName}" <${this.senderEmail}>`,
        to: userEmail,
        subject: subject,
        text: emailText,
        html: emailHtml,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendOrderOutForDelivery(order) {
    const userEmail = order.userId.email;
    const subject = `${this.appName} - Order Out for Delivery #${order.id}`;
    const data = sendOrderOutForDeliveryData(order)
    const emailText = data.text;
    const emailHtml = data.html;

    try {
      const info = await this.transporter.sendMail({
        from: `"${this.appName}" <${this.senderEmail}>`,
        to: userEmail,
        subject: subject,
        text: emailText,
        html: emailHtml,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async sendOrderDelivered(order) {
    const userEmail = order.userId.email;
    const subject = `${this.appName} - Order Delivered #${order.id}`;
    const data = sendOrderDeliveredData(order)
    const emailText = data.text;
    const emailHtml = data.html;

    try {
      const info = await this.transporter.sendMail({
        from: `"${this.appName}" <${this.senderEmail}>`,
        to: userEmail,
        subject: subject,
        text: emailText,
        html: emailHtml,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendOrderCancelledToUser(order) {
    const userEmail = order.userId.email;
    const subject = `${this.appName} - Order Cancelled #${order.id}`;
    const data = sendOrderCancelledData(order)
    const emailText = data.text;
    const emailHtml = data.html;

    try {
      const info = await this.transporter.sendMail({
        from: `"${this.appName}" <${this.senderEmail}>`,
        to: userEmail,
        subject: subject,
        text: emailText,
        html: emailHtml,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async sendOrderCancelledToRestaurant(order) {
    const restaurantEmail = order.restaurantId.email;
    const subject = `${this.appName} - Order Cancelled #${order.id}`;
    const data = sendOrderCancelledData(order)
    const emailText = data.text;
    const emailHtml = data.html;

    try {
      const info = await this.transporter.sendMail({
        from: `"${this.appName}" <${this.senderEmail}>`,
        to: restaurantEmail,
        subject: subject,
        text: emailText,
        html: emailHtml,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendOrderRejected(order) {
    const userEmail = order.userId.email;
    const subject = `${this.appName} - Order Rejected #${order.id}`;
    const data = sendOrderRejectedByRestaurantData(order)
    const emailText = data.text;
    const emailHtml = data.html;

    try {
      const info = await this.transporter.sendMail({
        from: `"${this.appName}" <${this.senderEmail}>`,
        to: userEmail,
        subject: subject,
        text: emailText,
        html: emailHtml,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default NotificationCenter;
