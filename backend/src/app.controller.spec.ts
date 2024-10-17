import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { authentication, random } from '../utilities/encryption';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(appController.getHello()).toBe('Hello World!');
  //   });
  // });

  // describe('random', () => {
  //   it('should generate a unique string each time it is called', () => {
  //     const randomString1 = random();
  //     const randomString2 = random();
  //     expect(randomString1).not.toEqual(randomString2);
  //   });
  // });

  describe('authentication', () => {
    it('should generate a consistent hash for the same salt and password', () => {
      const salt = 'some-salt';
      const password = 'some-password';
      const hash1 = authentication(salt, password);
      const hash2 = authentication(salt, password);
      expect(hash1).toEqual(hash2);
    });

    it('should generate different hashes for different salts', () => {
      const password = 'some-password';
      const hash1 = authentication('salt1', password);
      const hash2 = authentication('salt2', password);
      expect(hash1).not.toEqual(hash2);
    });

    it('should generate different hashes for different passwords', () => {
      const salt = 'some-salt';
      const hash1 = authentication(salt, 'password1');
      const hash2 = authentication(salt, 'password2');
      expect(hash1).not.toEqual(hash2);
    });
  });
});
