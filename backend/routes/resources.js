const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(resources);
  } catch (e) {
    res.status(500).json({ error: 'Could not fetch resources' });
  }
});

router.post('/', async (req, res) => {
  const { type, name, latitude, longitude, status } = req.body;

  if (!type || !name || !latitude || !longitude) {
    return res.status(400).json({ error: 'Type, name, latitude and longitude are required' });
  }

  try {
    const resource = await prisma.resource.create({
      data: {
        type,
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        status: status || 'available'
      }
    });

    req.app.get('io').emit('resource_updated', resource);
    res.json(resource);
  } catch (e) {
    res.status(500).json({ error: 'Could not create resource' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const resource = await prisma.resource.update({
      where: { id: req.params.id },
      data: req.body
    });

    req.app.get('io').emit('resource_updated', resource);
    res.json(resource);
  } catch (e) {
    res.status(500).json({ error: 'Could not update resource' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.resource.delete({ where: { id: req.params.id } });
    res.json({ message: 'Resource deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Could not delete resource' });
  }
});

module.exports = router;