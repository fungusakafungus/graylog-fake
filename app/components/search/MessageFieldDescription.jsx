import $ from 'jquery';
import React, {PropTypes} from 'react';
import {Alert} from 'react-bootstrap';
import Immutable from 'immutable';

const MessageFieldDescription = React.createClass({
  propTypes: {
    message: PropTypes.object.isRequired,
    fieldName: PropTypes.string.isRequired,
    fieldValue: PropTypes.any.isRequired,
    possiblyHighlight: PropTypes.func.isRequired,
    disableFieldActions: PropTypes.bool,
    customFieldActions: PropTypes.node,
  },
  getInitialState() {
    return {
      messageTerms: Immutable.List(),
    };
  },
  _onTermsLoaded(terms) {
    this.setState({messageTerms: Immutable.fromJS(terms)});
  },
  _shouldShowTerms() {
    return this.state.messageTerms.size !== 0;
  },
  addFieldToSearchBar(event) {
    event.preventDefault();
    $(document).trigger('add-search-term.graylog.search', {field: this.props.fieldName, value: this.props.fieldValue});
  },
  _getFormattedTerms() {
    const termsMarkup = [];
    this.state.messageTerms.forEach((term, idx) => {
      termsMarkup.push(<span key={idx} className="message-terms">{term}</span>);
    });

    return termsMarkup;
  },
  render() {
    const className = this.props.fieldName === 'message' || this.props.fieldName === 'full_message' ? 'message-field' : '';

    return (
      <dd className={className} key={this.props.fieldName + 'dd'}>
        <div className="field-value">{this.props.possiblyHighlight(this.props.fieldName)}</div>
        {this._shouldShowTerms() &&
        <Alert bsStyle="info" onDismiss={() => this.setState({messageTerms: Immutable.Map()})}>
          Field terms: &nbsp;{this._getFormattedTerms()}
        </Alert>
          }
      </dd>
    );
  },
});

export default MessageFieldDescription;
