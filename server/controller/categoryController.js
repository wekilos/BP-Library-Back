var Sequelize = require("sequelize");
const {
  Category,
  CategoryItem,
  CategoryItemFile,
} = require("../../models/index.js");
var sequelize = require("../../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Func = require("../functions/functions.js");
const Op = Sequelize.Op;
const fs = require("fs");

const getAll = async (req, res) => {
  const { search_query } = req.query;

  const Username =
    search_query &&
    (search_query?.length > 0
      ? {
          [Op.or]: [
            { card_type: { [Op.iLike]: `%${search_query}%` } },
            { icon: { [Op.iLike]: `%${search_query}%` } },
            { icon_white: { [Op.iLike]: `%${search_query}%` } },
            { name_tm: { [Op.iLike]: `%${search_query}%` } },
            { name_ru: { [Op.iLike]: `%${search_query}%` } },
            { name_en: { [Op.iLike]: `%${search_query}%` } },
            { text_tm: { [Op.iLike]: `%${search_query}%` } },
            { text_ru: { [Op.iLike]: `%${search_query}%` } },
            { text_en: { [Op.iLike]: `%${search_query}%` } },
            { author: { [Op.iLike]: `%${search_query}%` } },
            { year: { [Op.iLike]: `%${search_query}%` } },
            { publishing: { [Op.iLike]: `%${search_query}%` } },
            { placeholder: { [Op.iLike]: `%${search_query}%` } },
          ],
        }
      : null);

  Category.findAndCountAll({
    include: [
      {
        model: CategoryItem,
        where: Username,

        include: [{ model: CategoryItemFile }],
      },
    ],

    distinct: true,
    order: [["order_num", "ASC"]],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: err });
    });
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const { search_query, page, limit } = req.query;
  const Page = page ? page : 1;
  const Limit = limit ? limit : 20;
  const Ofset = Limit * (Page - 1);

  const Username =
    search_query &&
    (search_query?.length > 0
      ? {
          [Op.or]: [
            { card_type: { [Op.iLike]: `%${search_query}%` } },
            { icon: { [Op.iLike]: `%${search_query}%` } },
            { icon_white: { [Op.iLike]: `%${search_query}%` } },
            { name_tm: { [Op.iLike]: `%${search_query}%` } },
            { name_ru: { [Op.iLike]: `%${search_query}%` } },
            { name_en: { [Op.iLike]: `%${search_query}%` } },
            { text_tm: { [Op.iLike]: `%${search_query}%` } },
            { text_ru: { [Op.iLike]: `%${search_query}%` } },
            { text_en: { [Op.iLike]: `%${search_query}%` } },
            { author: { [Op.iLike]: `%${search_query}%` } },
            { year: { [Op.iLike]: `%${search_query}%` } },
            { publishing: { [Op.iLike]: `%${search_query}%` } },
            { placeholder: { [Op.iLike]: `%${search_query}%` } },
          ],
        }
      : null);

  const data = await Category.findOne({ where: { id: id } });
  if (data) {
    Category.findOne({
      include: [
        {
          model: CategoryItem,
          where: {
            [Op.and]: [Username],
          },
          order: [["id", "DESC"]],
          offset: Ofset,
          limit: Limit,
          include: [{ model: CategoryItemFile }],
        },
      ],
      where: {
        id: id,
      },
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json({ error: err });
      });
  } else {
    res.send("BU ID boyuncha Category yok!");
  }
};

const create = async (req, res) => {
  const { card_type, icon, icon_white, name_tm, name_ru, name_en, link } =
    req.body;

  Category.create({
    card_type,
    icon,
    icon_white,
    name_tm,
    name_ru,
    name_en,
    link,
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const update = async (req, res) => {
  const {
    order_num,
    card_type,
    icon,
    icon_white,
    name_tm,
    name_ru,
    name_en,
    link,
    id,
  } = req.body;

  const data = await Category.findOne({ where: { id: id } });

  if (data) {
    Category.update(
      {
        order_num,
        card_type,
        icon,
        icon_white,
        name_tm,
        name_ru,
        name_en,
        link,
      },
      { where: { id: id } }
    )
      .then((data) => {
        res.json("uppdated!");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.json("ID boyuncha maglumat yok!");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;

  const data = await Category.findOne({ where: { id: id } });
  if (data) {
    Category.destroy({
      where: { id: id },
      include: [
        { model: CategoryItem, include: [{ model: CategoryItemFile }] },
      ],
    })
      .then(() => {
        res.json("deleted!");
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  } else {
    res.json("Bu Id boyunda maglumat yok!");
  }
};

exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Destroy = Destroy;
