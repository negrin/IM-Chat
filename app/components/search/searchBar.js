import React, { Component } from 'react';

const { func } = React.PropTypes;

class SearchBar extends React.Component {
  constructor(props) {
      super(props);
      this.state = { q: '' };
      this.handleChange = this.handleChange.bind(this);
  }

  render() {
      return (
        <input
          autoFocus="true"
          placeholder="Search for videos"
          value={ this.state.q }
          onChange={ this.handleChange }/>
      );
  }

  handleChange(e) {
      const q = e.target.value.trim();

      this.setState({ q });

      if (q !== '') {
          this.props.onSearch(q);
      }
  }
}

SearchBar.propTypes = {
    onSearch: func.isRequired
};

export default SearchBar;
