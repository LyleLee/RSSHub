const buildData = require('@/utils/common-config');

console.log("whitehouse");

module.exports = async (ctx) => {
    const link = `https://www.whitehouse.gov/ostp/news-updates/`;
    console.log('visit:'+link);
    ctx.state.data = await buildData({
        link,
        url: link,
        title: `%title%`,
        params: {
            title: 'Office Of Science And Technology Policy',
        },
        item: {
            item: '.article-wrapper .news-item',
            title: `$('h2').text()`, // 只支持$().xxx()这样的js语句，也足够使用
            link: `$('h2 a').attr('href')`, // .text()代表获取元素的文本，.attr()表示获取指定属性
            description: `$('h2').html()`, // .html()代表获取元素的html代码
            pubDate: `new Date($('.posted-on').attr('datetime')).toUTCString()`, // 日期的格式多种多样，可以尝试使用**/utils/date**
            guid: `new Date($('.posted-on').attr('datetime')).getTime()`, // guid必须唯一，这是RSS的不同item的标志
        },
    });
};

