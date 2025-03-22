import { faker } from '@faker-js/faker';

const TASK_STATUSES = ['active', 'inactive', 'completed', 'in-progress'];

// Helper function to create an array of random powers for superheroes' profile
const generatePowers = () => {
  const possiblePowers = [
    'Flight',
    'Invisibility',
    'Super Strength',
    'Time Travel',
    'Telepathy',
    'Telekinesis',
    'Super Speed',
    'Underwater Breathing',
    'Shape Shifting',
    'Laser Vision',
    'Fire Breath'
  ];

  // Random number of powers from 1 to 4
  const numPowers = faker.number.int({ min: 1, max: 4 });
  return faker.helpers.arrayElements(possiblePowers, numPowers);
};

// Generate mock job posters
export const generateMockJobPosters = (count = 5) => {
  const jobPosters = [];

  // Generate an embedded profile as per schema
  for (let i = 0; i < count; i++) {
    const profile = {
      bio: faker.lorem.sentence(),
      image: faker.image.personPortrait(),
      avgRating: parseFloat(faker.number.float({ min: 1.0, max: 5.0, precision: 0.1 })),
      numReviews: faker.number.int({ min: 0, max: 100 }),
      powers: ['None']
    };

    jobPosters.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      role: faker.helpers.arrayElement(['Job Poster']),
      profile: profile,
      task_posted: [],
      tasks_completed: []
    });
  }

  return jobPosters;
};

// Generate mock users
export const generateMockSuperheroes = (count = 5) => {
  const superheroes = [];

  // Generate an embedded profile as per schema
  for (let i = 0; i < count; i++) {
    const profile = {
      bio: faker.lorem.sentence(),
      avgRating: parseFloat(faker.number.float({ min: 1.0, max: 5.0, precision: 0.1 })),
      numReviews: faker.number.int({ min: 0, max: 100 }),
      powers: generatePowers()
    };

    superheroes.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      role: faker.helpers.arrayElement(['Superhero']),
      profile: profile,
      task_posted: [],
      tasks_completed: []
    });
  }

  return superheroes;
};

// Generate mock jobs
export const generateMockTasks = (jobPosters, count = 5) => {
  const tasks = [];

  for (let i = 0; i < count; i++) {
    const randomUser = faker.helpers.arrayElement(jobPosters);
    

    tasks.push({
      _id: faker.database.mongodbObjectId(),
      title: faker.hacker.phrase(),
      creator: randomUser._id,
      location: `${faker.location.city()}, ${faker.location.country()}`,
      description: faker.lorem.sentence(),
      postDate: faker.date.recent(30),
      image: faker.image.urlPicsumPhotos({ blur: 0, width: 128, height: 128 }),
      status: faker.helpers.arrayElement(TASK_STATUSES),
      claimedBy: null
    });
  }

  return tasks;
};

/* 
Example usage
const creators = generateMockJobPosters(10);
const tasks = generateMockTasks(creators, 20); 
*/