const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const Anthropic = require('@anthropic-ai/sdk');
const prisma = new PrismaClient();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.get('/', async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(incidents);
  } catch (e) {
    console.error('Error fetching incidents:', e);
    res.status(500).json({ error: 'Could not fetch incidents' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const incident = await prisma.incident.findUnique({
      where: { id: req.params.id }
    });
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json(incident);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { type, description, latitude, longitude, reportedBy } = req.body;

  if (!type || !description || !latitude || !longitude) {
    return res.status(400).json({ error: 'Type, description, latitude and longitude are required' });
  }

  let severity = 'low';
  let aiAction = 'Monitor the situation and await further updates.';
  let isFake = false;
  let fakeScore = 0.05;

  try {
    console.log('Calling Claude API for triage...');

    const triageResp = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `You are a disaster response AI triage system.

Analyze this incident report:
- Disaster Type: ${type}
- Description: ${description}
- Location coordinates: ${latitude}, ${longitude}

Respond ONLY with a valid JSON object in this exact format, nothing else:
{
  "severity": "critical",
  "action": "Deploy NDRF rescue teams immediately and evacuate the area",
  "fakeScore": 0.05,
  "safeRoute": "Use NH-48 northbound, avoid coastal roads"
}

Rules:
- severity must be one of: critical, high, moderate, low
- action must be one clear actionable sentence for responders
- fakeScore is between 0.0 (definitely real) and 1.0 (definitely fake)
- safeRoute is a short evacuation suggestion
- respond with JSON only, no extra text`
      }]
    });

    const rawText = triageResp.content[0].text.trim();
    console.log('Claude response:', rawText);

    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText);

    severity = parsed.severity || 'low';
    aiAction = parsed.action || aiAction;
    fakeScore = typeof parsed.fakeScore === 'number' ? parsed.fakeScore : 0.05;
    isFake = fakeScore > 0.7;

    console.log('AI Triage complete:', { severity, aiAction, fakeScore, isFake });

  } catch (e) {
    console.error('Claude API error:', e.message);
  }

  try {
    const incident = await prisma.incident.create({
      data: {
        type,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        reportedBy: reportedBy || 'anonymous',
        severity,
        aiAction,
        isFake,
        fakeScore,
        status: 'open'
      }
    });

    req.app.get('io').emit('new_incident', incident);
    console.log('New incident created and broadcasted:', incident.id);

    res.json(incident);

  } catch (e) {
    console.error('Database error:', e);
    res.status(500).json({ error: 'Could not save incident' });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const validStatuses = ['open', 'in-progress', 'resolved'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be open, in-progress, or resolved' });
  }

  try {
    const incident = await prisma.incident.update({
      where: { id: req.params.id },
      data: { status }
    });

    req.app.get('io').emit('incident_updated', incident);
    console.log('Incident status updated:', incident.id, '->', status);

    res.json(incident);
  } catch (e) {
    console.error('Update error:', e);
    res.status(500).json({ error: 'Could not update incident' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.incident.delete({ where: { id: req.params.id } });
    req.app.get('io').emit('incident_deleted', { id: req.params.id });
    res.json({ message: 'Incident deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Could not delete incident' });
  }
});

module.exports = router;