"""API for comments."""
from flask import abort, request, session, jsonify
import insta485

@insta485.app.route('/api/v1/comments/', methods=['POST'])
def post_comment():
    """Add a comment to a post."""
    connection = insta485.model.get_db()
    logname = session['username']

    postid = request.args.get('postid')
    text = request.json['text']
    connection.execute(
        "INSERT INTO comments(owner, postid, text) "
        "VALUES "
        "(?, ?, ?)",
        (logname, postid, text,)
    )
    commentid = connection.execute(
        "SELECT last_insert_rowid() "
        "FROM comments "
    ).fetchone()['last_insert_rowid()']

    context = {
        "commentid": commentid,
        "lognameOwnsThis": True,
        "owner": logname,
        "ownerShowUrl": "/users/{}/".format(logname),
        "text": text,
        "url": "/api/v1/comments/{}/".format(commentid)
    }
    
    return jsonify(**context), 201


@insta485.app.route('/api/v1/comments/<commentid>/', methods=['DELETE'])
def delete_comment(commentid):
    """Delete a comment."""
    connection = insta485.model.get_db()
    logname = session['username']

    cursor = connection.execute(
        "SELECT owner "
        "FROM comments "
        "WHERE commentid = ?",
        (commentid,)
    )
    owner = cursor.fetchone()
    if not owner:
        abort(404)
    elif owner['owner'] != logname:
        abort(403)

    cursor = connection.execute(
        "SELECT owner "
        "FROM comments "
        "WHERE commentid = ?",
        (commentid,)
    )

    return '', 204