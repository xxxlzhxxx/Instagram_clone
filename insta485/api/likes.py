"""API for likes operations."""
from flask import abort, session
import insta485


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