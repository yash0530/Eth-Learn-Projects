import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import YTSearch from 'youtube-api-search';
import _ from 'lodash';
import SearchBar from './components/search_bar';
import VideoList from './components/video_list';
import VideoDetail from './components/video_detail';

const API_KEY = "AIzaSyC65WHUwEKwWiEUGdSI8AgcxRlaHHHHI28";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            selectedVideo: null
        };
        this.videoSearch("mkbhd");  
    }

    videoSearch(term) {
        YTSearch({ key: API_KEY, term: term }, videos => {
            this.setState({
                videos,
                selectedVideo: videos[0]
            });
        });
    }

    render() {

        // debounce takes function and returns the same function;
        // but the return function can only be called every x millis
        const videoSearch = _.debounce(term => { this.videoSearch(term)}, 300);

        return (
            <div>
                <SearchBar onSearchTermChange={term => videoSearch(term)}/>
                <VideoDetail video={this.state.selectedVideo} />
                <VideoList
                    videos={this.state.videos}
                    onVideoSelect={selectedVideo => this.setState({ selectedVideo })} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('.container'));