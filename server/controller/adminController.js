var Sequelize = require("sequelize");
const { Admin } = require("../../models/index.js");
var sequelize = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Func = require("../functions/functions");
const Op = Sequelize.Op;
const fs = require("fs");

const getAll = async (req, res) => {
  const { name } = req.query;

  const Username =
    name &&
    (name?.length > 0
      ? {
          [Op.or]: [
            { username: { [Op.like]: `%${name}%` } },
            { fullname: { [Op.like]: `%${name}%` } },
          ],
        }
      : null);
  Admin.findAll({
    where: {
      [Op.and]: [Username],
    },
    order: [["id", "DESC"]],
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
  const data = await Admin.findOne({ where: { id: id } });
  if (data) {
    Admin.findOne({
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
    res.send("BU ID boyuncha Admin yok!");
  }
};

const create = async (req, res) => {
  const { username, fullname, password } = req.body;
  const exist = await Admin.findOne({
    where: {
      username: username,
    },
  });

  if (exist) {
    let text = "Bu username-da Admin hasaba alynan Login ediň!";
    res.json({
      msg: text,
    });
  } else {
    const salt = bcrypt.genSaltSync();
    bcrypt.hash(password, salt, (err, hashpassword) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "Error", err: err });
      } else {
        Admin.create({
          username,
          fullname,
          password: hashpassword,
        })
          .then(async (data) => {
            const token = jwt.sign(
              {
                id: data.id,
                username: data.username,
                fullname: data.fullname,
              },
              Func.Secret()
            );

            return res.json({
              id: data.id,
              username: data.username,
              fullname: data.fullname,
              token: token,
              login: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.json("create Admin:", err);
          });
      }
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const exist = await Admin.findOne({
    where: {
      username: email,
    },
  });

  if (exist) {
    if (await bcrypt.compare(password, exist.password)) {
      const token = jwt.sign(
        {
          id: exist.id,
          name: exist.username,
          fullname: exist.fullname,
        },
        Func.Secret()
      );

      return res.json({
        id: exist.id,
        name: exist.username,
        fullname: exist.fullname,
        token: token,
        login: true,
      });
    } else {
      let text = "Siziň ulanyjy adyňyz ýa-da açar sözüňiz nädogry!";
      if (lang == "ru") {
        text = "Ваше имя пользователя или пароль недействительны!";
      } else if (lang == "en") {
        text = "Your username or password is invalid!";
      }
      res.send({
        msg: text,
        login: false,
      });
    }
  } else {
    let text = "Bu username-da Admin hasaba alynmadyk!";
    res.json({
      msg: text,
    });
  }
};

const update = async (req, res) => {
  const { username, fullname, password, id } = req.body;
  const exist = await Admin.findOne({
    where: {
      username: username,
    },
  });

  const oldUser = await Admin.findOne({
    where: {
      id: id,
    },
  });

  if (exist.username == oldUser.username || !exist) {
    if (password && password?.length > 0) {
      const salt = bcrypt.genSaltSync();
      bcrypt.hash(password, salt, (err, hashpassword) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ msg: "Error", err: err });
        } else {
          Admin.update(
            {
              username,
              fullname,
              password: hashpassword,
            },
            { where: { id: id } }
          )
            .then(async (data) => {
              const token = jwt.sign(
                {
                  id: data.id,
                  username: data.username,
                  fullname: data.fullname,
                },
                Func.Secret()
              );

              return res.json({
                id: data.id,
                username: data.username,
                fullname: data.fullname,
                token: token,
                login: true,
              });
            })
            .catch((err) => {
              console.log(err);
              res.json("update Admin with password:", err);
            });
        }
      });
    } else {
      Admin.update(
        {
          username,
          fullname,
        },
        { where: { id: id } }
      )
        .then(async (data) => {
          const token = jwt.sign(
            {
              id: data.id,
              username: data.username,
              fullname: data.fullname,
            },
            Func.Secret()
          );

          return res.json({
            id: data.id,
            username: data.username,
            fullname: data.fullname,
            token: token,
            login: true,
          });
        })
        .catch((err) => {
          console.log(err);
          res.json("update Admin without password:", err);
        });
    }
  } else {
    res.json("Bu username de admin bar");
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;

  const data = await Admin.findOne({ where: { id: id } });
  if (data) {
    Admin.destroy({ where: { id: id } })
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
exports.login = login;
exports.update = update;
exports.Destroy = Destroy;
