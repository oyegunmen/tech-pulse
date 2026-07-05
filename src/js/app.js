let allData = {};
        let activeSources = new Set();
        let currentTab = 'news';

        async function init() {
            try {
                const res = await fetch(`data.json?v=${new Date().getTime()}`);
                allData = await res.json();

                if (allData.metadata) {
                    document.getElementById('last-run').innerText = allData.metadata.last_updated;
                }
                
                const allItems = [...allData.news, ...allData.tweets, ...allData.youtube];
                allItems.forEach(i => activeSources.add(i.source));
                
                showTab('news');
            } catch(e) {
                document.querySelectorAll('.news-grid').forEach(g => g.innerHTML = "<p>We’re having trouble loading the data. Please <a href='/about.html#contact' target='_blank'>report</a> this issue here</p>");
            }
        }

        function toggleFilterMenu() {
            const menu = document.getElementById('filter-menu');
            menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
        }

        function showTab(tab) {
            currentTab = tab;
            ['news', 'tweets', 'youtube'].forEach(t => {
                document.getElementById(`${t}-section`).classList.toggle('hidden', t !== tab);
                const btn = document.getElementById(`btn-${t}`);
                if (t === tab) btn.classList.add('active');
                else btn.classList.remove('active');
            });
            updateFilterChecklist();
            render();
        }

        function updateFilterChecklist() {
            const checklist = document.getElementById('site-checklist');
            const title = document.getElementById('filter-title');
            checklist.innerHTML = '';
            
            const tabSources = [...new Set(allData[currentTab].map(i => i.source))];
            title.innerText = `Filter ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Sources:`;

            tabSources.forEach(src => {
                const label = document.createElement('label');
                label.className = 'check-item';
                const checked = activeSources.has(src) ? 'checked' : '';
                label.innerHTML = `<input type="checkbox" ${checked} onchange="toggleSource('${src}')"> ${src}`;
                checklist.appendChild(label);
            });
        }

        function toggleSource(source) {
            if (activeSources.has(source)) activeSources.delete(source);
            else activeSources.add(source);
            render();
        }

        function render() {
            const container = document.getElementById(`${currentTab}-section`);
            const items = allData[currentTab].filter(i => activeSources.has(i.source));
            
            if (items.length === 0) {
                let message = "";
                
                if (currentTab === 'youtube' && activeSources.size > 0) {
                    message = `
                        <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
                            <p>There is a documented issue with the YouTube RSS feed returning error 404 due to a platform bug.</p>
                            <p>Expect downtime for youtube feed from <a href="https://www.reddit.com/r/youtube/comments/1r61jpo/all_youtube_channel_rss_feeds_are_down_return_404/" target="_blank">9 AM – 1 PM</a> IST, check back shortly.</p>
                            <a href="https://www.reddit.com/r/youtube/search/?q=RSS+404" target="_blank">
                                View complaints of User
                            </a>
                        </div>`;
                } else {
                    message = "<p style='grid-column: 1/-1; text-align: center;'>Kindly select at least one source to display the content.</p>";
                }

                container.innerHTML = message;
                return;
            }

            container.innerHTML = items.map(item => {
                const meta = `<div class="hstack justify-between mb-2"><span class="source">${item.source}</span><span class="date">${item.time}</span></div>`;
                let content = "";
                let actionText = "Read Article ↗&#xFE0E;";
                
                if (currentTab === 'youtube') {
                    actionText = "Watch Video ↗&#xFE0E;";
                    let embedUrl = item.link.replace("watch?v=", "embed/") + "?rel=0";
                    content = `<div><iframe width="100%" frameborder="0" src="${embedUrl}" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" class="thumbnail" loading="lazy" allowfullscreen></iframe></div><h3 class="mb-2 mt-2">${item.title}</h3>`;
                } else if (currentTab === 'tweets') {
                    actionText = "View Tweet ↗&#xFE0E;";
                    let tweetHtml = item.content;
                    let retweetBadge = '';
                    const rtMatch = item.title.match(/^RT by (@\w+):/i);
                    if (rtMatch) {
                        const retweeter = rtMatch[1];
                        const originalAuthor = item.author || "this user";
                        
                        retweetBadge = `<div><strong>${retweeter}</strong> Retweeted a post from <strong>${originalAuthor}</strong><br><br></div>`;}

                    tweetHtml = tweetHtml.replace(/<hr\s*\/?>/gi, '');
                    tweetHtml = tweetHtml.replace(/<footer>[\s\S]*?href="([^"]+)"[\s\S]*?<\/footer>/i, (match, url) => {
                            return `<footer class="retweet-footer"><a href="${url}" class="retweet-btn">View Quoted Tweet</a></footer>`;
                        });
                    content = `${retweetBadge}<div class="tweet-content">${tweetHtml}</div>`;
                } else {
                    content = `<h3 class="mt-2 mb-2">${item.title}</h3>${item.description ? `<p>${item.description}</p>` : ''}`;
                }
                
                return `<article class="card ${currentTab}-card col-4">${meta}<div class="card-body mt-2">${content}</div><div class="mt-2"><a href="${item.link}">${actionText}</a></div></article>`;
            }).join('');
        }

        init();