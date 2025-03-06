import axios from 'axios';
import Parser from 'rss-parser';

// Extended type definitions for custom fields
interface CustomItem {
  media?: {
    thumbnail?: {
      $?: {
        url?: string;
      };
    };
    content?: {
      $?: {
        url?: string;
      };
    };
  };
  enclosure?: {
    $?: {
      url?: string;
      type?: string;
    };
  };
  'media:thumbnail'?: {
    $?: {
      url?: string;
    };
  };
  'media:content'?: {
    $?: {
      url?: string;
    };
  };
}

interface CustomFeed {
  image?: {
    url?: string;
  };
}

const parser = new Parser<CustomFeed, CustomItem>({
  customFields: {
    feed: ['image'],
    item: ['media:thumbnail', 'media:content', 'enclosure'],
  },
});

type RSSItemWithImage = {
  title?: string;
  link?: string;
  image?: string;
  content?: string;
  pubDate?: string;
};

async function parseFeed(url: string) {
  try {
    const response = await axios.get(url);
    const feed = await parser.parseString(response.data);

    return (
      feed.items?.map((item) => {
        const result: RSSItemWithImage = {
          title: item.title,
          link: item.link,
          content: item.content,
          pubDate: item.pubDate,
        };

        // Check different possible image locations with proper object access
        if (item.enclosure?.$?.type?.startsWith('image/')) {
          result.image = item.enclosure.$.url;
        } else if (item['media:thumbnail']?.$?.url) {
          result.image = item['media:thumbnail'].$.url;
        } else if (item['media:content']?.$?.url) {
          result.image = item['media:content'].$.url;
        } else if (item.media?.thumbnail?.$?.url) {
          result.image = item.media.thumbnail.$.url;
        }

        return result;
      }) || []
    );
  } catch (error) {
    console.error(`Error parsing ${url}:`, error);
    return [];
  }
}

const FEED_URLS = [
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://www.cbsnews.com/latest/rss/main',
];

async function processFeeds() {
  for (const url of FEED_URLS) {
    const items = await parseFeed(url);
    console.log(`\nFeed: ${url}`);
    items.forEach((item, index) => {
      console.log('My Log item: ', item);
      console.log(`\nItem ${index + 1}:`);
      console.log(`Title: ${item.title}`);
      console.log(`Content: ${item.content}`);
      console.log(`pubDate: ${item.pubDate}`);
      console.log(`Image: ${item.image || 'No image found'}`);
    });
  }
}

processFeeds();
