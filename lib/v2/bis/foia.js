const got = require('@/utils/got');
const cheerio = require('cheerio');
// 发起 HTTP GET 请求
module.exports = async (ctx) => {
    const response = await got({
        method: 'get',
        url: 'https://efoia.bis.doc.gov/index.php/eletronic-foia/index-of-documents/7-electronic-foia/227-export-violations',
    });

    const data = response.data; // response.data 为 HTTP GET 请求返回的 HTML，也就是简书首页的所有 HTML

    const $ = cheerio.load(data); // 使用 cheerio 加载返回的 HTML

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
                .replace(/(\r\n|\n|\r)/gm, '')
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
    // console.log(ar);

    // 使用 cheerio 选择器，选择带有 data-item_id 属性的所有 div 元素，返回 cheerio node 对象数组

    // 注：每一个 cheerio node 对应一个 HTML DOM
    // 注：cheerio 选择器与 jquery 选择器几乎相同
    // 参考 cheerio 文档：https://cheerio.js.org/
    ctx.state.data = {
        // 源标题
        title: `FOIA: Export Violations`,
        // 源链接
        link: `https://efoia.bis.doc.gov/index.php/electronic-foia/index-of-documents/7-electronic-foia/227-export-violations`,
        // 源说明
        description: `U.S. Department of Commerce Bureau of Industry and Security`,

        // 文章数据
        item: ar.get(),
    };
};
