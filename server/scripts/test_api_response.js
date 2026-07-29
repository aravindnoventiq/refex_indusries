const { InvestorsPageContent } = require('../models');

async function test() {
    try {
        const page = await InvestorsPageContent.findOne({
            where: { slug: 'financial-information' },
        });
        if (!page) {
            console.log('Page not found');
        } else {
            console.log('Record found!');
            console.log('Raw data values:', page.dataValues);
            console.log('showPublishDate value:', page.showPublishDate);
        }
        process.exit(0);
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

test();
