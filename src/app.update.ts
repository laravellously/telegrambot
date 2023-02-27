import { Logger } from '@nestjs/common';
import { Update, Ctx, Start, Help, On, Hears } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
export class AppUpdate {
  private readonly logger = new Logger(AppUpdate.name);

  @Start()
  async start(@Ctx() ctx: Context) {
    this.logger.log('Start Command Called');
    await ctx.reply('Welcome');
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async on(@Ctx() ctx: Context) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hears(@Ctx() ctx: Context) {
    await ctx.reply('Hey there');
  }
}
