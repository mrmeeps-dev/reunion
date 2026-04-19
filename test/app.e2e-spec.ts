import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Reunion site (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
  });

  it('/ (GET) serves the reunion landing page', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect((res) => {
        expect(res.text).toContain('Sahuaro High School');
        expect(res.text).toContain('&rsquo;');
        expect(res.text).toMatch(/Class of[\s\S]*76/);
        expect(res.text).toContain('Register Now');
        expect(res.text).toMatch(/id="register"/);
        expect(res.text).toMatch(/id="schedule"/);
        expect(res.text).toMatch(/href="#register"/);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
