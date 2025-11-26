/**
 * Conflict Prediction Service
 * Calculates risk scores and predicts potential conflicts
 */

export function calculateRiskScore(vibeChecks) {
    if (!vibeChecks || vibeChecks.length === 0) {
        return Math.floor(Math.random() * 30) + 10 // Random low score for demo
    }

    // Get recent vibe checks (last 4 weeks)
    const recentChecks = vibeChecks.slice(-4)

    // Calculate average sentiment
    const avgSentiment = recentChecks.reduce((sum, vc) => {
        return sum + (vc.sentiment?.score || 50)
    }, 0) / recentChecks.length

    // Invert sentiment to risk (high sentiment = low risk)
    let riskScore = 100 - avgSentiment

    // Detect negative trends (increasing risk over time)
    if (recentChecks.length >= 3) {
        const trend = detectTrend(recentChecks)
        if (trend === 'worsening') {
            riskScore += 15 // Boost risk for worsening trends
        } else if (trend === 'improving') {
            riskScore -= 10 // Reduce risk for improving trends
        }
    }

    // Pattern detection - cluster similar issues
    const patterns = detectPatterns(recentChecks)
    if (patterns.repeatedIssues) {
        riskScore += 10 // Persistent issues increase risk
    }

    // Check for sudden dips in satisfaction
    const hasSuddenDip = checkSuddenDip(recentChecks)
    if (hasSuddenDip) {
        riskScore += 20
    }

    // Clamp between 0-100
    riskScore = Math.max(0, Math.min(100, Math.round(riskScore)))

    return riskScore
}

/**
 * Detect sentiment trend over time
 */
function detectTrend(vibeChecks) {
    if (vibeChecks.length < 2) return 'stable'

    const scores = vibeChecks.map(vc => vc.sentiment?.score || 50)
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2))
    const secondHalf = scores.slice(Math.floor(scores.length / 2))

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length

    if (secondAvg < firstAvg - 10) return 'worsening'
    if (secondAvg > firstAvg + 10) return 'improving'
    return 'stable'
}

/**
 * Detect repeated issue patterns
 */
function detectPatterns(vibeChecks) {
    const issues = {
        noise: 0,
        cleanliness: 0,
        privacy: 0,
        disagreements: 0
    }

    vibeChecks.forEach(vc => {
        if (vc.noiseLevel > 7) issues.noise++
        if (vc.cleanliness < 4) issues.cleanliness++
        if (vc.privacyRespect < 4) issues.privacy++
        if (vc.disagreements === 'moderate' || vc.disagreements === 'major') {
            issues.disagreements++
        }
    })

    // If any issue appears in 50%+ of checks, it's a pattern
    const threshold = vibeChecks.length / 2
    const repeatedIssues = Object.values(issues).some(count => count >= threshold)

    return {
        repeatedIssues,
        primaryIssue: Object.entries(issues)
            .sort((a, b) => b[1] - a[1])[0][0]
    }
}

/**
 * Check for sudden drops in satisfaction
 */
function checkSuddenDip(vibeChecks) {
    if (vibeChecks.length < 2) return false

    const scores = vibeChecks.map(vc => vc.sentiment?.score || 50)

    for (let i = 1; i < scores.length; i++) {
        const drop = scores[i - 1] - scores[i]
        if (drop > 25) return true // 25+ point drop is significant
    }

    return false
}

/**
 * Calculate conflict risk index with detailed breakdown
 */
export function calculateDetailedRisk(vibeChecks) {
    const riskScore = calculateRiskScore(vibeChecks)
    const patterns = detectPatterns(vibeChecks)
    const trend = detectTrend(vibeChecks)

    return {
        overallRisk: riskScore,
        riskLevel: riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high',
        trend,
        patterns,
        recommendations: generateRecommendations(riskScore, patterns)
    }
}

function generateRecommendations(riskScore, patterns) {
    const recommendations = []

    if (riskScore >= 60) {
        recommendations.push('Immediate intervention recommended')
        recommendations.push('Schedule mediation session')
    }

    if (patterns.primaryIssue === 'noise') {
        recommendations.push('Establish quiet hours policy')
    }
    if (patterns.primaryIssue === 'cleanliness') {
        recommendations.push('Create cleaning rotation schedule')
    }
    if (patterns.primaryIssue === 'privacy') {
        recommendations.push('Discuss privacy boundaries')
    }

    return recommendations
}
