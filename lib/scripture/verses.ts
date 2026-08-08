/**
 * A curated set of verses for two people, in two public-domain translations.
 *
 * **Translations.** KJV (King James Version) and WEB (World English Bible) are
 * both public domain, so they can be bundled and served with the app rather than
 * fetched — which is what keeps Aveyra working with no external requests. Modern
 * translations (NIV, ESV, NLT) are copyrighted and would need paid licensing;
 * they are deliberately not here.
 *
 * **Why curated rather than the whole Bible.** Both translations in full run to
 * roughly 9MB — over four times the size of the entire app — which would be felt
 * hardest by exactly the people on the slowest connections. This is a daily
 * reading for a couple, not a Bible reader; if a full reader is ever wanted it
 * should be its own thing.
 *
 * ⚠️ **Verify before shipping.** Every verse below should be checked against a
 * canonical source (e.g. ebible.org for WEB, any standard KJV text). Scripture
 * quoted wrongly in an app people read daily is worse than scripture absent.
 */

export type Translation = 'kjv' | 'web';

export interface Verse {
  /** Stable id; also what the rotation engine sequences over. */
  ref: string;
  kjv: string;
  web: string;
  /** Loose grouping, for future filtering. Not shown as a label. */
  theme: 'love' | 'patience' | 'forgiveness' | 'gratitude' | 'strength' | 'faithfulness';
}

export const VERSES: Verse[] = [
  {
    ref: '1 Corinthians 13:4',
    theme: 'love',
    kjv: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.',
    web: 'Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud.',
  },
  {
    ref: '1 Corinthians 13:7',
    theme: 'love',
    kjv: 'Beareth all things, believeth all things, hopeth all things, endureth all things.',
    web: 'bears all things, believes all things, hopes all things, endures all things.',
  },
  {
    ref: '1 Corinthians 13:13',
    theme: 'love',
    kjv: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.',
    web: 'But now faith, hope, and love remain—these three. The greatest of these is love.',
  },
  {
    ref: 'Colossians 3:13',
    theme: 'forgiveness',
    kjv: 'Forbearing one another, and forgiving one another, if any man have a quarrel against any: even as Christ forgave you, so also do ye.',
    web: 'bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do.',
  },
  {
    ref: 'Colossians 3:14',
    theme: 'love',
    kjv: 'And above all these things put on charity, which is the bond of perfectness.',
    web: 'Above all these things walk in love, which is the bond of perfection.',
  },
  {
    ref: 'Ephesians 4:2',
    theme: 'patience',
    kjv: 'With all lowliness and meekness, with longsuffering, forbearing one another in love.',
    web: 'with all lowliness and humility, with patience, bearing with one another in love.',
  },
  {
    ref: 'Ephesians 4:32',
    theme: 'forgiveness',
    kjv: 'And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ’s sake hath forgiven you.',
    web: 'And be kind to one another, tender hearted, forgiving each other, just as God also in Christ forgave you.',
  },
  {
    ref: 'Proverbs 3:3',
    theme: 'faithfulness',
    kjv: 'Let not mercy and truth forsake thee: bind them about thy neck; write them upon the table of thine heart.',
    web: 'Don’t let kindness and truth forsake you. Bind them around your neck. Write them on the tablet of your heart.',
  },
  {
    ref: 'Proverbs 17:17',
    theme: 'faithfulness',
    kjv: 'A friend loveth at all times, and a brother is born for adversity.',
    web: 'A friend loves at all times; and a brother is born for adversity.',
  },
  {
    ref: 'Ecclesiastes 4:9',
    theme: 'strength',
    kjv: 'Two are better than one; because they have a good reward for their labour.',
    web: 'Two are better than one, because they have a good reward for their labor.',
  },
  {
    ref: 'Ecclesiastes 4:12',
    theme: 'strength',
    kjv: 'And if one prevail against him, two shall withstand him; and a threefold cord is not quickly broken.',
    web: 'If a man prevails against one who is alone, two shall withstand him; and a threefold cord is not quickly broken.',
  },
  {
    ref: 'Romans 12:10',
    theme: 'love',
    kjv: 'Be kindly affectioned one to another with brotherly love; in honour preferring one another.',
    web: 'In love of the brothers be tenderly affectionate to one another; in honor preferring one another.',
  },
  {
    ref: 'Romans 12:12',
    theme: 'patience',
    kjv: 'Rejoicing in hope; patient in tribulation; continuing instant in prayer.',
    web: 'rejoicing in hope; enduring in troubles; continuing steadfastly in prayer.',
  },
  {
    ref: 'Philippians 4:6',
    theme: 'gratitude',
    kjv: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.',
    web: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.',
  },
  {
    ref: 'Philippians 4:8',
    theme: 'gratitude',
    kjv: 'Whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely… think on these things.',
    web: 'Whatever things are true, whatever things are honorable, whatever things are just, whatever things are pure, whatever things are lovely… think about these things.',
  },
  {
    ref: '1 Peter 4:8',
    theme: 'love',
    kjv: 'And above all things have fervent charity among yourselves: for charity shall cover the multitude of sins.',
    web: 'And above all things be earnest in your love among yourselves, for love covers a multitude of sins.',
  },
  {
    ref: '1 John 4:19',
    theme: 'love',
    kjv: 'We love him, because he first loved us.',
    web: 'We love him, because he first loved us.',
  },
  {
    ref: 'Psalm 143:8',
    theme: 'faithfulness',
    kjv: 'Cause me to hear thy lovingkindness in the morning; for in thee do I trust.',
    web: 'Cause me to hear your loving kindness in the morning, for I trust in you.',
  },
  {
    ref: 'Lamentations 3:22-23',
    theme: 'faithfulness',
    kjv: 'It is of the LORD’s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.',
    web: 'It is because of Yahweh’s loving kindnesses that we are not consumed, because his compassion doesn’t fail. They are new every morning. Great is your faithfulness.',
  },
  {
    ref: 'Song of Solomon 3:4',
    theme: 'love',
    kjv: 'I found him whom my soul loveth: I held him, and would not let him go.',
    web: 'I found him whom my soul loves. I held him, and would not let him go.',
  },
  {
    ref: 'Galatians 5:22-23',
    theme: 'patience',
    kjv: 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance.',
    web: 'But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faith, gentleness, and self-control.',
  },
  {
    ref: 'James 1:19',
    theme: 'patience',
    kjv: 'Let every man be swift to hear, slow to speak, slow to wrath.',
    web: 'let every man be swift to hear, slow to speak, and slow to anger.',
  },
  {
    ref: 'Psalm 133:1',
    theme: 'strength',
    kjv: 'Behold, how good and how pleasant it is for brethren to dwell together in unity!',
    web: 'See how good and how pleasant it is for brothers to live together in unity!',
  },
  {
    ref: '1 Thessalonians 5:11',
    theme: 'strength',
    kjv: 'Wherefore comfort yourselves together, and edify one another, even as also ye do.',
    web: 'Therefore exhort one another, and build each other up, even as you also do.',
  },
  {
    ref: '1 Thessalonians 5:18',
    theme: 'gratitude',
    kjv: 'In every thing give thanks: for this is the will of God in Christ Jesus concerning you.',
    web: 'In everything give thanks, for this is the will of God in Christ Jesus toward you.',
  },
  {
    ref: 'Psalm 118:24',
    theme: 'gratitude',
    kjv: 'This is the day which the LORD hath made; we will rejoice and be glad in it.',
    web: 'This is the day that Yahweh has made. We will rejoice and be glad in it!',
  },
  {
    ref: 'Isaiah 41:10',
    theme: 'strength',
    kjv: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee.',
    web: 'Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you.',
  },
  {
    ref: 'Joshua 1:9',
    theme: 'strength',
    kjv: 'Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
    web: 'Be strong and courageous. Don’t be afraid. Don’t be dismayed, for Yahweh your God is with you wherever you go.',
  },
  {
    ref: 'Matthew 6:21',
    theme: 'love',
    kjv: 'For where your treasure is, there will your heart be also.',
    web: 'for where your treasure is, there your heart will be also.',
  },
  {
    ref: 'Proverbs 16:24',
    theme: 'gratitude',
    kjv: 'Pleasant words are as an honeycomb, sweet to the soul, and health to the bones.',
    web: 'Pleasant words are a honeycomb, sweet to the soul, and health to the bones.',
  },
];

/** Text of a verse in the chosen translation. */
export function textOf(verse: Verse, translation: Translation): string {
  return translation === 'kjv' ? verse.kjv : verse.web;
}

export const TRANSLATION_NAMES: Record<Translation, string> = {
  kjv: 'King James Version',
  web: 'World English Bible',
};
