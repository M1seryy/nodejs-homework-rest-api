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
const getById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await service.getTaskById(contactId);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: result,
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found task id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  get,
  getById,
};
