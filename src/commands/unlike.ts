import type { Command } from 'commander';
import type { CliContext } from '../cli/shared.js';
import { TwitterClient } from '../lib/twitter-client.js';

export function registerUnlikeCommand(program: Command, ctx: CliContext): void {
  program
    .command('unlike')
    .description('Remove likes from tweets')
    .argument('<tweet-id-or-url...>', 'Tweet IDs or URLs to remove likes from')
    .action(async (tweetIdOrUrls: string[]) => {
      const opts = program.opts();
      const timeoutMs = ctx.resolveTimeoutFromOptions(opts);

      const { cookies, warnings } = await ctx.resolveCredentialsFromOptions(opts);

      for (const warning of warnings) {
        console.error(`${ctx.p('warn')}${warning}`);
      }

      if (!cookies.authToken || !cookies.ct0) {
        console.error(`${ctx.p('err')}Missing required credentials`);
        process.exit(1);
      }

      const client = new TwitterClient({ cookies, timeoutMs });
      let failures = 0;

      for (const input of tweetIdOrUrls) {
        const tweetId = ctx.extractTweetId(input);
        const result = await client.unlike(tweetId);
        if (result.success) {
          console.log(`${ctx.p('ok')}Removed like from ${tweetId}`);
        } else {
          failures += 1;
          console.error(`${ctx.p('err')}Failed to unlike ${tweetId}: ${result.error}`);
        }
      }

      if (failures > 0) {
        process.exit(1);
      }
    });
}
