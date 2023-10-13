const service = require("../models/service");
const get = async (req, res, next) => {
  try {
    const results = await service.getAlltasks();
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  get,
};
