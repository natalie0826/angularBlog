var mysql      = require('mysql');
var express   = require('express');
var dbconfig   = require('../../config/database');

var connection = mysql.createConnection(dbconfig.connection);

var app       = express();
var router    = express.Router();

connection.query(`USE ${dbconfig.database}`);
console.log('conn-entites', dbconfig.database);

router.get('/posts', (req, res) => {
    connection.query('SELECT id, title, subtitle, dateCreate, text, excerpt FROM posts', (err, rows) => {
        if (err) {
            res.status(500).json(err);
        } else if (rows.length) {
            res.status(200).json(rows);
        }
    })
});

router.post('/post', (req, res) => {
    const postInsert = req.body;
    const query = `INSERT INTO posts (title, subtitle, text, dateCreate, dateUpdate, userId, excerpt)
    VALUES ("${postInsert.title}", "${postInsert.subtitle}", "${postInsert.text}", ${postInsert.dateCreate}, ${postInsert.dateUpdate}, ${postInsert.userId}, '${postInsert.excerpt}')`;
    connection.query(query, (err, rows) => {
        if (err) {
            console.log('err', err);
            res.status(500).json(err);
        } else {
            let postId = rows.insertId;
            console.log('postId', postId);
            let tagsIds = [];
            let tags = postInsert.tags;
            tags.forEach(element => {
                let tag = element;
                let tagQuery = `INSERT INTO tags (name) VALUE ('${tag}')`;
                connection.query(tagQuery, (err, rows) => {
                    if(err) {
                        connection.query(`SELECT id from tags WHERE name = '${tag}'`, (err, rows) => {
                            if(err) {
                                console.log('err', err);
                                res.status(500).json(err);
                            }
                            tagsIds.push(rows[0].id);
                            if (tagsIds.length === tags.length) {
                                addTags(tagsIds, postId);
                            }
                        });
                    } else {
                        tagsIds.push(rows.insertId);
                        if (tagsIds.length === tags.length) {
                            addTags(tagsIds, postId);
                        }
                    }
                });
            });
        }
    });    
});

router.get('/post/:id', (req, res) => {
    console.log('in the get function');
    const postQuery = `SELECT posts.id, posts.title, posts.subtitle, posts.dateCreate, posts.text, users.name, users.surname
    FROM posts
    INNER JOIN users ON posts.userId = users.id WHERE posts.id = ${req.params.id}`;
    console.log('postQuery', postQuery);
    connection.query(postQuery, (err, rows) => {
        console.log('in the function');
        if(err) {
            res.status(500).json(err);
        }
        if(rows.length){
            let answer = {
                id: rows[0].id,
                title: rows[0].title,
                subtitle: rows[0].subtitle,
                dateCreate: rows[0].dateCreate,
                text: rows[0].text,
                authorName: rows[0].name,
                authorSurname: rows[0].surname
            }
            console.log(answer);
            res.status(200).send(answer);
        }
    });
});

function addTags(tagsIds, postId) {
    let insertTagsForPost = `INSERT INTO tagsinpost(tagId, postId) VALUES`;
    tagsIds.forEach(id => {
        insertTagsForPost += ` (${id}, ${postId}),`;
    });
    insertTagsForPost = insertTagsForPost.slice(0, insertTagsForPost.length - 1);
    connection.query(insertTagsForPost, (err, rows) => {
        if(err) {
            res.status(500).json(err);
        }
    });
}

module.exports = router;