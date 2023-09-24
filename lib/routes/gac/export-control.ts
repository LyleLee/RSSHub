// @ts-nocheck

import buildData from '@/utils/common-config';

export default async (ctx) => {
    const link = `https://www.international.gc.ca/controls-controles/Important_updates-mise_a_jour_importantes.aspx?lang=eng`;
    const data = await buildData({
        link,
        url: link,
        title: `%title%`,
        params: {
            title: 'Global Affairs Canada: Export Control',
            baseUrl: 'https://www.international.gc.ca',
        },
        item: {
            item: 'ul.wet-boew-zebra li',
            title: `$('a').text()`, // 只支持$().xxx()这样的js语句，也足够使用
            link: `$('a').attr('href')`, // .text()代表获取元素的文本，.attr()表示获取指定属性
            description: `$('a').text()`, // .html()代表获取元素的html代码
            pubDate: `new Date($('span.date').text()).toUTCString()`, // 日期的格式多种多样，可以尝试使用**/utils/date**
        },
    });
    ctx.set('data', data);
};
