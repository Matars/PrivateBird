import type { Command } from 'commander';
import type { CliContext } from '../cli/shared.js';
import { TwitterClient } from '../lib/twitter-client.js';

type EngagementMethod = 'bookmark' | 'retweet' | 'unretweet';

const COMMANDS: Array<{
  name: EngagementMethod;
  description: string;
  successVerb: string;
}> = [
  { name: 'bookmark', description: 'Bookmark tweets', successVerb: 'Bookmarked' },
  { name: 'retweet', description: 'Repost tweets', successVerb: 'Reposted' },
  { name: 'unretweet', description: 'Remove reposts from tweets', successVerb: 'Removed repost from' },
];

export function registerEngagementCommands(program: Command, ctx: CliContext): void {
  for (const definition of COMMANDS) {
    program
      .command(definition.name)
      .description(definition.description)
      .argument('<tweet-id-or-url...>', 'Tweet IDs or URLs')
      .action(async (tweetIdOrUrls: string[]) => {
        const opts = program.opts();
        const timeoutMs = ctx.resolveTimeoutFromOptions(opts);
        const { cookies, warnings } = await ctx.resolveCredentialsFromOptions(opts);

        for (const warning of warnings) console.error(`${ctx.p('warn')}${warning}`);
        if (!cookies.authToken || !cookies.ct0) {
          console.error(`${ctx.p('err')}Missing required credentials`);
          process.exitCode = 1;
          return;
        }

        const client = new TwitterClient({ cookies, timeoutMs });
        let failures = 0;
        for (const input of tweetIdOrUrls) {
          const tweetId = ctx.extractTweetId(input);
          const result = await client[definition.name](tweetId);
          if (result.success) {
            console.log(`${ctx.p('ok')}${definition.successVerb} tweet ${tweetId}`);
          } else {
            failures += 1;
            console.error(`${ctx.p('err')}Failed to ${definition.name} ${tweetId}: ${result.error}`);
          }
        }

        if (failures > 0) process.exitCode = 1;
      });
  }
}
