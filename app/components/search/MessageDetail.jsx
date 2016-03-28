import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import MessageFields from 'components/search/MessageFields';
import { Spinner, Timestamp } from 'components/common';

import Routes from 'routing/Routes';

const MessageDetail = React.createClass({
  propTypes: {
    allStreams: PropTypes.object,
    allStreamsLoaded: PropTypes.bool,
    disableTestAgainstStream: PropTypes.bool,
    disableSurroundingSearch: PropTypes.bool,
    expandAllRenderAsync: PropTypes.bool,
    showTimestamp: PropTypes.bool,
    disableFieldActions: PropTypes.bool,
    possiblyHighlight: PropTypes.func,
    inputs: PropTypes.object,
    nodes: PropTypes.object,
    message: PropTypes.object,
    streams: PropTypes.object,
    customFieldActions: PropTypes.node,
    searchConfig: PropTypes.object,
  },

  getInitialState() {
    return {
    };
  },

  render() {
    // Short circuit when all messages are being expanded at the same time
    if (this.props.expandAllRenderAsync) {
      return (
        <Row>
          <Col md={12}>
            <Spinner />
          </Col>
        </Row>
      );
    }

    let timestamp = null;
    if (this.props.showTimestamp) {
      timestamp = [];
      const rawTimestamp = this.props.message.fields.timestamp;

      timestamp.push(<dt key={`dt-${rawTimestamp}`}>Timestamp</dt>);
      timestamp.push(<dd key={`dd-${rawTimestamp}`}><Timestamp dateTime={rawTimestamp} /></dd>);
    }

    return (<div>

      <Row className="row-sm">
        <Col md={12}>
          <h3>
            <i className="fa fa-envelope" />
            &nbsp;
            <LinkContainer to={Routes.message_show(this.props.message.index, this.props.message.id)}>
              <a href="#" style={{ color: '#000' }}>{this.props.message.id}</a>
            </LinkContainer>
          </h3>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <dl className="message-details">
            {timestamp}

          </dl>
        </Col>
        <Col md={9}>
          <div ref="messageList">
            <MessageFields message={this.props.message} possiblyHighlight={this.props.possiblyHighlight}
                           disableFieldActions={this.props.disableFieldActions}
                           customFieldActions={this.props.customFieldActions} />
          </div>
        </Col>
      </Row>
    </div>);
  },
});

export default MessageDetail;
