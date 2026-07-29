const { NewsroomEvent } = require("../models");
const eventsData = require("../seeds/newsroom_events.json");

async function seedNewsroomEvents() {
  try {
    console.log("Starting to seed Newsroom Events...");

    // Seed events
    for (const eventData of eventsData) {
      const [event, created] = await NewsroomEvent.findOrCreate({
        where: { title: eventData.title },
        defaults: eventData,
      });

      if (!created) {
        await event.update(eventData);
      }

      console.log(`✓ ${event.title}`);
    }

    console.log("✓ Newsroom Events seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Newsroom Events:", error);
    process.exit(1);
  }
}

seedNewsroomEvents();

