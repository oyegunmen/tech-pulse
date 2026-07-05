async function loadResources() {
    try {
        const [feedsRes, dataRes] = await Promise.all([
            fetch('feeds.json'),
            fetch('data.json')
        ]);

        const feeds = await feedsRes.json();
        const data = await dataRes.json();

        const activeSources = new Set([
            ...(data.news || []).map(item => item.source),
            ...(data.tweets || []).map(item => item.source),
            ...(data.youtube || []).map(item => item.source)
        ]);

        const types = ['news', 'tweets', 'youtube'];

        types.forEach(type => {
            const container = document.getElementById(`table-${type}`);
            if (!container) return;

            const filteredFeeds = feeds
                .filter(f => (f.type || 'news') === type)
                .sort((a, b) => a.name.localeCompare(b.name));

            container.innerHTML = `
            <div class="table">
                <table>
                <colgroup><col style="width: 20%;"><col style="width: 70%;"><col style="width: 10%;"></colgroup>
                    <thead class="table-heading">
                        <tr>
                            <th>Name</th>
                            <th>Keywords</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredFeeds.map(source => {
                            const isActive = activeSources.has(source.name);
                            const keywords = source.keywords?.length 
                                ? source.keywords.map(k => `<span class="badge outline" style="margin: var(--space-1) 0;">${k}</span>`).join(' ') 
                                : 'Dedicated Source';

                            return `
                            <tr>
                                <td><a href="${source.site_url}" target="_blank">${source.name} ↗&#xFE0E;</a></td>
                                <td>${keywords}</td>
                                <td>
                                    <span class="badge" data-variant="${isActive ? 'success' : 'warning'}">
                                        ${isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>`;
        });
    } catch (error) {
        console.error("Error loading sources:", error);
    }
}

loadResources();