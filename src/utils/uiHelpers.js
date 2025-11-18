// ===== UI HELPER FUNCTIONS =====

/**
 * Update achievement progress UI
 * @param {number} unlocked - Number of unlocked achievements
 * @param {number} total - Total number of achievements
 */
export function updateAchievementProgress(unlocked, total) {
    const countEl = document.getElementById('achievement-count');
    const fillEl = document.querySelector('.achievement-bar-fill');

    if (countEl) {
        countEl.textContent = `${unlocked}/${total}`;
    }

    if (fillEl) {
        const percentage = (unlocked / total) * 100;
        fillEl.style.width = `${percentage}%`;
    }
}

/**
 * Show info panel with content
 * @param {Object} data - Data to display
 */
export function showInfoPanel(data) {
    const panel = document.getElementById('info-panel');
    if (!panel) return;

    const title = panel.querySelector('.info-title');
    const content = panel.querySelector('.info-content');

    if (title) title.textContent = data.title || '';
    if (content) {
        if (typeof data.content === 'string') {
            content.innerHTML = data.content;
        } else {
            content.innerHTML = formatContent(data.content);
        }
    }

    panel.classList.add('show');
}

/**
 * Hide info panel
 */
export function hideInfoPanel() {
    const panel = document.getElementById('info-panel');
    if (panel) {
        panel.classList.remove('show');
    }
}

/**
 * Format content object to HTML
 * @param {Object} content
 * @returns {string} HTML string
 */
function formatContent(content) {
    let html = '';

    if (content.description) {
        html += `<p>${content.description}</p>`;
    }

    if (content.details && Array.isArray(content.details)) {
        html += '<ul>';
        content.details.forEach(item => {
            html += `<li>${item}</li>`;
        });
        html += '</ul>';
    }

    if (content.tags && Array.isArray(content.tags)) {
        html += '<div class="tags">';
        content.tags.forEach(tag => {
            html += `<span class="tag">${tag}</span>`;
        });
        html += '</div>';
    }

    return html;
}

/**
 * Show notification message
 * @param {string} message
 * @param {string} type - 'success', 'error', 'info'
 */
export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Toggle performance stats
 */
export function togglePerformanceStats() {
    const perfStats = document.getElementById('performance-stats');
    if (perfStats) {
        perfStats.classList.toggle('hidden');
    }
}
