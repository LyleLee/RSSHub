const got = require('@/utils/got');
const cheerio = require('cheerio');
// 发起 HTTP GET 请求
module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'https://www.bis.doc.gov/index.php/about-bis/newsroom/press-releases',
    });

    const data = response.data; // response.data 为 HTTP GET 请求返回的 HTML，也就是简书首页的所有 HTML

    const $ = cheerio.load(data); // 使用 cheerio 加载返回的 HTML
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
    // console.log(ar);

    // 使用 cheerio 选择器，选择带有 data-item_id 属性的所有 div 元素，返回 cheerio node 对象数组

    // 注：每一个 cheerio node 对应一个 HTML DOM
    // 注：cheerio 选择器与 jquery 选择器几乎相同
    // 参考 cheerio 文档：https://cheerio.js.org/
    ctx.state.data = {
        // 源标题
        title: `BIS newsroom`,
        // 源链接
        link: `https://www.bis.doc.gov/index.php/about-bis/newsroom/press-releases`,
        // 源说明
        description: `U.S. Department of Commerce Bureau of Industry and Security`,

        // 文章数据
        item: ar.get(),
    };
};
