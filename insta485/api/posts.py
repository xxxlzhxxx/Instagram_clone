"""REST API for posts."""
import flask
import insta485
from insta485 import utils


@insta485.app.route("/api/v1/", methods=["GET"])
def get_services():
    "return a list of services available"
    # Does not require user to be authenticated.
    context = {
        "comments": "/api/v1/comments/",
        "likes": "/api/v1/likes/",
        "posts": "/api/v1/posts/",
        "url": "/api/v1/",
    }
    return flask.jsonify(**context)


@insta485.app.route("/api/v1/posts/", methods=["GET"])
def get_post_list():
    """return 10 newest posts"""

    message, logname = utils.authenicate()
    if not logname:
        return flask.jsonify(message), 403

    results = []
    connection = insta485.model.get_db()
    logname = flask.session["username"]
    context = {"url": "/api/v1/p/"}

    size = flask.request.args.get("size", default=10, type=int)
    page = flask.request.args.get("post", default=0, type=int)
    postid_lte = flask.request.args.get("postid_lte", default=0, type=int)
    cur = connection.cursor()
    cur = connection.execute(
        " select postid from posts where owner=? or owner in "
        "(select username2 from following where username1=?) "
        "order by postid desc limit ? offset ?",
        (logname, logname, size + 1, size * page),
    )
    tmp = cur.fetchall()
    for t in tmp:
        record = {"postid": t["postid"], "url": "/api/v1/p/%d/" % t["postid"]}
        results.append(record)
    context["results"] = results
    if len(results) > size:
        context["results"] = results[:size]
        context["next"] = "/api/v1/p/?size=%d&page=%d" % (size, page + 1)
    else:
        context["results"] = results
        context["next"] = ""

    return flask.jsonify(**context)


@insta485.app.route("/api/v1/posts/<int:postid_url_slug>/")
def get_post(postid_url_slug):
    """Return post on postid.

    Example:
    {
      "created": "2017-09-28 04:33:28",
      "imgUrl": "/uploads/122a7d27ca1d7420a1072f695d9290fad4501a41.jpg",
      "owner": "awdeorio",
      "ownerImgUrl": "/uploads/e1a7c5c32973862ee15173b0259e3efdb6a391af.jpg",
      "ownerShowUrl": "/users/awdeorio/",
      "postShowUrl": "/posts/1/",
      "url": "/api/v1/posts/1/"
    }
    """
    message, logname = utils.authenicate()
    if not logname:
        return flask.jsonify(message), 403

    postid = postid_url_slug
    connection = insta485.model.get_db()
    context = {}
    context["url"] = "/api/v1/p/%d/" % postid
    context["post_show_url"] = "/p/%d/" % postid

    cur = connection.execute(" select * from comments " " where postid = ? ", (postid,))
    cmts = cur.fetchall()
    cur = connection.execute(" select * from posts " " where postid = ? ", (postid,))
    post_info = cur.fetchall()[0]
    cur = connection.execute(" select * from likes " " where postid = ? ", (postid,))
    likes = cur.fetchall()
    comments = []
    for cmt in cmts:
        temp = {
            "commentid": cmt["commentid"],
            "lognameOwnsThis": cmt["owner"] == logname,
            "owner": cmt["owner"],
            "ownerShowUrl": "/users/%s/" % cmt["owner"],
            "text": cmt["text"],
            "url": "/api/v1/comments/%d/" % cmt["commentid"],
        }
        comments.append(temp)

    lk = {"lognameLikesThis": False, "numLikes": len(likes), "url": None}
    for like in likes:
        if like["owner"] == logname:
            lk["lognameLikesThis"] = True
            lk["url"] = "/api/v1/likes/%d/" % like["likeid"]

    context["comments_url"] = "/api/v1/comments/?postid=%d" % postid
    context["comments"] = comments
    context["created"] = post_info["created"]
    context["owner"] = post_info["owner"]

    cur = connection.execute(
        "select filename from users where username = ?", (post_info["owner"],)
    )
    context["ownerImgUrl"] = "/uploads/%s" % cur.fetchall()[0]["filename"]
    context["postShowUrl"] = "/posts/%d/" % post_info["postid"]
    context["imgUrl"] = "/uploads/%s" % post_info["filename"]
    context["likes"] = lk
    context["url"] = "/api/v1/posts/%d/" % post_info["postid"]

    return flask.jsonify(**context)
