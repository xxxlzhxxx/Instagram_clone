"""REST API for posts."""
import flask
import insta485


@insta485.app.route("/api/v1/", methods=['GET'])
def get_services():
  " return a list of services available"
   
  context = {
    "comments": "/api/v1/comments/",
    "likes": "/api/v1/likes/",
    "posts": "/api/v1/posts/",
    "url": "/api/v1/"
  }
  return flask.jsonify(context)



@insta485.app.route("/api/v1/posts/", methods=['GET'])
def get_post_list():
  """ return 10 newest posts """
  ...
   




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
    context = {
        "created": "2017-09-28 04:33:28",
        "imgUrl": "/uploads/122a7d27ca1d7420a1072f695d9290fad4501a41.jpg",
        "owner": "awdeorio",
        "ownerImgUrl": "/uploads/e1a7c5c32973862ee15173b0259e3efdb6a391af.jpg",
        "ownerShowUrl": "/users/awdeorio/",
        "postid": f"/posts/{postid_url_slug}/",
        "url": flask.request.path,
    }
    return flask.jsonify(**context)
