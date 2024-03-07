import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { FacebookStrategy } from '../../strategy/facebook/facebook.strategy';
import { FacebookOAuthStrategyFactory } from './facebook-strategy.factory';

describe('FacebookOAuthStrategyFactory', () => {
  let factory: FacebookOAuthStrategyFactory;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ConfigService, useValue: { get: jest.fn() } }],
    }).compile();
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it('disable when credentials are not present', () => {
    jest.spyOn(configService, 'get').mockReturnValue('');
    factory = new FacebookOAuthStrategyFactory(configService);
    expect(factory.isOAuthEnabled()).toBe(false);
  });

  it('return null when OAuth disabled', () => {
    const strategy = factory.createOAuthStrategy();
    expect(strategy).toBeNull();
  });

  it('enable OAuth when credentials present', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementation((key) =>
        key === 'FACEBOOK_CLIENT_ID' ||
        key === 'FACEBOOK_CLIENT_SECRET' ||
        key === 'FACEBOOK_CALLBACK_URL'
          ? 'test'
          : '',
      );
    factory = new FacebookOAuthStrategyFactory(configService);
    expect(factory.isOAuthEnabled()).toBe(true);
  });

  it('create OAuth strategy when enabled', () => {
    const strategy = factory.createOAuthStrategy();
    expect(strategy).toBeInstanceOf(FacebookStrategy);
  });
});
