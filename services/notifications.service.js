const notificationModel = require('../model/notification');

module.exports = {
    // Define service name
    name: "notifications",

    actions: {
        // Define service action that returns the available products
        async list(req) {
            const notifications = await notificationModel.find({ userId: req.params.id });
            return notifications;
        }
    }
}