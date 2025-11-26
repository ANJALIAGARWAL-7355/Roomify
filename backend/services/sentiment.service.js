/**
 * Sentiment Analysis Service
 * Analyzes vibe check responses to determine emotional sentiment
 */

export function analyzeSentiment(vibeCheck) {
    const {
        peacefulness,
        noiseLevel,
        cleanliness,
        privacyRespect,
        disagreements,
        additionalComments
    } = vibeCheck

    // Calculate base sentiment from ratings (1-10 scale)
    const avgRating = (
        parseInt(peacefulness) +
        (11 - parseInt(noiseLevel)) + // Inverted (low noise = good)
        parseInt(cleanliness) +
        parseInt(privacyRespect)
    ) / 4

    // Convert to sentiment score (0-100)
    let sentimentScore = (avgRating / 10) * 100

    // Adjust based on disagreements
    const disagreementImpact = {
        'none': 0,
        'minor': -10,
        'moderate': -25,
        'major': -40
    }

    if (disagreements && disagreementImpact[disagreements] !== undefined) {
        sentimentScore += disagreementImpact[disagreements]
    }

    // Text sentiment analysis (simple keyword matching)
    if (additionalComments) {
        const negativeKeywords = [
            'angry', 'frustrated', 'annoying', 'terrible', 'hate',
            'noise', 'messy', 'dirty', 'conflict', 'fight', 'argument'
        ]
        const positiveKeywords = [
            'great', 'good', 'happy', 'peaceful', 'clean',
            'respectful', 'quiet', 'comfortable', 'nice'
        ]

        const text = additionalComments.toLowerCase()
        const negativeCount = negativeKeywords.filter(word => text.includes(word)).length
        const positiveCount = positiveKeywords.filter(word => text.includes(word)).length

        sentimentScore -= (negativeCount * 5)
        sentimentScore += (positiveCount * 3)
    }

    // Clamp between 0-100
    sentimentScore = Math.max(0, Math.min(100, sentimentScore))

    return {
        score: Math.round(sentimentScore),
        classification: sentimentScore >= 70 ? 'positive' : sentimentScore >= 40 ? 'neutral' : 'negative'
    }
}

/**
 * Batch analyze multiple vibe checks
 */
export function batchAnalyzeSentiment(vibeChecks) {
    return vibeChecks.map(vc => ({
        ...vc,
        sentiment: analyzeSentiment(vc)
    }))
}
