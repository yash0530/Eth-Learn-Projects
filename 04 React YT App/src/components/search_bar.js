import React, { Component } from "react";

class SearchBar extends Component {

    constructor(props) {
        super(props);

        // only in constructor we directly set state; use this.setState
        this.state = { term: '' }; 
    }

    render() {
        return (
            <div className="search-bar">
                {/* input is a controlled component; value is changed by state.
                    this.setState re-renders the component and the value is set by state.

                    So when user typed in the value, they just triggered an event which
                    re-rendered the element and the value of the element is set by the state
                    which now contains the new value that user typed in. */}
                <input 
                    value={this.state.term}
                    onChange={event => this.onInputChange(event)} />
                <br />
            </div>
        );
    }

    onInputChange(event) {
        const term = event.target.value;
        this.setState({ term });
        this.props.onSearchTermChange(term);
    }
}

export default SearchBar;