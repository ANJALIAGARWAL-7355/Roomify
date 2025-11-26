import { useState } from 'react'

function VibeCheckForm({ onSubmit, roomId, username }) {
    const [formData, setFormData] = useState({
        peacefulness: 5,
        noiseLevel: 5,
        cleanliness: 5,
        privacyRespect: 5,
        disagreements: '',
        additionalComments: ''
    })

    const questions = [
        {
            id: 'peacefulness',
            label: 'How peaceful has your room been this week?',
            type: 'range',
            min: 1,
            max: 10
        },
        {
            id: 'noiseLevel',
            label: 'Are noise levels acceptable?',
            type: 'range',
            min: 1,
            max: 10,
            invertScore: true
        },
        {
            id: 'cleanliness',
            label: 'Rate cleanliness compatibility',
            type: 'range',
            min: 1,
            max: 10
        },
        {
            id: 'privacyRespect',
            label: 'How respected do you feel in your room?',
            type: 'range',
            min: 1,
            max: 10
        }
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ ...formData, roomId, username })

        // Reset form
        setFormData({
            peacefulness: 5,
            noiseLevel: 5,
            cleanliness: 5,
            privacyRespect: 5,
            disagreements: '',
            additionalComments: ''
        })
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card">
            <h2 style={{ marginBottom: '1.5rem' }}>Weekly Vibe Check</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Your responses help maintain a peaceful living environment. Admins can view submissions to manage the hostel better.
            </p>

            {questions.map((question) => (
                <div key={question.id} className="input-group">
                    <label className="input-label">
                        {question.label}
                        <span style={{
                            float: 'right',
                            color: 'var(--primary)',
                            fontWeight: 'bold'
                        }}>
                            {formData[question.id]}/10
                        </span>
                    </label>
                    <input
                        type="range"
                        name={question.id}
                        min={question.min}
                        max={question.max}
                        value={formData[question.id]}
                        onChange={handleChange}
                        className="input-field"
                        style={{
                            cursor: 'pointer',
                            accentColor: 'var(--primary)'
                        }}
                    />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.25rem'
                    }}>
                        <span>Low</span>
                        <span>High</span>
                    </div>
                </div>
            ))}

            <div className="input-group">
                <label className="input-label">
                    Have you had any disagreements this week?
                </label>
                <select
                    name="disagreements"
                    value={formData.disagreements}
                    onChange={handleChange}
                    className="select-field"
                >
                    <option value="">Select...</option>
                    <option value="none">No disagreements</option>
                    <option value="minor">Minor disagreements</option>
                    <option value="moderate">Moderate conflicts</option>
                    <option value="major">Major conflicts</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">
                    Additional comments (optional)
                </label>
                <textarea
                    name="additionalComments"
                    value={formData.additionalComments}
                    onChange={handleChange}
                    className="textarea-field"
                    placeholder="Share any specific concerns or suggestions..."
                />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Submit Vibe Check
            </button>
        </form>
    )
}

export default VibeCheckForm
