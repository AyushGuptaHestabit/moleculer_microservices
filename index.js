const { ServiceBroker } = require("moleculer");
const HTTPServer = require("moleculer-web");
const notificationsService = require("./services/notifications.service");
const usersService = require('./services/users.service');


// Create the broker for node-1
// Define nodeID and set the communication bus
const brokerNode1 = new ServiceBroker({
    nodeID: "node-1",
    transporter: "NATS"
});

// Create the "gateway" service
brokerNode1.createService({
    // Define service name
    name: "gateway",
    // Load the HTTP server
    mixins: [HTTPServer],

    settings: {
        routes: [
            {
                aliases: {
                    // When the "GET /products" request is made the "listProducts" action of "products" service is executed
                    "POST /login": "users.login",
                    "POST /register": "users.register",
                    "PUT /approveTeacher/:teacherId": "users.approveTeacher",
                    "PUT /approveStudent/:studentId": "users.approveStudent",
                    "PUT /assignTeacher/": "users.assignTeacher",
                    "PUT /updateDataTeacher/:id": "users.updateDataTeacher",
                    "PUT /updateDataStudent/:id": "users.updateDataStudent",
                    "GET /newStudents": "users.newStudents",
                    "GET /newTeachers": "users.newTeachers",
                    "GET /notifications/:id": "notifications.list",
                }
            }
        ]
    }
});

// Create the broker for node-2
// Define nodeID and set the communication bus
const brokerNode2 = new ServiceBroker({
    nodeID: "node-2",
    transporter: "NATS"
});

// Create the "products" service
brokerNode2.createService(notificationsService);

// Create the broker for node-3
// Define nodeID and set the communication bus
const brokerNode3 = new ServiceBroker({
    nodeID: "node-3",
    transporter: "NATS"
});

// Create the "products" service
brokerNode3.createService(usersService);

// Start both brokers
Promise.all([brokerNode1.start(), brokerNode2.start(), brokerNode3.start()]);