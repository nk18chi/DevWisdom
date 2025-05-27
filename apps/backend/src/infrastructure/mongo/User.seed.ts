import logger from '../../config/logger';
import User from '../../infrastructure/repositories/user/User.schema';

const seedData = async () => {
  const count = await User.countDocuments();
  if (count > 0) {
    logger.info('Database already seeded');
    return;
  }
  await User.insertMany(
    [
      { name: 'Alice', email: 'alice@example.com', password: 'password' },
      { name: 'Bob', email: 'bob@example.com', password: 'password' },
      { name: 'Charlie', email: 'charlie@example.com', password: 'password' },
      { name: 'David', email: 'david@example.com', password: 'password' },
      { name: 'Eve', email: 'eve@example.com', password: 'password' },
      { name: 'Frank', email: 'frank@example.com', password: 'password' },
      { name: 'Grace', email: 'grace@example.com', password: 'password' },
      { name: 'Heidi', email: 'heidi@example.com', password: 'password' },
      { name: 'Ivan', email: 'ivan@example.com', password: 'password' },
      { name: 'Judy', email: 'judy@example.com', password: 'password' },
      { name: 'Kevin', email: 'kevin@example.com', password: 'password' },
      { name: 'Lily', email: 'lily@example.com', password: 'password' },
      { name: 'Mallory', email: 'mallory@example.com', password: 'password' },
      { name: 'Nia', email: 'nia@example.com', password: 'password' },
      { name: 'Oscar', email: 'oscar@example.com', password: 'password' },
      { name: 'Peggy', email: 'peggy@example.com', password: 'password' },
      { name: 'Quentin', email: 'quentin@example.com', password: 'password' },
      { name: 'Rita', email: 'rita@example.com', password: 'password' },
      { name: 'Steve', email: 'steve@example.com', password: 'password' },
      { name: 'Trent', email: 'trent@example.com', password: 'password' },
      { name: 'Ursula', email: 'ursula@example.com', password: 'password' },
      { name: 'Victor', email: 'victor@example.com', password: 'password' },
      { name: 'Wendy', email: 'wendy@example.com', password: 'password' },
      { name: 'Xander', email: 'xander@example.com', password: 'password' },
      { name: 'Yvonne', email: 'yvonne@example.com', password: 'password' },
      { name: 'Zoe', email: 'zoe@example.com', password: 'password' },
    ],
    { ordered: false },
  );
  logger.info('User data is seeded');
};

export default seedData;
