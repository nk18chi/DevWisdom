import { expect, test, describe, vi, beforeEach, Mock } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import runServer from './server';
import logger from './config/logger';
import userDataLoader from './config/dataloader/User.dataLoader';
import connectMongoDB from './infrastructure/mongo/connect';

vi.mock('./infrastructure/mongo/connect');
vi.mock('express', () => ({
  __esModule: true,
  default: () => ({
    use: () => vi.fn(),
  }),
}));
let mockListen: unknown;
vi.mock('http', () => ({
  __esModule: true,
  default: {
    createServer: () => ({
      listen: mockListen,
    }),
  },
}));
vi.mock('./config/logger');
vi.mock('@apollo/server/express4', () => ({
  expressMiddleware: vi.fn(),
}));
vi.mock('@apollo/server/plugin/drainHttpServer', () => ({
  ApolloServerPluginDrainHttpServer: vi.fn(),
}));
describe('server.ts', () => {
  beforeEach(() => {
    vi.spyOn(ApolloServer.prototype, 'start').mockReturnValue(Promise.resolve());
    mockListen = vi.fn().mockImplementation((_, callback) => callback());
    vi.unstubAllEnvs();
  });
  test('start apollo server', async () => {
    await runServer();
    expect(ApolloServer.prototype.start).toHaveBeenCalledTimes(1);
  });
  test('set context', async () => {
    await runServer();
    expect(
      await (expressMiddleware as Mock).mock.calls[0][1].context({
        req: {
          headers: {
            authorization:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzZkZTE5YzZiYjg4NWQyYjhkNTViNTMiLCJpYXQiOjE3MzUyNTQ1NjZ9.W1WuV1jEXzEIecYeiLZ0oqTPJC4tJWecEwylHm1HPZ8',
          },
        },
      }),
    ).toEqual({
      user: {
        _id: '676de19c6bb885d2b8d55b53',
        iat: 1735254566,
      },
      dataLoaders: {
        userDataLoader,
      },
    });
  });
  test('listen localhost:4000', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    await runServer();
    expect(mockListen).toHaveBeenCalledTimes(1);
  });
  test('connect mongo db', async () => {
    await runServer();
    expect(connectMongoDB).toHaveBeenCalledTimes(1);
  });
  test('log when the app started', async () => {
    await runServer();
    expect(logger.info).toHaveBeenCalledWith('🚀 Server ready at http://localhost:4000');
  });
});
