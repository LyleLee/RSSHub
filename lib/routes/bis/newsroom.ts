import got from '@/utils/got';
import { load } from 'cheerio';

export default async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'https://www.bis.doc.gov/index.php/about-bis/newsroom/press-releases',
    });

    const data = response.data; // response.data 为 HTTP GET 请求返回的 HTML，也就是简书首页的所有 HTML

    const $ = load(data); // 使用 cheerio 加载返回的 HTML
    const list = $('div[itemprop] > p');
    const ar =
        list &&
        list.map((index, p) => {
            $(p).find('br').replaceWith('\n');

            const itemText = [] && $(p).text().split('\n');

            return {
                title: itemText[0],
                description: itemText[0],
                author: itemText[1],
                pubDate: new Date(itemText[2]),
                link: $(p).find('a').attr('href'),
            };
        });

    ctx.set('data', {
        title: `BIS Home`,
        link: `https://www.bis.doc.gov`,
        item: ar.get(),
    });
};
