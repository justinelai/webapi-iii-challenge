const express = require('express')

const router = express.Router()

router.use(express.json())

const Users = require('./userDb.js')

// ========================= POST /users ========================= working!
router.post('/', validateUser, (req, res) => {  
    Users.insert(req.body)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        err.code ===  "SQLITE_CONSTRAINT" ? res.status(400).json({ errorMessage: "Name must be unique." })
        : res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
});

// ========================= POST /users/:id/posts =========================

router.post('/:id/posts', (req, res) => {
    const {text} = req.body;
    const newComment = {...req.body, "user_id": req.params.id }
    if (!text) {
        res.status(400).json({ errorMessage: "Please provide text for the post." })
    } else {
        Users.insertComment(newComment)
           /*  .then(inserted => 
                {
                    Posts.findCommentById(inserted.id).then(fullComment => res.status(201).json((fullComment)))
                })
            .catch(err => res.status(500).json({ error: "There was an error while saving the post to the database" })) */
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

// ========================= GET /users/:id ========================= working! REFACTORED!
router.get('/:id', validateUserId, (req, res) => {
    Users.getById(req.user)
        .then(u => {
            res.status(200).json(u)
        })
        .catch(err => {
            res.status(500).json({ error: "The user information could not be retrieved." })
    })
})

// ========================= GET /users/:id/posts ========================= working!

router.get('/:id/posts', validateUserId, (req, res) => {
    Users.getUserPosts(req.params.id)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({ error: "The user post information could not be retrieved" })
    })
});

// ========================= DELETE /users/:id ========================= working!

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id
    Users.remove(id)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json({ error: "The user could not be removed" })
    })
});

// ========================= PUT /users/:id ========================= 

router.put('/:id', [validateUserId, validateUser], (req, res) => {
    Users.update(req.user, req.body)
    .then(result => {
            Users.getById(result.id)
            .then(u => res.status(200).json(u))
            .catch(err => res.status(500).json({ error: "There was an error while saving the user to the database" }))
    })
    .catch(err => {
        err.code ===  "SQLITE_CONSTRAINT" ? res.status(400).json({ errorMessage: "Name must be unique." })
        : res.status(500).json({ error: "There was an error while saving the user to the database" })
    })
    });

// ========================= CUSTOM MIDDLEWARE ========================= 

function validateUserId(req, res, next) {
    Users.getById(req.params.id)
        .then(u => {
            if (u) {
                req.user = req.params.id
                next();
            } else {res.status(400).json({ message: "invalid user id" })}

        })
        .catch(err => {
            res.status(500).json({ error: "The user information could not be retrieved." })
    })
};

function validateUser(req, res, next) {
    if (!req.body.name) {
        res.status(400).json({ message: "missing required name field"  })
    } else if (!req.body){
        res.status(400).json({ message: "missing user data"  })
    }
    else { 
        next()
    }}

function validatePost(req, res, next) {

};

module.exports = router;
