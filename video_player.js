const videoId = localStorage.getItem('targetVideoId');
const videoObjectsArray = JSON.parse(localStorage.getItem('renderableVideoProperties'));
const videoObject = videoObjectsArray.find((item)=> {
    return (item.videoId.localeCompare(videoId) === 0);
})

const videoPlayerContainer = document.getElementById('video_player_container');

function renderVideoPlayer () {

    displayVideoIframe();

    renderVideoSection();

    renderCommentSection();
}

function renderVideoSection() {
    const videoDataContainer = document.querySelector('.video-data-container');
    
    videoDataContainer.querySelector('.video-title').textContent = videoObject.videoTitle;

    const videoStatsContainer = videoDataContainer.querySelector('.video-stats');
        videoStatsContainer.firstElementChild.textContent = `${videoObject.videoViewCount} Views`;
        videoStatsContainer.lastElementChild.textContent = `${videoObject.sincePublishDate}`;

    const videoActionContainer = videoDataContainer.querySelector('.video-actions');
        videoActionContainer.querySelector('button').lastChild.replaceWith(videoObject.likeCount);

    const channelLogoContainer = videoDataContainer.querySelector('.creator-logo-container');
        channelLogoContainer.querySelector('img').src = videoObject.channelLogoUrl;
    

    videoDataContainer.querySelector('.channel-name').textContent = videoObject.channelTitle;
    videoDataContainer.querySelector('.channel-subscriber-count').textContent = videoObject.channelSubscriberCount;


    videoDataContainer.querySelector('.video-description-text-container').textContent = videoObject.videoDescription;
}

async function renderCommentSection () {

    // update comment count
    const commentCount = videoObject.commentCount;
    document.querySelector('#comment-count').textContent = commentCount;

    const loadedCommentsSection = document.querySelector('.loaded-comments-section');

    
    const commentDetailsArray = await fetchComments(videoId);

    // create and render comment elements using commentDetails objects
    commentDetailsArray.forEach((commentDetailsObject)=> {
        const commentElement = createNewComment(commentDetailsObject);

        loadedCommentsSection.appendChild(commentElement);

        addReadMoreButton(commentElement);
        
    });

    function addReadMoreButton(newComment) {
        const commentTextContainer = newComment.querySelector('.comment-text-container');
        const commentContentContainer = commentTextContainer.parentElement;
    
        if (commentTextContainer.clientHeight < commentTextContainer.scrollHeight) {
            const readMoreLess = document.createElement('span');
            readMoreLess.classList.add('expand-comment-toggle');
            readMoreLess.textContent = 'Read more';
    
            commentContentContainer.appendChild(readMoreLess);
            console.log(readMoreLess);
    
            readMoreLess.addEventListener('click', (event)=> {

                event.stopPropagation();
            
                console.log('clicked readmore');

                const expandCommentToggleButton = readMoreLess;
                const targetComment = expandCommentToggleButton.previousElementSibling;
    
                if (targetComment.classList.contains('comment-collapsed')) {
                    expandCommentToggleButton.textContent = 'Read less';
                    targetComment.classList.remove('comment-collapsed');
                }
                else {
                    expandCommentToggleButton.textContent = 'Read more';
                    targetComment.classList.add('comment-collapsed');
    
                }
    
            })
    
            // add a readmore button
        }
    }

}

function createNewComment(commentObject) {

    const newComment = document.createElement('div');
    newComment.classList.add('comment-outer-wrapper');

    newComment.innerHTML = `
                <div class="comment-container">

                    <div class="profile-image-column">
                        <div class="profile-image-container"><img src="${commentObject.authorProfileImageUrl}" alt=""></div>
                    </div>

                    <div class="comment-main-container">
                        <div class="comment-header">
                            <span class="author-name">${commentObject.authorDisplayName}</span>
                            <span class="comment-published-time">${commentObject.publishedAt}</span>
                            <span class="comment-updated-time"></span>
                        </div>

                        <div class="comment-content-container">
                            <div class="comment-text-container comment-collapsed">${commentObject.textDisplay}</div>
                            
                        </div>

                        <div class="comment-actions-container">
                            <button class="like-comment-button"><img src="./assets/comments-section-icons/liked.svg" alt=""><span class="comment-like-count">${commentObject.likeCount}</span></button>
                            <button class="dislike-comment-button"><img src="./assets/comments-section-icons/disliked.svg" alt=""></button>
                            <button class="reply-comment-button">REPLY</button>
                        </div>
                    </div>
                    
                </div>

                <div class="replies-section hide">
                    
                </div>`;

    // TODO: add update time to comment   

    const mainCommentContainer = newComment.querySelector('.comment-container');
    mainCommentContainer.setAttribute('data-id', commentObject.commentId);

    mainCommentContainer.addEventListener('click', toggleRepliesSection);

    return newComment;
}

async function toggleRepliesSection() {
    
    // expand/collapse the comment by dynamically clicking Readmore if found
    const commentContainer = this;
    const commentOuterWrapper = commentContainer.parentElement;

    const commentText = commentContainer.querySelector('.comment-text-container');
    
    
    if (commentContainer.querySelector('.expand-comment-toggle')) {
        if (commentText.classList.contains('.comment-collapsed')) {
            commentContainer.querySelector('.expand-comment-toggle').click();
        }
    }


    const repliesSection = commentOuterWrapper.querySelector('.replies-section');
    console.log(commentContainer, repliesSection);


    // if replies are visible, hide them
    if (!repliesSection.classList.contains('hide')) {
        repliesSection.classList.add('hide');
        console.log('hiding replies')
    }
    else {
        // replies are already added, just show them
        if (repliesSection.childElementCount !== 0) {

            repliesSection.classList.remove('hide');
            return;
        }

        // replies must be fetched and rendered
        const parentId = commentContainer.getAttribute('data-id');
        const repliesArray = await getCommentReplies(parentId);

        // if any replies are found
        if (repliesArray) {
            
            // show repliesSection
            repliesSection.classList.remove('hide');
            
            // create an element for each reply data object and add it to the replies section
            repliesArray.forEach((replyObject)=> {
                const newReply = createNewReply(replyObject);
                repliesSection.appendChild(newReply);
                
            })
        }

    }


}

function createNewReply(replyObject) {
    const commentContainer = document.createElement('div');
    commentContainer.classList.add('comment-container');

    commentContainer.innerHTML = `
                                    <div class="profile-image-column">
                                        <div class="profile-image-container"><img src="${replyObject.authorProfileImageUrl}" alt=""></div>
                                    </div>
        
                                    <div class="comment-main-container">

                                        <div class="comment-header">
                                            <span class="author-name">${replyObject.authorDisplayName}</span>
                                            <span class="comment-published-time">${replyObject.publishedAt}</span>
                                            <span class="comment-updated-time"></span>
                                        </div>
        
                                        <div class="comment-content-container">
                                            <div class="comment-text-container">${replyObject.textDisplay}</div>
                                            
                                        </div>
        
                                        <div class="comment-actions-container">
                                            <button class="like-comment-button"><img src="./assets/comments-section-icons/liked.svg" alt=""><span class="comment-like-count">${replyObject.likeCount}</span></button>
                                            <button class="dislike-comment-button"><img src="./assets/comments-section-icons/disliked.svg" alt=""></button>                                        
                                        </div>

                                    </div>
    `;

    return commentContainer;
}

function displayVideoIframe() {
    if (YT) {
        new YT.Player(videoPlayerContainer.id, {
            height: videoPlayerContainer.clientHeight.toString(),
            width: videoPlayerContainer.clientWidth.toString(),
            videoId: videoId
        })
    } 
}

renderVideoPlayer();
