import axios from 'axios';
import Parser from 'rss-parser';
import Category, { ICategory } from '../models/Category';
import News, { INewsInput } from '../models/News';

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
  'https://abcnews.go.com/abcnews/usheadlines',
  'https://feeds.nbcnews.com/nbcnews/public/world',
  'https://www.theguardian.com/us-news/rss',
  'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml',
  'https://feeds.foxnews.com/foxnews/sports',
  'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
  'https://feeds.arstechnica.com/arstechnica/technology-lab',
];

async function processFeeds() {
  for (const url of FEED_URLS) {
    const items = await parseFeed(url);
    console.log(`\nFeed: ${url}`);
    let website = 'N/A';
    let newsItemList: INewsInput[] = [];
    let category: ICategory | null = await Category.findOne({ name: 'latest' });
    if (!category) {
      category = await findOrCreateCategory('latest', 'N/A');
    }
    if (url == 'https://feeds.bbci.co.uk/news/world/rss.xml') {
      category = await findOrCreateCategory('world', 'N/A');
      website = 'BBC NEWS';
    }
    if (url == 'https://feeds.nbcnews.com/nbcnews/public/world') {
      category = await findOrCreateCategory('world', 'N/A');
      website = 'NBC NEWS';
    }
    if (url == 'https://www.theguardian.com/us-news/rss') {
      category = await findOrCreateCategory('us-news', 'N/A');
      website = 'THE GUARDIAN NEWS';
    }
    if (url == 'https://www.cbsnews.com/latest/rss/main') {
      category = await findOrCreateCategory('latest', 'N/A');
      website = 'CBS NEWS';
    }
    if (url == 'https://abcnews.go.com/abcnews/usheadlines') {
      category = await findOrCreateCategory('latest', 'N/A');
      website = 'ABC NEWS';
    }
    if (url == 'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml') {
      category = await findOrCreateCategory('Sports', 'N/A');
      website = 'THE NEW YORK TIMES';
    }
    if (url == 'https://feeds.foxnews.com/foxnews/sports') {
      category = await findOrCreateCategory('Sports', 'N/A');
      website = 'FOX NEWS';
    }
    if (url == 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml') {
      category = await findOrCreateCategory('Technology', 'N/A');
      website = 'THE NEW YORK TIMES';
    }
    if (url == 'https://feeds.arstechnica.com/arstechnica/technology-lab') {
      category = await findOrCreateCategory('Technology', 'N/A');
      website = 'ARS TECHNICA NEWS';
    }
    items.forEach(async (item, index) => {
      //   console.log('My Log item: ', item);
      //   console.log(`\nItem ${index + 1}:`);
      //   console.log(`Title: ${item.title}`);
      //   console.log(`Content: ${item.content}`);
      //   console.log(`pubDate: ${item.pubDate}`);
      //   console.log(`Image: ${item.image || 'No image found'}`);
      let news: INewsInput = {
        title: item?.title || '',
        link: item?.link || '',
        image: item?.image || null,
        content: item?.content ? removeHtmlAndLimitText(item.content, 150) : '',
        publishedAt: item?.pubDate ? new Date(item.pubDate) : null,
        website: website,
        embedding: [],
        category: category,
      };

      newsItemList.push(news);
    });
    console.log(' news Item List: ', newsItemList);
    insertNewsIfNotExists(newsItemList);
  }
}
async function insertNewsIfNotExists(newsList: INewsInput[]) {
  try {
    const bulkOps = newsList.map((newsItem: INewsInput) => ({
      updateOne: {
        filter: { title: newsItem?.title },
        update: { $setOnInsert: newsItem }, // Insert only if it doesn’t exist
        upsert: true, // Create if not present
      },
    }));

    const result = await News.bulkWrite(bulkOps);
    console.log('Bulk insert result:', result);
  } catch (err) {
    console.error('Error inserting news:', err);
  }
}
async function findOrCreateCategory(name: string, description: string) {
  // ✅ Try to find the category by name
  let category = await Category.findOne({ name });

  if (!category) {
    // ✅ If the category doesn't exist, create a new one
    category = new Category({
      name,
      description,
    });

    await category.save(); // Save the newly created category
    console.log('New Category Created:', category);
  } else {
    console.log('Category Found:', category);
  }

  return category;
}
function removeHtmlAndLimitText(input: string, limit: number): string {
  // Step 1: Remove HTML tags using regular expression
  const textWithoutHtml = input.replace(/<[^>]*>/g, '');

  // Step 2: Limit the text length
  const limitedText =
    textWithoutHtml.length > limit
      ? textWithoutHtml.slice(0, limit) + '...'
      : textWithoutHtml;

  return limitedText;
}
// processFeeds();
export { processFeeds };
