const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@resqlink.com' },
    update: {},
    create: {
      email: 'admin@resqlink.com',
      password: adminHash,
      role: 'admin'
    }
  });
  console.log('Admin created: admin@resqlink.com / admin123');

  const authorityHash = await bcrypt.hash('authority123', 10);
  await prisma.user.upsert({
    where: { email: 'authority@resqlink.com' },
    update: {},
    create: {
      email: 'authority@resqlink.com',
      password: authorityHash,
      role: 'authority'
    }
  });
  console.log('Authority created: authority@resqlink.com / authority123');

  await prisma.incident.deleteMany({});
  console.log('Cleared old incidents');

  await prisma.incident.createMany({
    data: [
      {
        type: 'flood',
        description: 'Heavy flooding in Mumbai coastal areas, residents trapped in ground floors. Water level rising rapidly.',
        latitude: 19.076,
        longitude: 72.877,
        severity: 'critical',
        aiAction: 'Deploy NDRF rescue boats immediately, evacuate ground floor residents within 2km radius.',
        safeRoute: 'Use Eastern Express Highway northbound, avoid SV Road and Linking Road.',
        isFake: false,
        fakeScore: 0.03,
        status: 'open',
        reportedBy: 'citizen-mumbai'
      },
      {
        type: 'earthquake',
        description: 'Magnitude 5.2 tremors felt across Pune district. Multiple buildings showing cracks.',
        latitude: 18.520,
        longitude: 73.856,
        severity: 'high',
        aiAction: 'Activate search and rescue teams, evacuate structurally weak buildings immediately.',
        safeRoute: 'Move to open grounds, avoid flyovers and old buildings. Pune University ground is safe.',
        isFake: false,
        fakeScore: 0.04,
        status: 'in-progress',
        reportedBy: 'authority-pune'
      },
      {
        type: 'fire',
        description: 'Industrial fire spreading fast in Bengaluru electronics manufacturing zone. Toxic smoke reported.',
        latitude: 12.971,
        longitude: 77.594,
        severity: 'high',
        aiAction: 'Deploy 3 fire engines, evacuate 500m radius, alert nearby hospitals for burn casualties.',
        safeRoute: 'Evacuate via Outer Ring Road southbound, avoid Whitefield Road.',
        isFake: false,
        fakeScore: 0.08,
        status: 'open',
        reportedBy: 'fire-dept-blr'
      },
      {
        type: 'cyclone',
        description: 'Category 3 cyclone approaching Odisha coast. Wind speeds 150 km/h expected in 6 hours.',
        latitude: 20.296,
        longitude: 85.824,
        severity: 'critical',
        aiAction: 'Issue red alert for coastal districts, begin mass evacuation within 10km of coastline.',
        safeRoute: 'Move inland via NH-16 westbound to designated cyclone shelters.',
        isFake: false,
        fakeScore: 0.02,
        status: 'open',
        reportedBy: 'imd-odisha'
      },
      {
        type: 'landslide',
        description: 'Minor landslide reported on Manali highway. Road partially blocked.',
        latitude: 32.239,
        longitude: 77.188,
        severity: 'moderate',
        aiAction: 'Deploy SDRF team, close highway for 4 hours, arrange alternative route via local road.',
        safeRoute: 'Use old Manali road via Naggar as alternative.',
        isFake: false,
        fakeScore: 0.12,
        status: 'resolved',
        reportedBy: 'highway-authority'
      }
    ]
  });
  console.log('Demo incidents created');

  await prisma.resource.deleteMany({});
  await prisma.resource.createMany({
    data: [
      { type: 'ambulance', name: 'Ambulance Unit A-1', latitude: 19.100, longitude: 72.900, status: 'deployed' },
      { type: 'ambulance', name: 'Ambulance Unit A-2', latitude: 18.540, longitude: 73.880, status: 'available' },
      { type: 'shelter', name: 'Relief Camp - Dharavi', latitude: 19.040, longitude: 72.854, status: 'active' },
      { type: 'shelter', name: 'Shelter - Pune East', latitude: 18.560, longitude: 73.900, status: 'active' },
      { type: 'rescue_team', name: 'NDRF Team 3', latitude: 19.200, longitude: 72.980, status: 'deployed' },
      { type: 'fire_engine', name: 'Fire Unit BLR-7', latitude: 12.980, longitude: 77.600, status: 'deployed' }
    ]
  });
  console.log('Demo resources created');

  console.log('\nDatabase seeded successfully!');
  console.log('Login credentials:');
  console.log('  Admin: admin@resqlink.com / admin123');
  console.log('  Authority: authority@resqlink.com / authority123');
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });