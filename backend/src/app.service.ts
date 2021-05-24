import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly _configService: ConfigService) { }
  getHello(): string {
    return this._configService.get<string>('API_KEY');
  }
}
