export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error('DISCORD_WEBHOOK_URL not configured');
        return res.status(500).json({ error: 'Webhook not configured' });
    }

    try {
        const { event, quality, processingTime, imageType, audioType } = req.body;

        // Get some basic info (no personal data)
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const browserInfo = getBrowserInfo(userAgent);
        const timestamp = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        // Create Discord embed message
        const embed = {
            embeds: [
                {
                    title: getEventTitle(event),
                    color: getEventColor(event),
                    fields: [
                        {
                            name: '📊 Quality',
                            value: quality || 'N/A',
                            inline: true
                        },
                        {
                            name: '⏱️ Processing Time',
                            value: processingTime ? `${processingTime}s` : 'N/A',
                            inline: true
                        },
                        {
                            name: '🖼️ Image Type',
                            value: imageType || 'N/A',
                            inline: true
                        },
                        {
                            name: '🎵 Audio Type',
                            value: audioType || 'N/A',
                            inline: true
                        },
                        {
                            name: '🌐 Browser',
                            value: browserInfo,
                            inline: true
                        },
                        {
                            name: '📅 Time (IST)',
                            value: timestamp,
                            inline: true
                        }
                    ],
                    footer: {
                        text: 'LooperVid Analytics'
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        };

        // Send to Discord
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(embed)
        });

        if (!response.ok) {
            throw new Error(`Discord webhook failed: ${response.status}`);
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending to Discord:', error);
        return res.status(500).json({ error: 'Failed to log event' });
    }
}

function getEventTitle(event) {
    switch (event) {
        case 'video_processed':
            return '🎬 Video Processed Successfully!';
        case 'processing_started':
            return '⚙️ Processing Started';
        case 'processing_cancelled':
            return '❌ Processing Cancelled';
        case 'processing_failed':
            return '⚠️ Processing Failed';
        default:
            return '📊 Event Logged';
    }
}

function getEventColor(event) {
    switch (event) {
        case 'video_processed':
            return 0x22c55e; // Green
        case 'processing_started':
            return 0x3b82f6; // Blue
        case 'processing_cancelled':
            return 0xf59e0b; // Yellow
        case 'processing_failed':
            return 0xef4444; // Red
        default:
            return 0x6b7280; // Gray
    }
}

function getBrowserInfo(userAgent) {
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        return '🌐 Chrome';
    } else if (userAgent.includes('Firefox')) {
        return '🦊 Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        return '🧭 Safari';
    } else if (userAgent.includes('Edg')) {
        return '🔷 Edge';
    } else if (userAgent.includes('Mobile')) {
        return '📱 Mobile Browser';
    } else {
        return '🌐 Other';
    }
}
