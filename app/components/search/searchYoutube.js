import debounce from 'debounce';

import SearchBar from './searchBar';
import VideoList from './videoList';

import search from '../../helpers/youtubeApiSearch';

class SearchYoutube extends React.Component {
    constructor(props) {
        super(props);

        this.state = { videos: null };

        this.handleSearch = debounce(this.handleSearch.bind(this), 300);
    }

    createVideo(item) {
        return {
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.default.url
        };
    }

    handleSearch(q) {
        search('AIzaSyBYHPYcobof9p6rApxR4mIRQkj-2NdR2to', q)
            .then((data) => {
                const videos = data.items.map(this.createVideo);
                this.setState({ videos });
            })
            .catch((error) => console.error(error));
    }

    render() {
        const { videos } = this.state;

        let videosContainer = null;

        if (videos) {
            if (videos.length) {
                videosContainer = (
                    <div>
                      <VideoList videos={ videos }/>
                    </div>
                );
            } else {
                videosContainer = <div>No videos found</div>;
            }
        }

        return (
            <div>
              <SearchBar onSearch={ this.handleSearch }/>
                { videosContainer }
            </div>
        );
    }
}

export default SearchYoutube;
