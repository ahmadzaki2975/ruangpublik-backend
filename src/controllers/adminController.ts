import { Request, Response } from "express";

import Notification from "../models/notification";

const createBroadcastNotification = async (req: Request, res: Response) => {
  try {
    const payload = {
      sender: req.body.sender,
      threadId: req.body.threadId,
      type: req.body.type,
    };

    const notification = await Notification.create(payload);
    return res.status(201).json({ success: true, data: notification });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

export { createBroadcastNotification };
