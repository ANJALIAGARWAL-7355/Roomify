/**
 * Demo Data Generator
 * Creates realistic sample data for demonstration
 */

export function generateDemoData() {
    const rooms = [
        { id: 1, number: '301', riskScore: 18, occupants: 3, trend: 'stable', weeksAtRisk: 0 },
        { id: 2, number: '302', riskScore: 45, occupants: 2, trend: 'increasing', weeksAtRisk: 2 },
        { id: 3, number: '303', riskScore: 22, occupants: 3, trend: 'decreasing', weeksAtRisk: 0 },
        { id: 4, number: '304', riskScore: 72, occupants: 4, trend: 'increasing', weeksAtRisk: 3 },
        { id: 5, number: '305', riskScore: 15, occupants: 2, trend: 'stable', weeksAtRisk: 0 },
        { id: 6, number: '306', riskScore: 38, occupants: 3, trend: 'stable', weeksAtRisk: 1 },
        { id: 7, number: '307', riskScore: 65, occupants: 2, trend: 'increasing', weeksAtRisk: 3 },
        { id: 8, number: '308', riskScore: 28, occupants: 3, trend: 'decreasing', weeksAtRisk: 0 },
        { id: 9, number: '309', riskScore: 12, occupants: 2, trend: 'stable', weeksAtRisk: 0 },
        { id: 10, number: '310', riskScore: 55, occupants: 4, trend: 'increasing', weeksAtRisk: 2 },
        { id: 11, number: '311', riskScore: 20, occupants: 3, trend: 'stable', weeksAtRisk: 0 },
        { id: 12, number: '312', riskScore: 8, occupants: 2, trend: 'stable', weeksAtRisk: 0 },
        { id: 13, number: '313', riskScore: 25, occupants: 3, trend: 'stable', weeksAtRisk: 0 },
        { id: 14, number: '314', riskScore: 25, occupants: 2, trend: 'stable', weeksAtRisk: 0 },
        { id: 15, number: '315', riskScore: 42, occupants: 3, trend: 'increasing', weeksAtRisk: 1 },
    ]

    // Add history to each room
    rooms.forEach(room => {
        room.history = generateRoomHistory(room.riskScore, room.trend)
        room.lastUpdated = new Date()
    })

    const vibeChecks = generateSampleVibeChecks(rooms)
    const trendData = generateTrendData()

    return {
        rooms,
        vibeChecks,
        trendData
    }
}

function generateRoomHistory(currentScore, trend) {
    const history = []
    let score = currentScore

    for (let i = 6; i >= 0; i--) {
        if (trend === 'increasing') {
            score = Math.max(5, score - (Math.random() * 5 + 2))
        } else if (trend === 'decreasing') {
            score = Math.min(95, score + (Math.random() * 5 + 2))
        } else {
            score = score + (Math.random() * 10 - 5) // Random fluctuation
        }
        history.push(Math.round(Math.max(0, Math.min(100, score))))
    }

    return history.reverse()
}

function generateSampleVibeChecks(rooms) {
    const vibeChecks = []
    const now = new Date()
    const studentNames = ['alice_smith', 'bob_jones', 'carol_white', 'david_brown', 'emma_davis']

    rooms.forEach(room => {
        // Generate 2-4 vibe checks per room
        const checkCount = Math.floor(Math.random() * 3) + 2

        for (let i = 0; i < checkCount; i++) {
            const daysAgo = i * 7 // Weekly checks
            const timestamp = new Date(now - daysAgo * 24 * 60 * 60 * 1000)

            const studentIndex = Math.floor(Math.random() * studentNames.length)
            const username = studentNames[studentIndex]
            const submissionId = `vc_${timestamp.getTime()}_${room.number}_${i}`

            vibeChecks.push({
                id: submissionId,
                username,
                roomId: room.number,
                peacefulness: Math.floor(Math.random() * 5) + (room.riskScore < 30 ? 6 : room.riskScore < 60 ? 4 : 2),
                noiseLevel: Math.floor(Math.random() * 4) + (room.riskScore < 30 ? 3 : room.riskScore < 60 ? 5 : 7),
                cleanliness: Math.floor(Math.random() * 5) + (room.riskScore < 30 ? 6 : room.riskScore < 60 ? 4 : 2),
                privacyRespect: Math.floor(Math.random() * 5) + (room.riskScore < 30 ? 6 : room.riskScore < 60 ? 4 : 2),
                disagreements: room.riskScore < 30 ? 'none' : room.riskScore < 60 ? 'minor' : 'moderate',
                additionalComments: '',
                timestamp,
                sentiment: {
                    score: 100 - room.riskScore + Math.floor(Math.random() * 20 - 10),
                    classification: room.riskScore < 30 ? 'positive' : room.riskScore < 60 ? 'neutral' : 'negative'
                }
            })
        }
    })

    return vibeChecks
}

function generateTrendData() {
    const trends = []

    for (let i = 1; i <= 8; i++) {
        trends.push({
            week: i,
            conflicts: Math.floor(Math.random() * 10) + 8,
            satisfaction: Math.floor(Math.random() * 15) + 65
        })
    }

    return trends
}
