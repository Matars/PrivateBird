import { describe, expect, it } from 'vitest';
import type { GraphqlTweetResult } from '../src/lib/twitter-client-types.js';
import { mapTweetResult } from '../src/lib/twitter-client-utils.js';

describe('mapTweetResult media', () => {
  const makeUserResult = () => ({
    core: {
      user_results: {
        result: {
          rest_id: 'u1',
          legacy: { screen_name: 'alice', name: 'Alice' },
        },
      },
    },
  });

  it('includes extracted media on mapped tweet', () => {
    const result: GraphqlTweetResult = {
      rest_id: '1',
      legacy: {
        full_text: 'hello',
        extended_entities: {
          media: [
            {
              type: 'photo',
              media_url_https: 'https://pbs.twimg.com/media/test.jpg',
              sizes: {
                large: { w: 800, h: 600, resize: 'fit' },
                small: { w: 320, h: 240, resize: 'fit' },
              },
            },
          ],
        },
      },
      ...makeUserResult(),
    };

    const mapped = mapTweetResult(result, 0);
    expect(mapped).toBeDefined();
    const media = mapped?.media ?? [];
    expect(media).toHaveLength(1);
    expect(media[0]).toEqual({
      type: 'photo',
      url: 'https://pbs.twimg.com/media/test.jpg',
      width: 800,
      height: 600,
      previewUrl: 'https://pbs.twimg.com/media/test.jpg:small',
    });
  });

  it('omits media when none present', () => {
    const result: GraphqlTweetResult = {
      rest_id: '2',
      legacy: { full_text: 'no media' },
      ...makeUserResult(),
    };

    const mapped = mapTweetResult(result, 0);
    expect(mapped?.media).toBeUndefined();
  });

  it('includes the author profile image used by web clients', () => {
    const result: GraphqlTweetResult = {
      rest_id: '3',
      legacy: { full_text: 'avatar test' },
      core: {
        user_results: {
          result: {
            rest_id: 'u1',
            legacy: {
              screen_name: 'alice',
              name: 'Alice',
              profile_image_url_https: 'https://pbs.twimg.com/profile_images/alice_normal.jpg',
            },
          },
        },
      },
    };

    expect(mapTweetResult(result, 0)?.author.profileImageUrl).toBe(
      'https://pbs.twimg.com/profile_images/alice_normal.jpg',
    );
  });

  it('prefers a browser-compatible 1080p MP4 over a level-5.2 4K variant', () => {
    const result: GraphqlTweetResult = {
      rest_id: '4',
      legacy: {
        full_text: 'video test',
        extended_entities: {
          media: [{
            type: 'video',
            media_url_https: 'https://pbs.twimg.com/video_thumb.jpg',
            video_info: {
              variants: [
                { bitrate: 12_000_000, content_type: 'video/mp4', url: 'https://video.twimg.com/vid/avc1/3348x2160/4k.mp4' },
                { bitrate: 5_000_000, content_type: 'video/mp4', url: 'https://video.twimg.com/vid/avc1/1920x1080/1080p.mp4' },
                { bitrate: 2_000_000, content_type: 'video/mp4', url: 'https://video.twimg.com/vid/avc1/1280x720/720p.mp4' },
              ],
            },
          }],
        },
      },
      ...makeUserResult(),
    };

    expect(mapTweetResult(result, 0)?.media?.[0]?.videoUrl).toContain('/1920x1080/');
  });

  it('preserves engagement state for optimistic controls', () => {
    const result: GraphqlTweetResult = {
      rest_id: '5',
      legacy: {
        full_text: 'state test',
        favorited: true,
        bookmarked: true,
        retweeted: true,
      },
      ...makeUserResult(),
    };

    expect(mapTweetResult(result, 0)).toMatchObject({
      favorited: true,
      bookmarked: true,
      retweeted: true,
    });
  });
});
