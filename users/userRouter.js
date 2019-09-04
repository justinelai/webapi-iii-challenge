const express = require('express')
const router = express.Router()
router.use(express.json())


const Users = require('./userDb.js')
const Posts = require('../posts/postDb.js')



// ========================= POST /users ========================= DONE!
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

router.post('/:id/posts', [validateUserId, validatePost], (req, res) => {
    const newPost = req.body
    newPost.user_id = req.params.id
    Posts.insert(newPost)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
});

// ========================= GET /users ========================= DONE!

router.get('/', (req, res) => {
    Users.get()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({ error: "The user information could not be retrieved." })
    })
})

// ========================= GET /users/:id ========================= DONE!
router.get('/:id', validateUserId, (req, res) => {
    Users.getById(req.user)
        .then(u => {
            res.status(200).json(u)
        })
        .catch(err => {
            res.status(500).json({ error: "The user information could not be retrieved." })
    })
})

// ========================= GET /users/:id/posts ========================= DONE unless it needs a posts refactor (stretch)

router.get('/:id/posts', validateUserId, (req, res) => {
    Users.getUserPosts(req.params.id)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({ error: "The user post information could not be retrieved" })
    })
});

// ========================= DELETE /users/:id ========================= DONE

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id
    Users.remove(id)
    .then(user => {
        res.status(200).json({ error: "Delete successful!" })
    })
    .catch(err => {
        res.status(500).json({ error: "The user could not be removed" })
    })
});

// ========================= PUT /users/:id ========================= DONE!

router.put('/:id', [validateUserId, validateUser], (req, res) => {
    Users.update(req.user, req.body)
    .then(result => {
            Users.getById(req.user)
            .then(u => res.status(200).json(u))
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
                console.log("validateUserId passed")
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
        console.log("validateUser passed")
        next()
    }}

function validatePost(req, res, next) {
    if (!req.body.text) {
        res.status(400).json({ message: "missing required text field" })
    } else if (!req.body){
        res.status(400).json({ message: "missing post data" })
    }
    else { 
        console.log("validatePost passed")
        next()
    }
};

module.exports = router;
