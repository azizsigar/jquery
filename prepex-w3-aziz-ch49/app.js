import express from "express";
import bcrypt from "bcrypt";
import { getUserById, getUserByUsername, addUser } from "./users.js";
import jwt from "jsonwebtoken";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "defaultSecretKey";

app.use(express.json());
app.use(express.static("client"));

// User registration endpoint
app.post("/auth/signup", async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).send({ message: "Username and password are required!" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = addUser(username, hashedPassword);

    // Respond with the created user's id and username
    res.send({ id: user.id, username: user.username });
});

// User login endpoint
app.post("/auth/signin", async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).send({ message: "Username and password are required!" });
    }

    // Retrieve the user by username
    const user = getUserByUsername(username);

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // If the password is incorrect, respond with an error
    if (!isPasswordCorrect) {
        return res.status(400).send({ message: "Invalid credentials!" });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.status(201).send({ token });
});

// User profile endpoint
app.get("/auth/profile", (req, res) => {
    const authorization = req.headers.authorization;

    // Check if the authorization header is provided
    if (!authorization) {
        return res.status(401).send({ message: "JWT token is required!" });
    }

    try {
        // Extract the token from the authorization header
        const token = authorization.split(" ")[1];
        const verifiedUser = jwt.verify(token, JWT_SECRET);

        // Retrieve the user by id
        const user = getUserById(verifiedUser.id);

        // Respond with the user's username
        res.send({ message: user.username });
    } catch (error) {
        res.status(401).send({ message: "Invalid credentials!" });
    }
});

// User logout endpoint
app.post("/auth/signout", (req, res) => {
    const authorization = req.headers.authorization;

    // Check if the authorization header is provided
    if (!authorization) {
        return res.status(401).send({ message: "JWT token is required!" });
    }

    try {
        // Extract the token from the authorization header
        const token = authorization.split(" ")[1];
        jwt.verify(token, JWT_SECRET);
        res.status(204).end();
    } catch (error) {
        res.status(401).send({ message: "Invalid credentials!" });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
