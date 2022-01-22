import React from "react";

const VideoDetail = ({ video }) => {
    if (!video) {
        return <div>Loading...</div>;
    }
    const videoId = video.id.videoId;
    const url = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div className="col-md-8">
            <iframe className="video-detail" src={url}></iframe>
            <div className="details">
                <h3>{video.snippet.title}</h3><hr />
                <div>{video.snippet.description}</div>
            </div>
        </div>
    );
};

export default VideoDetail;