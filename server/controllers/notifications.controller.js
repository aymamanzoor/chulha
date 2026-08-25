import { Notification, User } from "../models/index.js";

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { recipientId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 50,
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "username", "emoji"],
        },
      ],
    });

    const formatted = notifications.map((n) => {
      const json = n.toJSON();
      json.user = json.sender;
      json.time = "Just now";
      return json;
    });

    return res.json({ notifications: formatted });
  } catch (error) {
    next(error);
  }
};

export const markNotificationsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { recipientId: req.user.id } }
    );
    return res.json({ message: "All notifications marked as read." });
  } catch (error) {
    next(error);
  }
};
