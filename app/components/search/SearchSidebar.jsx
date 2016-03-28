import React from 'react';
import ReactDOM from 'react-dom';
import { Button, DropdownButton, Input, MenuItem, Modal } from 'react-bootstrap';
import {AutoAffix} from 'react-overlays';
import numeral from 'numeral';


import { AddSearchCountToDashboard, SavedSearchControls, ShowQueryModal } from 'components/search';
import SidebarMessageField from './SidebarMessageField';

const SearchSidebar = React.createClass({
  propTypes: {
    builtQuery: React.PropTypes.any,
    currentSavedSearch: React.PropTypes.any,
    fields: React.PropTypes.any,
    fieldAnalyzers: React.PropTypes.any,
    onFieldAnalyzer: React.PropTypes.any,
    onFieldToggled: React.PropTypes.any,
    permissions: React.PropTypes.any,
    predefinedFieldSelection: React.PropTypes.any,
    result: React.PropTypes.any,
    searchInStream: React.PropTypes.any,
    selectedFields: React.PropTypes.any,
    shouldHighlight: React.PropTypes.any,
    showAllFields: React.PropTypes.any,
    showHighlightToggle: React.PropTypes.any,
    togglePageFields: React.PropTypes.any,
    toggleShouldHighlight: React.PropTypes.any,
  },
  getInitialState() {
    return {
      fieldFilter: '',
      maxFieldsHeight: 1000
    };
  },

  componentDidMount() {
    this._updateHeight();
    window.addEventListener('scroll', this._updateHeight);
  },
  componentWillReceiveProps(newProps) {
    // update max-height of fields when we toggle per page/all fields
    if (this.props.showAllFields !== newProps.showAllFields) {
      this._updateHeight();
    }
  },
  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeCallback);
    window.removeEventListener('scroll', this._updateHeight);
  },

  _updateHeight() {
    const header = ReactDOM.findDOMNode(this.refs.header);

    const sidebar = ReactDOM.findDOMNode(this.refs.sidebar);
    const sidebarTop = sidebar.getBoundingClientRect().top;
    const sidebarCss = window.getComputedStyle(ReactDOM.findDOMNode(this.refs.sidebar));
    const sidebarPaddingTop = parseFloat(sidebarCss.getPropertyValue('padding-top'));
    const sidebarPaddingBottom = parseFloat(sidebarCss.getPropertyValue('padding-bottom'));

    const viewPortHeight = window.innerHeight;
    const maxHeight =
      viewPortHeight -
      header.clientHeight - 
      sidebarTop - sidebarPaddingTop - sidebarPaddingBottom -
      35; // for good measure™

    this.setState({maxFieldsHeight: maxHeight});
  },

  _updateFieldSelection(setName) {
    this.props.predefinedFieldSelection(setName);
  },
  _showAllFields(event) {
    event.preventDefault();
    if (!this.props.showAllFields) {
      this.props.togglePageFields();
    }
  },
  _showPageFields(event) {
    event.preventDefault();
    if (this.props.showAllFields) {
      this.props.togglePageFields();
    }
  },
  render() {

    const messageFields = this.props.fields
      .filter((field) => field.name.indexOf(this.state.fieldFilter) !== -1)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((field) => {
        return (
          <SidebarMessageField key={field.name}
                               field={field}
                               fieldAnalyzers={this.props.fieldAnalyzers}
                               onToggled={this.props.onFieldToggled}
                               onFieldAnalyzer={this.props.onFieldAnalyzer}
                               selected={this.props.selectedFields.contains(field.name)}/>
        );
      });
    let searchTitle = null;
    if (this.props.searchInStream) {
      searchTitle = <span>{this.props.searchInStream.title}</span>;
      // TODO: add stream actions to dropdown
    } else {
      searchTitle = <span>Search result</span>;
    }

    return (
      <AutoAffix viewportOffsetTop={45}>
        <div className="content-col" ref="sidebar">
          <div ref="header">
            <h2>
              {searchTitle}
            </h2>

            <p style={{marginTop: 3}}>
              Found <strong>{numeral(this.props.result.total_results).format('0,0')} messages</strong>&nbsp;
            </p>

            <h3>Fields</h3>

            <div className="input-group input-group-sm" style={{marginTop: 5, marginBottom: 5}}>
              <span className="input-group-btn">
                  <button type="button" className="btn btn-default"
                          onClick={() => this._updateFieldSelection('default')}>Default
                  </button>
                  <button type="button" className="btn btn-default"
                          onClick={() => this._updateFieldSelection('all')}>All
                  </button>
                  <button type="button" className="btn btn-default"
                          onClick={() => this._updateFieldSelection('none')}>None
                  </button>
              </span>
              <input type="text" className="form-control" placeholder="Filter fields"
                     onChange={(event) => this.setState({fieldFilter: event.target.value})}
                     value={this.state.fieldFilter}/>
            </div>
          </div>
          <div ref="fields" style={{maxHeight: this.state.maxFieldsHeight, overflowY: 'scroll'}}>
            <ul className="search-result-fields">
              {messageFields}
            </ul>
          </div>
        </div>
      </AutoAffix>
    );
  },
});

export default SearchSidebar;
