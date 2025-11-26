/**
 * Tips Generation Service
 * Generates personalized peace tips based on room data
 */

export function generateTips(riskScore, vibeChecks = []) {
    const tips = []

    // Analyze recent issues
    const recentIssues = analyzeIssues(vibeChecks)

    // High risk tips
    if (riskScore >= 60) {
        tips.push({
            title: 'Schedule a Room Meeting',
            description: 'Set aside time this week to discuss concerns openly with your roommates. Use "I" statements and focus on solutions.',
            priority: 'high'
        })
    }

    // Noise-related tips
    if (recentIssues.noise > 2) {
        tips.push({
            title: 'Establish Quiet Hours',
            description: 'Agree on quiet hours between 11 PM - 7 AM for better sleep quality. Consider using headphones during personal activities.',
            priority: riskScore >= 60 ? 'high' : 'medium'
        })
    }

    // Cleanliness tips
    if (recentIssues.cleanliness > 2) {
        tips.push({
            title: 'Create a Cleaning Schedule',
            description: 'A simple rotation system prevents conflicts. Assign specific tasks and days to each roommate.',
            priority: 'medium'
        })
    }

    // Privacy tips
    if (recentIssues.privacy > 2) {
        tips.push({
            title: 'Discuss Privacy Boundaries',
            description: 'Talk about expectations for guests, personal space, and borrowing items. Clear communication prevents misunderstandings.',
            priority: 'medium'
        })
    }

    // Disagreement history
    if (recentIssues.disagreements > 1) {
        tips.push({
            title: 'Practice Active Listening',
            description: 'When conflicts arise, try to understand your roommate\'s perspective before responding. Seek to find middle ground.',
            priority: 'high'
        })
    }

    // Medium risk tips
    if (riskScore >= 30 && riskScore < 60) {
        tips.push({
            title: 'Regular Check-ins',
            description: 'Have a weekly 10-minute check-in to address small issues before they grow. Prevention is easier than resolution.',
            priority: 'medium'
        })
    }

    // Low risk / positive reinforcement
    if (riskScore < 30) {
        tips.push({
            title: 'Maintain Your Positive Vibes!',
            description: 'Your room shows great harmony. Keep being respectful, communicative, and considerate of each other.',
            priority: 'low'
        })

        tips.push({
            title: 'Build Stronger Connections',
            description: 'Consider occasional room activities like movie nights or study sessions to strengthen your roommate relationships.',
            priority: 'low'
        })
    }

    // Trend-based tips
    if (vibeChecks.length >= 3) {
        const scores = vibeChecks.slice(-3).map(vc => vc.sentiment?.score || 50)
        const isWorsening = scores[0] > scores[1] && scores[1] > scores[2]

        if (isWorsening) {
            tips.push({
                title: 'Address the Trend',
                description: 'Room satisfaction has been declining. Identify what changed recently and address it proactively.',
                priority: 'high'
            })
        }
    }

    return tips.slice(0, 5) // Return top 5 tips
}

/**
 * Analyze common issues from vibe checks
 */
function analyzeIssues(vibeChecks) {
    const issues = {
        noise: 0,
        cleanliness: 0,
        privacy: 0,
        disagreements: 0
    }

    vibeChecks.forEach(vc => {
        if (vc.noiseLevel && vc.noiseLevel > 7) issues.noise++
        if (vc.cleanliness && vc.cleanliness < 4) issues.cleanliness++
        if (vc.privacyRespect && vc.privacyRespect < 4) issues.privacy++
        if (vc.disagreements === 'moderate' || vc.disagreements === 'major') {
            issues.disagreements++
        }
    })

    return issues
}

/**
 * Generate admin-level recommendations
 */
export function generateAdminRecommendations(allRooms, allVibeChecks) {
    const recommendations = []

    // Find common patterns across all rooms
    const commonIssues = {
        noise: 0,
        cleanliness: 0,
        privacy: 0
    }

    allVibeChecks.forEach(vc => {
        if (vc.noiseLevel > 7) commonIssues.noise++
        if (vc.cleanliness < 4) commonIssues.cleanliness++
        if (vc.privacyRespect < 4) commonIssues.privacy++
    })

    const totalChecks = allVibeChecks.length || 1

    // If >30% report same issue, it's hostel-wide
    if (commonIssues.noise / totalChecks > 0.3) {
        recommendations.push({
            title: 'Hostel-Wide Noise Policy Needed',
            description: `${Math.round((commonIssues.noise / totalChecks) * 100)}% of responses cite noise issues. Consider implementing quiet hours.`,
            priority: 'high'
        })
    }

    if (commonIssues.cleanliness / totalChecks > 0.3) {
        recommendations.push({
            title: 'Cleanliness Initiative Required',
            description: 'Multiple rooms report cleanliness concerns. Consider cleanliness workshops or incentive programs.',
            priority: 'medium'
        })
    }

    // High risk room count
    const highRiskCount = allRooms.filter(r => r.riskScore >= 60).length
    if (highRiskCount > 0) {
        recommendations.push({
            title: `${highRiskCount} Room(s) Require Immediate Attention`,
            description: 'These rooms show high conflict risk. Consider mediation or room changes.',
            priority: 'high'
        })
    }

    return recommendations
}
