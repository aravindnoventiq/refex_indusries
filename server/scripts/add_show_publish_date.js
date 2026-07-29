const { sequelize } = require('../models');

async function migrate() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        const tableInfo = await queryInterface.describeTable('investors_page_content');

        if (!tableInfo.show_publish_date) {
            console.log('Adding show_publish_date column to investors_page_content...');
            await queryInterface.addColumn('investors_page_content', 'show_publish_date', {
                type: require('sequelize').BOOLEAN,
                allowNull: false,
                defaultValue: false
            });
            console.log('Column added successfully.');
        } else {
            console.log('Column show_publish_date already exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
