import React from 'react';
import {Col, Row} from 'react-bootstrap';
import { ResultTable, SearchSidebar } from 'components/search';
import { Websocket } from 'components/Websocket';

import Immutable from 'immutable';
import 'stylesheets/bootstrap.min.css'
import 'stylesheets/font-awesome.min.css'
import 'stylesheets/graylog2.less'

const GELFServer = React.createClass({
    getInitialState: function () {
        return {
            messages: [
            ],
            selectedFields: Immutable.OrderedSet(['message', 'host']),
            sortField: 'timestamp',
            searchConfig: {},
            sortOrder: 'desc',
            showAllFields: true
        };
    },
    _fields() {
        var result = this.state.messages.reduce(
            function (list, message) {
                return Immutable.List(
                    Immutable.Set(list).union(
                        Immutable.Set(Object.keys(message.fields))
                    )
                );
            },
            Immutable.List()
        );
        console.log('_fields', result);

        return result.map((name) => ({name: name, hash: name}));
    },
    sortFields(fieldSet) {
      let newFieldSet = fieldSet;
      let sortedFields = Immutable.OrderedSet();

      if (newFieldSet.contains('source')) {
        sortedFields = sortedFields.add('source');
      }
      newFieldSet = newFieldSet.delete('source');
      const remainingFieldsSorted = newFieldSet.sort((field1, field2) => field1.toLowerCase().localeCompare(field2.toLowerCase()));
      return sortedFields.concat(remainingFieldsSorted);
    },
    updateSelectedFields(fieldSelection) {
      const selectedFields = this.sortFields(fieldSelection);
      this.setState({selectedFields: selectedFields});
    },
    onFieldToggled(fieldName) {
        console.log('toggled', fieldName);
        const currentFields = this.state.selectedFields;
        let newFieldSet;
        if (currentFields.contains(fieldName)) {
            newFieldSet = currentFields.delete(fieldName);
        } else {
            newFieldSet = currentFields.add(fieldName);
        }
        this.updateSelectedFields(newFieldSet);
    },

    onMessage(message) {
        console.log(message);
        this.setState({
            messages: this.state.messages.concat([message])
        });
    },

    render: function () {
        return (
                <Row id="main-content-search">
                    <Col md={3} sm={12} id="sidebar">
                        <SearchSidebar result={this.state.messages}
                                       builtQuery={""}
                                       selectedFields={this.state.selectedFields}
                                       fields={this._fields()}
                                       fieldAnalyzers={[]}
                                       showAllFields={this.state.showAllFields}
                                       togglePageFields={() => {}}
                                       onFieldToggled={this.onFieldToggled}
                                       onFieldAnalyzer={() => {}}
                                       predefinedFieldSelection={() => {}}
                                       showHighlightToggle={false}
                                       shouldHighlight={false}
                                       toggleShouldHighlight={false}
                                       currentSavedSearch={""}
                                       searchInStream={false}
                                       permissions={[]}
                        />
                    </Col>
                    <Col md={9} sm={12} id="main-content-sidebar">
                        <ResultTable messages={this.state.messages}
                                     selectedFields={this.state.selectedFields}
                                     sortField={this.state.sortField}
                                     sortOrder={this.state.sortOrder}
                                     nodes={{}}
                                     highlight={false}
                                     searchConfig={{}}
                        />
                    </Col>


                    <Websocket url={"ws://" + location.hostname + ":3000/ws"}
                               onMessage={this.onMessage}
                               debug={false}
                               protocol="gelfserver"
                    />
                </Row>
        );
    }
});

export default GELFServer;
