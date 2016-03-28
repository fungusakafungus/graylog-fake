import React, {PropTypes} from 'react';
import Immutable from 'immutable';

const MessageFields = React.createClass({
  propTypes: {
    message: PropTypes.object.isRequired,
    possiblyHighlight: PropTypes.func.isRequired,
    disableFieldActions: PropTypes.bool,
    customFieldActions: PropTypes.node,
  },
  SPECIAL_FIELDS: ['full_message', 'level'],
  render() {
    const fields = [];
    const formattedFields = Immutable.Map(this.props.message.formatted_fields).sortBy((value, key) => key, (fieldA, fieldB) => fieldA.localeCompare(fieldB));
    formattedFields.forEach((value, key) => {
      let innerValue = value;
      if (this.SPECIAL_FIELDS.indexOf(key) !== -1) {
        innerValue = this.props.message.fields[key];
      }
      fields.push(<dt key={key + 'Title'}>{key}</dt>);
    });

    return (
      <dl className="message-details message-details-fields">
        {fields}
      </dl>
    );
  },
});

export default MessageFields;
