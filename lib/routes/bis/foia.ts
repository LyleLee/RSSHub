// @ts-nocheck

import got from '@/utils/got';
import { load } from 'cheerio';

export default async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'https://efoia.bis.doc.gov/index.php/eletronic-foia/index-of-documents/7-electronic-foia/227-export-violations',
    });

    const data = response.data; // response.data 为 HTTP GET 请求返回的 HTML，也就是简书首页的所有 HTML

    const $ = load(data); // 使用 cheerio 加载返回的 HTML

    const list = $('table.warninglettertable').find('tr');

    // 删除第一个元素
    list.splice(0, 2);
    // const list = $('table.warninglettertable').find('tr').gt(1);
    const ar =
        list &&
        list.map((index, td) => {
            const CaseID = $(td).children('td').eq(0).find('a').text();
            const CaseLink = 'https://efoia.bis.doc.gov' + $(td).children('td').eq(0).find('a').attr('href');
            const CaseName = $(td).children('td').eq(1).text();
            const OrderDate = $(td)
                .children('td')
                .eq(2)
                .text()
                .replaceAll(/(\r\n|\n|\r)/gm, '')
                .trim();

            // console.log(CaseID, CaseName, OrderDate);
            return {
                title: CaseName,
                description: 'Case ID:' + CaseID + ' Case Name: ' + CaseName,
                author: 'foia@efoia.bis.doc.gov',
                pubDate: new Date(OrderDate),
                link: CaseLink,
            };
        });

    ctx.set('data', {
        title: `BIS Home`,
        link: `https://www.bis.doc.gov`,
        item: ar.get(),
    });
};
