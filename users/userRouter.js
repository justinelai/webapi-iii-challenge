const express = require('express')

const router = express.Router()

router.use(express.json())

const Users = require('./userDb.js')

// ========================= POST /users ========================= working!
router.post('/', (req, res) => {
    const {name} = req.body;
    if (!name) {
        res.status(400).json({ errorMessage: "Please provide a name." })
    } else { 
        Users.insert(req.body)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        err.code ===  "SQLITE_CONSTRAINT" ? res.status(400).json({ errorMessage: "Name must be unique." })
        : res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
}
});

router.post('/:id/posts', (req, res) => {
    const {text} = req.body;
    const newComment = {...req.body, "user_id": req.params.id }
    if (!text) {
        res.status(400).json({ errorMessage: "Please provide text for the post." })
    } else {
        Users.insertComment(newComment)
            .then(inserted => 
                {
                    Posts.findCommentById(inserted.id).then(fullComment => res.status(201).json((fullComment)))
                })
            .catch(err => res.status(500).json({ error: "There was an error while saving the post to the database" }))
    }
});

// ========================= GET /users ========================= working!
router.get('/', (req, res) => {
    Users.get()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({ error: "The user information could not be retrieved." })
    })
})

// ========================= GET /users/:id ========================= working!
router.get('/:id', (req, res) => {
    const id = req.params.id
    Users.getById(id)
    .then(u => {
        u ? res.status(200).json(u) : res.status(404).json({ message: "The user with the specified ID does not exist." })
    })
    .catch(err => {
        res.status(500).json({ error: "The user information could not be retrieved." })
    })
})

// ========================= GET /users/:id/posts ========================= working!

router.get('/:id/posts', (req, res) => {
    Users.getUserPosts(req.params.id)
    .then(result => {
        result.length ? res.status(200).json(result) : res.status(404).json({ message: "The user with the specified ID does not exist." })
    })
    .catch(err => {
        res.status(500).json({ error: "The user post information could not be retrieved" })
    })
});

// ========================= DELETE /users/:id ========================= working!

router.delete('/:id', (req, res) => {
    const id = req.params.id
    Users.remove(id)
    .then(user => {
        user ? res.status(200).json(user) : res.status(404).json({ message: "The user with the specified ID does not exist." })
    })
    .catch(err => {
        res.status(500).json({ error: "The user could not be removed" })
    })
});

router.put('/:id', (req, res) => {
    const {name} = req.body;
    if (!name) {
        res.status(400).json({ errorMessage: "Please provide name for the user." })
    } else {
        Users.update(req.params.id, req.body)
    .then(result => {
        result.length ?
        Users.getById(id).then(u => res.status(201).json(u)) :
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    })
    .catch(err => {
        res.status(500).json({ error: "There was an error while updating the user to the database" })
    })
    }
    
});

//custom middleware

function validateUserId(req, res, next) {

};

function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;
