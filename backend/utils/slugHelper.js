const slugifyLib = require('slugify');

const generateSlug = (text) => {
  return slugifyLib(text, { lower: true, strict: true, trim: true });
};

const makeUniqueSlug = async (Model, text, excludeId = null) => {
  let slug = generateSlug(text);
  let exists = true;
  let counter = 0;

  while (exists) {
    const query = { slug: counter === 0 ? slug : `${slug}-${counter}` };
    if (excludeId) query._id = { $ne: excludeId };
    const doc = await Model.findOne(query);
    if (!doc) {
      exists = false;
      slug = counter === 0 ? slug : `${slug}-${counter}`;
    } else {
      counter++;
    }
  }

  return slug;
};

module.exports = { generateSlug, makeUniqueSlug };
