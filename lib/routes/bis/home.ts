// @ts-nocheck

import got from '@/utils/got';
import { load } from 'cheerio';

export default async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'https://www.bis.doc.gov/',
    });

    const data = response.data; // response.data 为 HTTP GET 请求返回的 HTML，也就是简书首页的所有 HTML

    const $ = load(data); // 使用 cheerio 加载返回的 HTML
    const list = $('div.lof-main-item');
    const ar =
        list &&
        list.map((index, p) => ({
            title: $(p).find('h4').text().split(':')[1],
            description: $(p).find('h4').html(),
            author: 'BIS home',
            pubDate: new Date($(p).find('img').attr('alt').replace('(', '').replace(')', '')).toUTCString(),
            link: $(p).find('h4 a').attr('href'),
        }));

    ctx.set('data', {
        title: `BIS Home`,
        link: `https://www.bis.doc.gov`,
        item: ar.get(),
    });
};
