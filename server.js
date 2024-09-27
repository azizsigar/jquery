/*
Create	Given a title and content, create a new post	POST	/blogs
Read One	Given a title, return the content of a single post	GET	/blogs/
Update	Given a title and content, update an existing post	PUT	/blogs/
Delete	Given a title, delete an existing post	DELETE	/blogs/
Read All	Return the titles of all existing posts	GET	/blogs
*/
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json()); // To parse JSON bodies

const PORT = 3000;

// 1.1 Creating new posts


app.post("/blogs", (req, res) => {
const { title, content } = req.body;
if (!title || !content) {
    return res.status(400).send("Title and content are required.");
}
    //enhanced by try catch block
try {
    fs.writeFileSync(path.join(__dirname, title), content);
    res.send("ok");
} catch (error) {
    res.status(500).send("An error occurred while creating the post.");
}
});

// 1.2 Updating existing posts
app.put("/blogs/:title", (req, res) => {
const title = req.params.title;
const { content } = req.body;
if (!content) {
    return res.status(400).send("Content is required.");
}
try {
    if (fs.existsSync(path.join(__dirname, title))) {
        fs.writeFileSync(path.join(__dirname, title), content);
        res.send("ok");
    } else {
        res.status(404).send("This post does not exist!");
    }
} catch (error) {
    res.status(500).send("An error occurred while updating the post.");
}
});

// 1.3 Deleting posts
app.delete("/blogs/:title", (req, res) => {
try {
    const title = req.params.title;
    const filePath = path.join(__dirname, title);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.send("ok");
    } else {
        res.status(404).send("This post does not exist!");
    }
} catch (error) {
    res.status(500).send("An error occurred while deleting the post.");
}
});

// 1.4 Reading posts
app.get("/blogs/:title", (req, res) => {
const title = req.params.title;
try {
    const filePath = path.join(__dirname, title);
    if (fs.existsSync(filePath)) {
        const post = fs.readFileSync(filePath, "utf-8");
        res.send(post);
    } else {
        res.status(404).send("This post does not exist!");
    }
} catch (error) {
    res.status(500).send("An error occurred while reading the post.");
}
});

// Bonus: Reading all posts
app.get("/blogs", (req, res) => {
try {
    const files = fs.readdirSync(__dirname);
    const posts = files
        .filter((file) => file.endsWith(".txt"))
        .map((file) => ({ title: file }));
    res.json(posts);
} catch (err) {
    res.status(500).send("Error reading files.");
}
});
// 1.5 Searching posts by keyword its optional 

app.get("/blogs/search/:keyword", (req, res) => {
    const keyword = req.params.keyword.toLowerCase();
    try {
        const files = fs.readdirSync(__dirname);
        const matchingPosts = files
            .filter((file) => file.endsWith(".txt"))
            .filter((file) => {
                const content = fs.readFileSync(path.join(__dirname, file), "utf-8").toLowerCase();
                return content.includes(keyword) || file.toLowerCase().includes(keyword);
            })
            .map((file) => ({ title: file }));
        res.json(matchingPosts);
    } catch (err) {
        res.status(500).send("Error searching files.");
    }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
