function initLazyLoad() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                scrollToTopBtn.style.display = "block";
            } else {
                scrollToTopBtn.style.display = "none";
            }
        };

        scrollToTopBtn.onclick = function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
    }

    const notiSuccessElement = document.querySelector('.noti-success');
    if (notiSuccessElement) {
        notiSuccessElement.scrollIntoView({ behavior: 'smooth' });
    }

    const lazyImages = document.querySelectorAll('.movie-item img[data-src]');
    const scrollContainer = document.querySelector('.scroll-container') || window;
    const lazyLoadDebounced = debounce(lazyLoad, 100);

    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', lazyLoadDebounced);
    }

   function lazyLoad() {
    lazyImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0 && !img.getAttribute('data-loaded') && img.getAttribute('data-src')) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.setAttribute('data-loaded', true);
            img.style.opacity = '0';
            img.addEventListener('load', function() {
                img.style.opacity = '1';
            });
        }
    });
}


    function debounce(func, delay) {
        let timer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }
}



















function PopAD() {
    const button = document.getElementById("closeButton");
    const element = document.getElementById("catfish");

    function getCookie(name) {
        const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return match ? decodeURIComponent(match[1]) : null;
    }

    function setCookie(name, value, expiresHours, path, domain, secure) {
        const expires = new Date(Date.now() + expiresHours * 60 * 60 * 1000);
        const expiresString = expires.toUTCString();

        let cookieString = name + "=" + encodeURIComponent(value);
        cookieString += ";expires=" + expiresString;

        if (path) {
            cookieString += ";path=" + path;
        }
        if (domain) {
            cookieString += ";domain=" + domain;
        }
        if (secure) {
            cookieString += ";secure";
        }

        document.cookie = cookieString;
    }

    function popUnder() {
        if (!getCookie('cucre')) {
            setCookie('cucre', 'cucre Popunder', 2, '/', '', '');
            const url = "https://google.com/";
            const pop = window.open(url, 'windowcucre');
            if (pop) {
                pop.blur();
                window.focus();
            }
        }
    }

    if (button && element) {
        button.addEventListener("click", function() {
            element.style.display = "none";
        });

        window.addEventListener("load", function() {
            document.body.addEventListener("click", popUnder);
        });
    } else {
        console.error('Button or element not found');
    }
}

function initSearchForm() {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", function(event) {
            event.preventDefault();
            let keyword = searchInput.value.trim();

            if (keyword) {
                keyword = filterSpecialCharacters(keyword);
                keyword = keyword.replace(/\s+/g, '-');
                const url = "/" + encodeURIComponent(keyword) + "-page/1";
                window.location.href = url;
            }
        });
    }

    function filterSpecialCharacters(input) {
        const regex = /[^a-zA-Z0-9\sàáạãảăắằẵặẳâấầẫậẩèéẹẽẻêềếểễệìíịĩỉòóọõỏôồốỗộổơờớỡợởùúụũủưừứựữửỳýỵỹỷđ\s]/g;
        return input.replace(regex, '');
    }
}

function initComments() {
    let currentPage = 1;
    const csrfTokenInput = document.getElementById('csrf_token');
    const cmtIdInput = document.getElementById('cmt_id');
    const loadMoreButton = document.getElementById('load-more');
    const commentForm = document.getElementById('comment-form');

    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => loadComments(currentPage));
    }

    if (commentForm) {
        commentForm.addEventListener('submit', e => {
            e.preventDefault();
            submitComment();
        });
    }

    loadComments(currentPage);

    async function updateCsrfToken() {
        if (!csrfTokenInput) {
            return;
        }
        try {
            const response = await fetch('/token');
            if (!response.ok) {
                throw new Error('Failed to fetch CSRF token');
            }
            const data = await response.json();
            csrfTokenInput.value = data.csrf_token;
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    }

    async function loadComments(page) {
        if (cmtIdInput) {
            showLoading();
            try {
                await updateCsrfToken();
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ page_cmt: page, csrf_token: csrfTokenInput.value, cmt_id: cmtIdInput.value })
                });
                if (!response.ok) {
                    throw new Error('Failed to load comments');
                }
                const newCommentsHtml = await response.text();
                hideLoading();
                if (newCommentsHtml.trim()) {
                    const commentsContainer = document.getElementById('comments-container');
                    commentsContainer.insertAdjacentHTML('beforeend', newCommentsHtml.trim());

                    const commentCount = parseInt(document.getElementById('tong').innerText.trim());
                    document.getElementById('tcmt').innerText = commentCount;

                    const totalPages = Math.ceil(commentCount / 5);
                    if (currentPage < totalPages) {
                        loadMoreButton.style.display = 'block';
                        currentPage++;

                        loadMoreButton.addEventListener('click', function() {
                            const lastComment = commentsContainer.lastElementChild;
                            lastComment.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        });
                    } else {
                        loadMoreButton.style.display = 'none';
                    }
                }
            } catch (error) {
                console.error('Error loading comments:', error);
            }
        }
    }

    async function submitComment() {
        try {
            await updateCsrfToken();
            const form = new FormData(document.getElementById('comment-form'));
            const response = await fetch('/', { method: 'POST', body: form });
            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }
            const newCommentHtml = await response.text();
            if (newCommentHtml.trim()) {
                const commentsContainer = document.getElementById('comments-container');
                commentsContainer.insertAdjacentHTML('afterbegin', newCommentHtml.trim());

                const commentCount = parseInt(document.getElementById('tong').innerText.trim());
                document.getElementById('tcmt').innerText = commentCount;
                document.getElementById('comment-form').reset();
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    }

    function showLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
        loadMoreButton.style.display = 'none';
    }

    function hideLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
}

function initVideoPlayer() {
    const servers = ['server1', 'server2', 'server3', 'server4'];
    const videoIframe = document.getElementById('video-player');

    if (videoIframe) {
        play(1);
    }

    servers.forEach(addClickEvent);

    function addClickEvent(serverId) {
        const serverElement = document.getElementById(serverId);
        if (serverElement) {
            serverElement.addEventListener('click', function() {
                if (!this.classList.contains('default-srv')) {
                    removeDefaultSrv();
                    enableAllServers();
                    this.classList.add('default-srv');
                    this.style.pointerEvents = 'none';
                    play(serverId.replace('server', ''));
                }
            });
        }
    }

    function removeDefaultSrv() {
        const defaultElements = document.querySelectorAll('span.default-srv');
        defaultElements.forEach(element => element.classList.remove('default-srv'));
    }

    function enableAllServers() {
        servers.forEach(serverId => {
            const serverElement = document.getElementById(serverId);
            if (serverElement) {
                serverElement.style.pointerEvents = 'auto';
            }
        });
    }

    async function play(sv) {
        const dataid = videoIframe.dataset.id;
        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ sv: sv, video_id: dataid })
            });
            if (!response.ok) {
                throw new Error('Failed to play video');
            }
            const src = await response.text();
            videoIframe.src = src;
        } catch (error) {
            console.error('Error playing video:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    PopAD();
    initSearchForm();
    initLazyLoad();
    const videoPlayerElement = document.getElementById('video-player');
    if (videoPlayerElement) {
        initComments();
        initVideoPlayer();
    }
});