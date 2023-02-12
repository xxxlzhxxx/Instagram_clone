"""API for likes operations."""
import flask
from flask import abort, session
import insta485
from insta485 import utils

@insta485.app.route('/api/v1/likes/', methods=['POST'])
def add_like(likeid):
    """create a new like with the specific postid"""
    message, user_name = utils.authenicate()
    if not user_name:
        return flask.jsonify(message), 403

    postid = flask.request.args.get('postid', type=int)
    connection = insta485.model.get_db()
    # check if the postid is valid
    cursor = connection.execute(
        "SELECT postid FROM posts WHERE postid = ?", (postid,)
    )
    if not cursor.fetchone():
        return flask.jsonify({"message": "Post not found"}), 404


    connection.execute(
        "INSERT INTO likes(owner, postid) " +
        "VALUES (?, ?)", (user_name, postid)
    )

    cursor = connection.execute(
        "SELECT owner "
        "FROM likes "
        "WHERE likeid = ?",
        (likeid,)
    )

    owner = cursor.fetchone()

    if not owner:
        abort(404)
    elif owner['owner'] != logname:
        abort(403)

    connection.excute(
        "DELETE "
        "FROM likes "
        "WHERE likeid = ?",
        (likeid,)
    )
    return '', 204


@insta485.app.route('/api/v1/likes/<likeid>/', methods=['DELETE'])
def delete_like(likeid):
    """Delete the like with the specific likeid"""

    connection = insta485.model.get_db()
    logname = session['username']

    cursor = connection.execute(
        "SELECT owner "
        "FROM likes "
        "WHERE likeid = ?",
        (likeid,)
    )

    owner = cursor.fetchone()

    if not owner:
        abort(404)
    elif owner['owner'] != logname:
        abort(403)

    connection.excute(
        "DELETE "
        "FROM likes "
        "WHERE likeid = ?",
        (likeid,)
    )

    return '', 204
