import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateDemoData } from './utils/demo-data.js'
import { analyzeSentiment } from './services/sentiment.service.js'
import { calculateRiskScore } from './services/prediction.service.js'
import { generateTips } from './services/tips.service.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substr(2, 9)
        cb(null, 'incident-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = allowedTypes.test(file.mimetype)

        if (mimetype && extname) {
            return cb(null, true)
        } else {
            cb(new Error('Only image files (JPEG, PNG, WebP) are allowed!'))
        }
    }
})

// Serve uploaded files statically
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

// In-memory data store (replace with MongoDB in production)
let dataStore = generateDemoData()

// Add emergency data stores
dataStore.sosAlerts = []
dataStore.incidentReports = []

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

// ===== EMERGENCY FEATURES =====

// Student SOS Alert
app.post('/api/student/sos', (req, res) => {
    try {
        const { username, roomId, message } = req.body

        if (!username || !roomId) {
            return res.status(400).json({ error: 'Username and roomId are required' })
        }

        const sosAlert = {
            id: `sos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            username,
            roomId,
            message: message || 'Emergency - Need immediate help!',
            timestamp: new Date(),
            status: 'pending'
        }

        dataStore.sosAlerts.push(sosAlert)

        console.log(`🚨 SOS ALERT from ${username} in Room ${roomId}`)

        res.json({
            success: true,
            message: 'SOS alert sent successfully',
            alertId: sosAlert.id
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Student Incident Report with Photo
app.post('/api/student/incident-report', upload.single('photo'), (req, res) => {
    try {
        const { username, roomId, description, incidentType } = req.body

        if (!username || !roomId || !description || !incidentType) {
            return res.status(400).json({
                error: 'Username, roomId, description, and incidentType are required'
            })
        }

        const incidentReport = {
            id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            username,
            roomId,
            incidentType,
            description,
            photoUrl: req.file ? `/api/uploads/${req.file.filename}` : null,
            photoFilename: req.file ? req.file.filename : null,
            timestamp: new Date(),
            status: 'pending'
        }

        dataStore.incidentReports.push(incidentReport)

        console.log(`⚠️ INCIDENT REPORT: ${incidentType} from ${username} in Room ${roomId}`)

        res.json({
            success: true,
            message: 'Incident report submitted successfully',
            reportId: incidentReport.id,
            hasPhoto: !!req.file
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Admin: Get all SOS alerts
app.get('/api/admin/sos-alerts', (req, res) => {
    try {
        const { status } = req.query

        let alerts = dataStore.sosAlerts

        if (status && status !== 'all') {
            alerts = alerts.filter(alert => alert.status === status)
        }

        // Sort by timestamp, newest first
        alerts = alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        // Add room information
        const alertsWithRoomInfo = alerts.map(alert => {
            const room = dataStore.rooms.find(r => r.number === alert.roomId)
            return {
                ...alert,
                roomInfo: room ? { number: room.number, riskScore: room.riskScore } : null
            }
        })

        res.json({
            alerts: alertsWithRoomInfo,
            total: alerts.length,
            pending: dataStore.sosAlerts.filter(a => a.status === 'pending').length
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Admin: Mark SOS alert as resolved
app.patch('/api/admin/sos-alerts/:id', (req, res) => {
    try {
        const { id } = req.params
        const { status, notes } = req.body

        const alert = dataStore.sosAlerts.find(a => a.id === id)

        if (!alert) {
            return res.status(404).json({ error: 'SOS alert not found' })
        }

        alert.status = status || 'resolved'
        alert.resolvedAt = new Date()
        alert.adminNotes = notes || ''

        res.json({
            success: true,
            message: 'SOS alert updated successfully',
            alert
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Admin: Get all incident reports
app.get('/api/admin/incident-reports', (req, res) => {
    try {
        const { status, type } = req.query

        let reports = dataStore.incidentReports

        if (status && status !== 'all') {
            reports = reports.filter(report => report.status === status)
        }

        if (type && type !== 'all') {
            reports = reports.filter(report => report.incidentType === type)
        }

        // Sort by timestamp, newest first
        reports = reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        // Add room information
        const reportsWithRoomInfo = reports.map(report => {
            const room = dataStore.rooms.find(r => r.number === report.roomId)
            return {
                ...report,
                roomInfo: room ? { number: room.number, riskScore: room.riskScore } : null
            }
        })

        res.json({
            reports: reportsWithRoomInfo,
            total: reports.length,
            pending: dataStore.incidentReports.filter(r => r.status === 'pending').length
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Admin: Mark incident report as resolved
app.patch('/api/admin/incident-reports/:id', (req, res) => {
    try {
        const { id } = req.params
        const { status, actionTaken } = req.body

        const report = dataStore.incidentReports.find(r => r.id === id)

        if (!report) {
            return res.status(404).json({ error: 'Incident report not found' })
        }

        report.status = status || 'resolved'
        report.resolvedAt = new Date()
        report.actionTaken = actionTaken || ''

        res.json({
            success: true,
            message: 'Incident report updated successfully',
            report
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
