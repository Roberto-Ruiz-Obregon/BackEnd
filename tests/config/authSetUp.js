const Admin = require('../../models/admins.model');
const User = require('../../models/users.model');

// Will set authorization headder to agent based on email and password
const loginUser = async (agent, email, password) => {
    const res = await agent
        .post('/v1/user/auth/login')
        .send({ email, password });

    const token = res.body.token;

    const authHeader = { Authorization: `Bearer ${token}` };

    // Attach the authorization header to the agent object
    agent.set(authHeader);
};

// Will set authorization headder to agent based on email and password
const loginAdmin = async (agent, email, password) => {
    const res = await agent
        .post('/v1/admin/auth/login')
        .send({ email, password });

    const token = res.body.token;

    const authHeader = { Authorization: `Bearer ${token}` };

    // Attach the authorization header to the agent object
    agent.set(authHeader);
};

module.exports = { loginUser, loginAdmin };
