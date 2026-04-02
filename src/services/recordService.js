const FinancialRecord = require('../models/FinancialRecord');
const ApiError = require('../utils/ApiError');
const { getPagination } = require('../utils/pagination');

const buildRecordFilter = (query) => {
  const filter = { isDeleted: false };

  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.createdBy) filter.createdBy = query.createdBy;

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = query.startDate;
    if (query.endDate) filter.date.$lte = query.endDate;
  }

  return filter;
};

const createRecord = async (payload, userId) => {
  const record = await FinancialRecord.create({
    ...payload,
    createdBy: userId,
  });

  return record;
};

const listRecords = async (query) => {
  const { page, limit, skip } = getPagination(query.page, query.limit);
  const filter = buildRecordFilter(query);

  const [items, total] = await Promise.all([
    FinancialRecord.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    FinancialRecord.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getRecordById = async (id) => {
  const record = await FinancialRecord.findOne({ _id: id, isDeleted: false }).populate(
    'createdBy',
    'name email role'
  );

  if (!record) {
    throw new ApiError(404, 'Record not found');
  }

  return record;
};

const updateRecord = async (id, payload) => {
  const record = await FinancialRecord.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true }
  ).populate('createdBy', 'name email role');

  if (!record) {
    throw new ApiError(404, 'Record not found');
  }

  return record;
};

const deleteRecord = async (id) => {
  const record = await FinancialRecord.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!record) {
    throw new ApiError(404, 'Record not found');
  }

  return record;
};

module.exports = {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  buildRecordFilter,
};
