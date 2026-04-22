import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './settings.schema';
import { UpdateSettingsDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name)
    private settingsModel: Model<SettingsDocument>,
  ) {}

  // 🔥 get settings (always 1 document)
  async getSettings() {
    let settings = await this.settingsModel.findOne();

    if (!settings) {
      settings = await this.settingsModel.create({});
    }

    return settings;
  }

  // 👑 update settings (admin only)
  async updateSettings(dto: UpdateSettingsDto) {
    return this.settingsModel.findOneAndUpdate({}, dto, {
      new: true,
      upsert: true,
    });
  }
}
