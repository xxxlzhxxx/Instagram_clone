import React from 'react';
import PropTypes from 'prop-types';

function DeleteCommentButton(props) {
  const { handle_click } = props;

  return (
    <button
      type="button"
      className="delete-comment-button btn btn-warning"
      onClick={props.handle_click}
    >
      Delete
    </button>
  );
}

DeleteCommentButton.propTypes = {
  url: PropTypes.string.isRequired,
  updateFn: PropTypes.func.isRequired,
};

export default DeleteCommentButton;