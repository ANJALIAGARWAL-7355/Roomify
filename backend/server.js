import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateDemoData } from './utils/demo-data.js'
import { analyzeSentiment } from './services/sentiment.service.js'
import { calculateRiskScore } from './services/prediction.service.js'
import { generateTips } from './services/tips.service.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// In-memory data store (replace with MongoDB in production)
let dataStore = generateDemoData()

// ===== ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Roomify API is running' })
})

// Student Routes
app.post('/api/student/vibe-check', (req, res) => {
    try {
        const vibeCheck = req.body
        const { roomId, username } = vibeCheck

        if (!username) {
            return res.status(400).json({ error: 'Username is required' })
        }

        // Analyze sentiment
        const sentiment = analyzeSentiment(vibeCheck)

        // Generate unique ID for this submission
        const submissionId = `vc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        // Store vibe check with username
        dataStore.vibeChecks.push({
            id: submissionId,
            ...vibeCheck,
            sentiment,
            timestamp: new Date()
        })

        // Recalculate room risk score
        const room = dataStore.rooms.find(r => r.number === roomId)
        if (room) {
            const roomVibeChecks = dataStore.vibeChecks.filter(vc => vc.roomId === roomId)
            room.riskScore = calculateRiskScore(roomVibeChecks)
        }

        res.json({
            success: true,
            message: 'Vibe check submitted successfully',
            newRiskScore: room?.riskScore
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/student/harmony-score/:roomId', (req, res) => {
    try {
        const { roomId } = req.params
        const room = dataStore.rooms.find(r => r.number === roomId)

        if (!room) {
            return res.status(404).json({ error: 'Room not found' })
        }

        res.json({
            roomId,
            score: room.riskScore,
            history: room.history || [],
            lastUpdated: room.lastUpdated
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/student/tips/:roomId', (req, res) => {
    try {
        const { roomId } = req.params
        const room = dataStore.rooms.find(r => r.number === roomId)

        if (!room) {
            return res.status(404).json({ error: 'Room not found' })
        }

        const roomVibeChecks = dataStore.vibeChecks.filter(vc => vc.roomId === roomId)
        const tips = generateTips(room.riskScore, roomVibeChecks)

        res.json({ tips })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Admin Routes
app.get('/api/admin/dashboard', (req, res) => {
    try {
        const stats = {
            totalRooms: dataStore.rooms.length,
            highRiskRooms: dataStore.rooms.filter(r => r.riskScore >= 60).length,
            mediumRiskRooms: dataStore.rooms.filter(r => r.riskScore >= 30 && r.riskScore < 60).length,
            lowRiskRooms: dataStore.rooms.filter(r => r.riskScore < 30).length,
            totalVibeChecks: dataStore.vibeChecks.length,
            averageRiskScore: Math.round(
                dataStore.rooms.reduce((sum, r) => sum + r.riskScore, 0) / dataStore.rooms.length
            )
        }

        res.json(stats)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/admin/rooms', (req, res) => {
    try {
        res.json({ rooms: dataStore.rooms })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/admin/alerts', (req, res) => {
    try {
        const highRiskRooms = dataStore.rooms
            .filter(r => r.riskScore >= 60)
            .map(room => ({
                roomId: room.number,
                riskScore: room.riskScore,
                trend: room.trend,
                message: `Room ${room.number} has been showing high conflict risk for ${room.weeksAtRisk || 1} week(s)`
            }))

        res.json({ alerts: highRiskRooms })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/admin/intervene', (req, res) => {
    try {
        const { roomId, message } = req.body

        // In production, this would send notifications to students
        console.log(`Intervention sent to Room ${roomId}: ${message}`)

        res.json({
            success: true,
            message: 'Intervention message sent successfully'
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/admin/trends', (req, res) => {
    try {
        // Generate weekly trend data
        const trends = dataStore.trendData || []
        res.json({ trends })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/admin/submissions', (req, res) => {
    try {
        // Return all vibe checks with user information
        const submissions = dataStore.vibeChecks
            .map(vc => ({
                id: vc.id,
                username: vc.username || 'Anonymous',
                roomId: vc.roomId,
                timestamp: vc.timestamp,
                peacefulness: vc.peacefulness,
                noiseLevel: vc.noiseLevel,
                cleanliness: vc.cleanliness,
                privacyRespect: vc.privacyRespect,
                disagreements: vc.disagreements,
                additionalComments: vc.additionalComments,
                sentimentScore: vc.sentiment?.score || 0
            }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        res.json({ submissions, total: submissions.length })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete('/api/admin/submissions/:id', (req, res) => {
    try {
        const { id } = req.params
        const index = dataStore.vibeChecks.findIndex(vc => vc.id === id)

        if (index === -1) {
            return res.status(404).json({ error: 'Submission not found' })
        }

        const deleted = dataStore.vibeChecks.splice(index, 1)[0]

        // Recalculate room risk score
        const room = dataStore.rooms.find(r => r.number === deleted.roomId)
        if (room) {
            const roomVibeChecks = dataStore.vibeChecks.filter(vc => vc.roomId === deleted.roomId)
            room.riskScore = calculateRiskScore(roomVibeChecks)
        }

        res.json({
            success: true,
            message: 'Submission deleted successfully',
            deleted: { id: deleted.id, username: deleted.username, roomId: deleted.roomId }
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete('/api/admin/users/:username', (req, res) => {
    try {
        const { username } = req.params
        const initialCount = dataStore.vibeChecks.length

        // Get all rooms affected by this deletion
        const affectedRoomIds = [...new Set(
            dataStore.vibeChecks
                .filter(vc => vc.username === username)
                .map(vc => vc.roomId)
        )]

        // Remove all submissions from this user
        dataStore.vibeChecks = dataStore.vibeChecks.filter(vc => vc.username !== username)
        const deletedCount = initialCount - dataStore.vibeChecks.length

        // Recalculate risk scores for affected rooms
        affectedRoomIds.forEach(roomId => {
            const room = dataStore.rooms.find(r => r.number === roomId)
            if (room) {
                const roomVibeChecks = dataStore.vibeChecks.filter(vc => vc.roomId === roomId)
                room.riskScore = calculateRiskScore(roomVibeChecks)
            }
        })

        res.json({
            success: true,
            message: `Deleted ${deletedCount} submission(s) from user ${username}`,
            deletedCount,
            affectedRooms: affectedRoomIds
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Roomify API running on http://localhost:${PORT}`)
    console.log(`📊 Demo data loaded with ${dataStore.rooms.length} rooms`)
})
