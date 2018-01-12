var mysql      = require('mysql');
var express   = require('express');
var dbconfig   = require('../../config/database');

var connection = mysql.createConnection(dbconfig.connection);

var app       = express();
var router    = express.Router();

connection.query(`USE ${dbconfig.database}`);
console.log('conn-entites', dbconfig.database);

router.get('/posts', (req, res) => {
    console.log('get all the posts');
    connection.query(`SELECT posts.id, posts.title, posts.subtitle, posts.dateCreate, posts.text, posts.excerpt, posts.userId,
    (SELECT COUNT(*) FROM comments WHERE posts.id = comments.postId AND comments.isDeleted = 0) AS comments
    FROM posts ORDER BY posts.dateCreate DESC`, (err, rows) => {
        if (err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        res.send(rows);
        return;
    });
});

router.post('/posts', (req, res) => {
    const perPage = req.body.count;
    const offset = perPage * req.body.page;
    connection.query(`SELECT posts.id, posts.title, posts.subtitle, posts.dateCreate, posts.text, posts.excerpt, posts.userId,
    (SELECT COUNT(*) FROM comments WHERE posts.id = comments.postId AND comments.isDeleted = 0) AS comments
    FROM posts ORDER BY posts.dateCreate DESC LIMIT ${perPage} OFFSET ${offset}`, (err, rows) => {
        if (err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        res.send(rows);
        return;
    });
});

router.get('/posts/count', (req, res) => {
    connection.query(`SELECT COUNT(posts.id) as count FROM posts`, (err, rows) => {
        if (err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        res.send(rows);
        return;
    });
});

router.post('/post', (req, res) => {
    const postInsert = req.body;
    const query = `INSERT INTO posts (title, subtitle, text, dateCreate, dateUpdate, userId, excerpt)
    VALUES ("${postInsert.title}", "${postInsert.subtitle}", "${postInsert.text}", ${postInsert.dateCreate}, ${postInsert.dateUpdate}, ${postInsert.userId}, "${postInsert.excerpt}")`;
    connection.query(query, (err, rows) => {
        if (err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        if(rows) {
            let tags = postInsert.tags;
            for(let i = 0; i < tags.length; i++) {
                addTag(tags[i], postInsert.id, (idTag) => {  
                    addPostTag(idTag, rows.insertId);                
                })
            }
            res.status(200).send((rows.insertId).toString());
            return;
        }
    });
});

router.get('/post/:id', (req, res) => {
    const postQuery = `SELECT posts.id, posts.title, posts.subtitle, posts.dateCreate, posts.text, posts.userId, users.name, users.surname
    FROM posts
    INNER JOIN users ON posts.userId = users.id
    WHERE posts.id = ${req.params.id}`;
    let tagsArray = [];
    connection.query(postQuery, (err, rows) => {
        if(err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        if(rows.length) {
            const tagQuery = `SELECT tags.name
            FROM tags
            INNER JOIN tagsinpost ON tags.id = tagsinpost.tagId
            INNER JOIN posts ON posts.id = tagsinpost.postId
            WHERE posts.id = ${req.params.id}`;
            connection.query(tagQuery, (err, tagRows) => {
                if(err) {
                    let answer = getAnswer(false, 500, 'Some error in the sql-query');
                    res.send(answer);
                    return;
                }
                if(tagRows.length) {
                    tagRows.forEach(element => {
                        tagsArray.push(element.name);
                    });
                    let answer = {
                        id: rows[0].id,
                        title: rows[0].title,
                        subtitle: rows[0].subtitle,
                        dateCreate: rows[0].dateCreate,
                        text: rows[0].text,
                        tags: tagsArray,
                        authorName: rows[0].name,
                        authorSurname: rows[0].surname,
                        userId: rows[0].userId
                    }
                    res.status(200).send(answer);
                }
            })
            
        }
    });
});

router.put('/post/:id', (req, res) => {
    const post = req.body;
    const postQuery = `UPDATE posts
    SET title = "${post.title}", subtitle = "${post.subtitle}", text = "${post.text}", dateUpdate = ${post.dateUpdate}, excerpt = "${post.excerpt}"
    WHERE id = ${post.id}`;
    connection.query(postQuery, (err, rows) => {
        if(err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        deleteOldTags(post.tags, post.id, () => {
            let tags = post.tags;
            for(let i = 0; i < tags.length; i++) {
                addTag(tags[i], post.id, (idTag) => {  
                    addPostTag(idTag, post.id);                
                })
            }
        });
        res.status(200).send((post.id).toString());
    })
});

router.delete('/post/:id', (req, res) => {
    const id = req.params.id;
    const queryDelete = `DELETE FROM posts WHERE id = ${id}`;
    connection.query(queryDelete, (err, rows) => {
        if(err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        if(rows) {
            const message = {
                status: 'success'
            }
            res.send(message);
        }
    })
})

router.get('/tags', (req, res) => {
    const queryTags = `SELECT tags.name, COUNT(tagsinpost.tagId) AS countTagsId
    FROM tagsinpost INNER JOIN tags ON tags.id = tagsinpost.tagId
    GROUP BY tagId
    ORDER BY countTagsId DESC
    LIMIT 10`;
    connection.query(queryTags, (err, rows) => {
        if (err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        if (rows) {
            res.send(rows);
        }
    })
})

router.get('/posts/:tag/count', (req, res) => {
    const tag = req.params.tag;
    console.log('tag', tag);
    connection.query(`SELECT COUNT(tagsinpost.tagId) as count
    FROM posts INNER JOIN tagsinpost ON posts.id = tagsinpost.postId
    WHERE tagsinpost.tagId IN (SELECT id FROM tags WHERE name = '${tag}')`, (err, rows) => {
        if (err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        console.log(rows);
        res.status(200).json(rows);
    });
});

router.post('/tag/:tag', (req, res) => {
    const tag = req.params.tag;
    const perPage = req.body.count;
    const offset = perPage * req.body.page;
    const queryPostTag = `SELECT 
                        posts.id,
                        posts.title,
                        posts.subtitle,
                        posts.text,
                        posts.dateCreate,
                        posts.dateUpdate,
                        posts.userId,
                        posts.excerpt,
                        tagsinpost.tagId,
                        (SELECT COUNT(*) FROM comments WHERE posts.id = comments.postId) AS comments
                    FROM
                        posts INNER JOIN tagsinpost ON posts.id = tagsinpost.postId
                    WHERE
                        tagsinpost.tagId IN (SELECT id FROM tags WHERE name = '${tag}')
                    LIMIT ${perPage} OFFSET ${offset}`;
    connection.query(queryPostTag, (err, rows) => {
        if (err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        if (rows) {
            res.send(rows);
        }
    })
})

router.post('/comment', (req, res) => {
    const comment = req.body;
    console.log('comment', comment);
    const queryComment = `INSERT INTO creative.comments(text, dateCreate, dateUpdate, postId, userId, previousId) VALUES ("${comment.text}", ${comment.dateCreate}, ${comment.dateUpdate}, ${comment.postId}, ${comment.userId}, ${comment.previousId});`
    connection.query(queryComment, (err, rows) => {
        if(err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        if(rows) {
            res.send(rows);
        }
    })
})

router.get('/:id/comments', (req, res) => {
    const postId = req.params.id;
    const queryComments = `SELECT comments.id, comments.text, comments.dateUpdate, comments.userId, comments.postId, users.name as 'author', comments.previousId, comments.isDeleted
    FROM comments
    INNER JOIN users ON comments.userId = users.id
    INNER JOIN posts ON comments.postId = posts.id
    WHERE postId = ${postId}`;
    connection.query(queryComments, (err, rows) => {
        if(err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        if(rows) {
            res.send(rows);
        }
    })
})

router.delete('/comment/:id', (req, res) => {
    const commentId = req.params.id;
    const queryDeleteComment = `UPDATE comments
    SET isDeleted = 1
    WHERE id = ${commentId}`;
    connection.query(queryDeleteComment, (err, rows) => {
        if(err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        if(rows.affectedRows) {
            res.send({status: 'success'});
        }
    });
})

function addTag(tag, postId, callback) {
    let tagQuery = `INSERT INTO tags (name) VALUE ('${tag}')`;
    let resultId = 0;
    connection.query(tagQuery, (err, rows) => {
        if(err) {
            connection.query(`SELECT id from tags WHERE name = '${tag}'`, (err, rows) => {
                if(err) {
                    let answer = getAnswer(false, 500, 'Some error in the sql-query');
                    res.send(answer);
                    return;
                }
                if(rows) {
                    resultId = rows[0].id;

                    callback(resultId);
                }
            });
        }
        if(rows) {
            resultId = rows.insertId;
            callback(resultId);
        }
    });
}

function addPostTag(idTag, postId) {
    let insertTagPost = `INSERT INTO tagsinpost(tagId, postId) VALUES (${idTag}, ${postId})`;
    connection.query(insertTagPost, (err, rows) => {
        if(err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        if(rows) {
            return rows;
        }
    });
}

function deleteOldTags(tags, postId, callback) {
    let deleteTagsQuery = `DELETE from tagsinpost WHERE postId = ${postId}`;
    connection.query(deleteTagsQuery, (err, rows) => {
        if(err) {
            let answer = getAnswer(false, 500, 'Some error in the sql-query');
            res.send(answer);
            return;
        }
        if(rows.affectedRows) {
            callback();
        }
    });
}

function getAnswer(status, statusCode, message) {
    if (!message.length) {
        return {status, statusCode, message : 'unknown reasons'};
    }
    return { status, statusCode, message };
}

module.exports = router;