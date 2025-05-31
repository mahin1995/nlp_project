import axios from 'axios';
import Parser from 'rss-parser';
import Category, { ICategory } from '../web-site/models/Category';
import News, { INewsInput } from '../web-site/models/News';

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
        // console.log('My Log item.image: ',item.media)
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
  {
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'World',
    link: 'world',
    website:"BBC news"
  },
  {
    url: 'https://www.thedailystar.net/frontpage/rss.xml',
    category: 'Others',
    link: 'others',
    website:"The daily Star"

  },
  {
    url: 'https://abcnews.go.com/abcnews/usheadlines',
    category: 'Us-News',
    link: 'us-news',
    website:"ABC News"

  },
  {
    url: 'https://feeds.nbcnews.com/nbcnews/public/world',
    category: 'World',
    link: 'world',
    website:"NBC News"

  },
  {
    url: 'https://www.theguardian.com/us-news/rss',
    category: 'Us-News',
    link: 'us-news',
    website:"The Guardian"

  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml',
    category: 'Sports',
    link: 'sports',
    website:"Newyork times"

  },
  {
    url: 'https://feeds.foxnews.com/foxnews/sports',
    category: 'Sports',
    link: 'sports',
    website:"FOX News"

  },
  {
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
    category: 'Technology',
    link: 'technology',
    website:"Newyork times"

  },
  {
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    category: 'Technology',
    link: 'technology-lab',
    website:"ARS Tech"

  },
  {
    url: 'https://www.bd24live.com/feed',
    category: 'Others',
    link: 'others',
    website:"BD 24 Live"

  },
  {
    url: 'https://rtvonline.com/english/rss/country.xml',
    category: 'Bangladesh',
    link: 'bangladesh',
    website:"RTV News"

  },
  {
    url: 'https://rtvonline.com/english/rss/bangladesh.xml',
    category: 'Bangladesh',
    link: 'bangladesh',
    website:"RTV News"

  },
  {
    url: 'https://rtvonline.com/english/rss/international.xml',
    category: 'International',
    link: 'international',
    website:"RTV News"

  },
  {
    url: 'https://rtvonline.com/english/rss/entertainment.xml',
    category: 'Entertainment',
    link: 'entertainment',
    website:"RTV News"

  },
  {
    url: 'https://rtvonline.com/english/rss/sports.xml',
    category: 'Sports',
    link: 'sports',
    website:"RTV News"

  },
  {
    url: 'https://rtvonline.com/english/rss/politics.xml',
    category: 'Politics',
    link: 'politics',
    website:"RTV News"

  },
  {
    url: 'https://rtvonline.com/english/rss/life-style.xml',
    category: 'Lifestyle',
    link: 'lifestyle',
    website:"RTV News"

  },
  {
    url: 'https://rtvonline.com/english/rss/feature.xml',
    category: 'Feature',
    link: 'feature',
    website:"RTV News"

  },
  {
    url: 'https://rtvonline.com/english/rss/health.xml',
    category: 'Health',
    link: 'health',
    website:"RTV News"

  },
  {
    url: 'https://en.dhakapost.com/rss/entertainment.xml',
    category: 'Entertainment',
    link: 'entertainment',
    website:"Dhakapost"

  },
  {
    url: 'https://en.dhakapost.com/rss/lifestyle.xml',
    category: 'Lifestyle',
    link: 'lifestyle',
    website:"Dhakapost"
  },
    {
    url: 'https://www.jagonews24.com/en/rss/politics.xml',
    category: 'Politics',
    link: 'politics',
    website:"Dhakapost"
  },
    {
    url: 'https://www.jagonews24.com/en/rss/business.xml',
    category: 'Business',
    link: 'business',
    website:"Jago News24"
  },
    {
    url: 'https://www.jagonews24.com/en/rss/international.xml',
    category: 'International',
    link: 'international',
    website:"Jago News24"
  },
];

async function processFeeds() {
  for (const feed of FEED_URLS) {
    const items = await parseFeed(feed?.url);
    console.log(`\nFeed: ${feed?.url}`);
    let website = 'N/A';
    let newsItemList: INewsInput[] = [];
    let category: ICategory | null = await Category.findOne({ name: 'Latest' });
    if (!category) {
      category = await findOrCreateCategory('Latest', 'N/A','latest');
    }
     if (feed?.category) {
      category = await findOrCreateCategory(feed?.category, 'N/A',feed?.link);
      website = feed?.website||"N/A";
    }
    items.forEach(async (item, index) => {
      //   console.log(`\nItem ${index + 1}:`);
      //   console.log(`Title: ${item.title}`);
      //   console.log(`Content: ${item.content}`);
      //   console.log(`pubDate: ${item.pubDate}`);
      //   console.log(`Image: ${item.image || 'No image found'}`);
      
      let news: INewsInput = {
        title: item?.title || '',
        link: fixRtvonlineUrl(item?.link || '') || '',
        image: item?.image || null,
        content: item?.content ? removeHtmlAndLimitText(item.content, 150) : '',
        publishedAt: item?.pubDate ? new Date(item.pubDate) : null,
        website: website,
        embedding: [],
        category: category,
      };

      newsItemList.push(news);
    });
    insertNewsIfNotExists(newsItemList);
    console.log('Finish dump');
  }
}
async function insertNewsIfNotExists(newsList: INewsInput[]) {
  try {
    const bulkOps = newsList.map((newsItem: INewsInput) => ({
      updateOne: {
        filter: { title: newsItem?.title, link: newsItem?.link },
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
async function findOrCreateCategory(name: string, description: string,link:string) {
  // ✅ Try to find the category by name
  let category = await Category.findOne({ name });

  if (!category) {
    // ✅ If the category doesn't exist, create a new one
    category = new Category({
      name,
      description,
      link
    });

    await category.save(); // Save the newly created category
    // console.log('New Category Created:', category);
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
function fixRtvonlineUrl(url:string) {
  if (url.includes('rtvonline.com') && url.includes('/undefined/')) {
    return url.replace('/undefined/', '/english/');
  }
  return url;
}
// processFeeds();
export { processFeeds };
