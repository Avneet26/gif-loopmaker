/**
 * Analytics Utility for tracking user interactions
 * Uses the lightweight analytics (la) library
 */

/**
 * Track an analytics event
 * @param {string} eventType - Type of event (e.g., 'click', 'upload', 'process')
 * @param {string} eventName - Name/identifier of the event
 * @param {object} metadata - Optional additional metadata
 */
export function trackEvent(eventType, eventName, metadata = {}) {
    try {
        if (window.la && typeof window.la.track === 'function') {
            window.la.track(eventType, eventName, metadata);
            console.log(`[Analytics] Tracked: ${eventType} - ${eventName}`, metadata);
        } else {
            // Analytics not loaded yet, queue the event
            window._laQueue = window._laQueue || [];
            window._laQueue.push({ eventType, eventName, metadata });
            console.log(`[Analytics] Queued: ${eventType} - ${eventName}`, metadata);
        }
    } catch (error) {
        // Silently fail - don't disrupt user experience
        console.warn('[Analytics] Error tracking event:', error);
    }
}

// Funnel Events - Pre-defined tracking functions for common actions
// Note: Page views are tracked automatically by the analytics script

/**
 * Track image/GIF file upload
 * @param {string} fileType - Type of file (gif, jpg, png, webp)
 * @param {number} fileSize - Size of file in bytes
 */
export function trackImageUpload(fileType, fileSize) {
    trackEvent('upload', 'image_upload', {
        file_type: fileType,
        file_size_kb: Math.round(fileSize / 1024),
    });
}

/**
 * Track audio file upload
 * @param {string} fileType - Type of file (mp3, m4a, wav, ogg)
 * @param {number} fileSize - Size of file in bytes
 */
export function trackAudioUpload(fileType, fileSize) {
    trackEvent('upload', 'audio_upload', {
        file_type: fileType,
        file_size_kb: Math.round(fileSize / 1024),
    });
}

/**
 * Track quality selection change
 * @param {string} quality - Selected quality (fast, balanced, high)
 */
export function trackQualityChange(quality) {
    trackEvent('click', 'quality_select', { quality });
}

/**
 * Track process button click (start processing)
 * @param {object} options - Processing options
 */
export function trackProcessStart(options = {}) {
    trackEvent('click', 'process_start', options);
}

/**
 * Track successful video processing
 * @param {number} processingTime - Time taken in seconds
 * @param {string} quality - Quality preset used
 */
export function trackProcessComplete(processingTime, quality) {
    trackEvent('process', 'process_complete', {
        processing_time_sec: processingTime,
        quality,
    });
}

/**
 * Track processing error
 * @param {string} errorMessage - Error message
 */
export function trackProcessError(errorMessage) {
    trackEvent('error', 'process_error', {
        error_message: errorMessage?.substring(0, 100), // Limit length
    });
}

/**
 * Track processing cancellation
 */
export function trackProcessCancel() {
    trackEvent('click', 'process_cancel');
}

/**
 * Track video download
 */
export function trackDownload() {
    trackEvent('click', 'video_download');
}

/**
 * Track "Create Another" / reset button click
 */
export function trackReset() {
    trackEvent('click', 'create_another');
}

/**
 * Track theme toggle
 * @param {string} newTheme - The new theme (light/dark)
 */
export function trackThemeToggle(newTheme) {
    trackEvent('click', 'theme_toggle', { theme: newTheme });
}

/**
 * Process any queued events once analytics loads
 */
export function processQueuedEvents() {
    if (window._laQueue && window._laQueue.length > 0 && window.la) {
        window._laQueue.forEach(({ eventType, eventName, metadata }) => {
            window.la.track(eventType, eventName, metadata);
        });
        window._laQueue = [];
        console.log('[Analytics] Processed queued events');
    }
}

// Initialize - set up listener for when analytics loads
if (typeof window !== 'undefined') {
    // Check periodically if analytics has loaded
    const checkAnalytics = setInterval(() => {
        if (window.la && typeof window.la.track === 'function') {
            processQueuedEvents();
            clearInterval(checkAnalytics);
        }
    }, 500);

    // Stop checking after 10 seconds
    setTimeout(() => clearInterval(checkAnalytics), 10000);
}
