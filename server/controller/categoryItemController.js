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
const mammoth = require("mammoth");

// const pdf2html = require("pdf2html");
// const { exec } = require("child_process");
// const puppeteer = require("puppeteer");

const PDFParser = require("pdf-parse");
// const htmlToImage = require("html-to-image");
const pdf2html = require("pdf2html");
// const PDFReader = require("pdfreader").PDFReader;
var pdfcrowd = require("pdfcrowd");
const { fromPath } = require("pdf2pic");
// const { PDFNet } = require("@pdftron/pdfnet-node");
// const { PdfDocument, ImageType } = require("@ironsoftware/ironpdf");

const getAll = async (req, res) => {
  const { search_query, active, deleted, page, limit, CategoryId } = req.query;

  const CategoryID =
    CategoryId && CategoryId != 0 ? { CategoryId: CategoryId } : null;
  const Active = active ? { active: active } : null;
  const Deleted = deleted ? { deleted: deleted } : null;
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

  const Page = page ? page : 1;
  const Limit = limit ? limit : 20;
  const Ofset = Limit * (Page - 1);
  CategoryItem.findAndCountAll({
    include: [{ model: Category }, { model: CategoryItemFile }],
    where: {
      [Op.and]: [Username, Active, Deleted, CategoryID],
    },
    limit: Limit,
    offset: Ofset,

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
  const data = await CategoryItem.findOne({ where: { id: id } });
  if (data) {
    CategoryItem.findOne({
      include: [{ model: Category }, { model: CategoryItemFile }],
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
    res.send("BU ID boyuncha CategoryItem yok!");
  }
};

const create = async (req, res) => {
  try {
    const {
      card_type,
      icon,
      icon_white,
      name_tm,
      name_ru,
      name_en,
      text_tm,
      text_ru,
      text_en,
      author,
      year,
      publishing,
      CategoryId,
    } = req.body;

    const files = req.files?.file;
    let img_direction = "";
    let placeholder_direction = "";
    let randomNumber2 = Math.floor(Math.random() * 999999999999);
    let mimeTypeFile = "";
    let fileHTML_ru = "";
    let fileHTML = "";

    if (files) {
      const typeArray = files?.name.split(".");
      mimeTypeFile = typeArray[typeArray.length - 1];
      let randomNumber = Math.floor(Math.random() * 999999999999);
      img_direction = `./uploads/` + randomNumber + `${files?.name}`;
      await fs.promises.writeFile(img_direction, files?.data);
      console.log("mimeTypeFile::" + mimeTypeFile);
      if (mimeTypeFile == "pdf") {
        placeholder_direction = "./uploads/img" + randomNumber2 + ".1.png";
        // Parse the PDF file
        const pdf = await PDFParser(files?.data);

        // console.log(pdf.text);
        fileHTML_ru = pdf.text;
        // ---------------------------------------------------------------------------
        // // create the API client instance
        // var client = new pdfcrowd.PdfToHtmlClient(
        //   "demo",
        //   "ce544b6ea52a5621fb9d55f8b542d14d"
        // );

        // // run the conversion and write the result to a file
        // client.convertFileToFile(
        //   img_direction,
        //   "./uploads/" + randomNumber + files?.name + ".html",
        //   function (err, fileName) {
        //     if (err) return console.error("Pdfcrowd Error: " + err);
        //     console.log("Success: the file was created " + fileName);

        //     fs.readFile(fileName, (err, data) => {
        //       if (err) console.log(err);
        //       doit(data.toString());
        //     });
        //     // fileHTML?.length > 0 && fs.unlink(fileName);
        //   }
        // );
        // ---------------------------------------------------------------------------
        //  generate png file from pdf first page
        const options = {
          density: 100,
          saveFilename: "./uploads/img" + randomNumber2,
          format: "png",
          width: 350,
          height: 500,
        };

        const convert = fromPath(img_direction, options);
        const pageToConvertAsImage = 1;

        async function convertPdfPageToImage() {
          try {
            const result = await convert(pageToConvertAsImage, {
              responseType: "image",
            });
            return result;
          } catch (error) {
            console.error("Conversion error:", error);
          }
          console.log("Page 1 is now converted as an image");
        }

        const newResult = await convertPdfPageToImage();
        console.log(newResult);

        // let randomNumber2 = Math.floor(Math.random() * 999999999999);
        // placeholder_direction =
        //   `./uploads/` + randomNumber2 + `${newResult?.name}`;
        // await fs.promises.writeFile(placeholder_direction, newResult?.data);
      } else if (mimeTypeFile == "docx") {
        const result = await mammoth.convertToHtml({ path: img_direction });
        fileHTML = result.value;
      }
    }

    // const doit = async (fileHTML) => {
    const data = await CategoryItem.create({
      card_type,
      icon,
      icon_white,
      name_tm,
      name_ru,
      name_en,
      text_tm: fileHTML,
      text_ru: fileHTML_ru,
      text_en,
      author,
      year,
      publishing,
      placeholder: placeholder_direction,
      CategoryId,
    });

    const itemFile = await CategoryItemFile.create({
      name: data?.name_tm,
      filename: img_direction,
      filetype: mimeTypeFile,
      placeholder: placeholder_direction,
      CategoryItemId: data.id,
    });

    res.json({ data, itemFile, fileHTML });
    // };
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const {
      card_type,
      icon,
      icon_white,
      name_tm,
      name_ru,
      name_en,
      text_tm,
      text_ru,
      text_en,
      author,
      year,
      publishing,
      order_num,
      id,
    } = req.body;

    const oldData = await CategoryItem.findOne({
      include: [{ model: CategoryItemFile }],
      where: { id: id },
    });

    if (!oldData) {
      res.json("Bu Id boyuncha maglumat yok!");
    }

    const files = req.files?.file;

    let img_direction =
      oldData?.CategoryItemFiles?.length > 0
        ? oldData?.CategoryItemFiles[0]?.filename
        : "";
    let placeholder_direction = oldData?.placeholder;
    let randomNumber2 = Math.floor(Math.random() * 999999999999);
    let mimeTypeFile =
      oldData?.CategoryItemFiles?.length > 0
        ? oldData?.CategoryItemFiles[0]?.filetype
        : "";
    let fileHTML_ru = oldData?.text_ru;
    let fileHTML = oldData?.text_tm;

    if (files) {
      const typeArray = files?.name.split(".");
      mimeTypeFile = typeArray[typeArray.length - 1];
      let randomNumber = Math.floor(Math.random() * 999999999999);
      img_direction = `./uploads/` + randomNumber + `${files?.name}`;
      await fs.promises.writeFile(img_direction, files?.data);
      console.log("mimeTypeFile::" + mimeTypeFile);
      if (mimeTypeFile == "pdf") {
        placeholder_direction = "./uploads/img" + randomNumber2 + ".1.png";
        // Parse the PDF file
        const pdf = await PDFParser(files?.data);

        // console.log(pdf.text);
        fileHTML_ru = pdf.text?.replace(/\s/g, "");
        // ---------------------------------------------------------------------------

        // ---------------------------------------------------------------------------
        //  generate png file from pdf first page
        const options = {
          density: 100,
          saveFilename: "./uploads/img" + randomNumber2,
          format: "png",
          width: 350,
          height: 500,
        };

        const convert = fromPath(img_direction, options);
        const pageToConvertAsImage = 1;

        async function convertPdfPageToImage() {
          try {
            const result = await convert(pageToConvertAsImage, {
              responseType: "image",
            });
            return result;
          } catch (error) {
            console.error("Conversion error:", error);
          }
          console.log("Page 1 is now converted as an image");
        }

        const newResult = await convertPdfPageToImage();
        console.log(newResult);
      } else if (mimeTypeFile == "docx") {
        const result = await mammoth.convertToHtml({ path: img_direction });
        fileHTML = result.value;
        fileHTML_ru = result.value?.replace(/\s/g, "");
      }
    }

    // const doit = async (fileHTML) => {
    const data = await CategoryItem.update(
      {
        order_num,
        card_type,
        icon,
        icon_white,
        name_tm,
        name_ru,
        name_en,
        text_tm: fileHTML,
        text_ru: fileHTML_ru,
        text_en,
        author,
        year,
        publishing,
        placeholder: placeholder_direction,
      },
      {
        where: {
          id: id,
        },
      }
    );

    const itemFile = await CategoryItemFile.update(
      {
        name: data?.name_tm,
        filename: img_direction,
        filetype: mimeTypeFile,
        placeholder: placeholder_direction,
      },
      {
        where: { CategoryItemId: id },
      }
    );

    res.json({ data, itemFile, fileHTML });
    // };
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const Destroy = async (req, res) => {
  const { id } = req.params;

  const data = await CategoryItem.findOne({
    include: [{ model: CategoryItemFile }],
    where: { id: id },
  });
  if (data) {
    data?.placeholder?.length > 0 &&
      fs.unlink(data?.placeholder, (err) => {
        if (err) console.log(err);
        console.log(data?.placeholder + " was deleted");
      });
    data?.CategoryItemFiles?.map((itemFile) => {
      itemFile?.filename?.length > 0 &&
        fs.unlink(itemFile?.filename, (err) => {
          if (err) console.log(err);
          console.log(itemFile?.filename + " was deleted");
        });
    });

    CategoryItem.destroy({
      where: { id: id },
      include: [{ model: CategoryItemFile }],
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

const download = async (req, res) => {
  const { id } = req.params;
  const data = await CategoryItemFile.findOne({
    where: { CategoryItemId: id },
  });
  console.log("filePath:::::>>>>>" + data?.filename);
  // Check if the file exists
  if (fs.existsSync(data?.filename)) {
    // Set the headers for the file download
    res.setHeader("Content-Disposition", "attachment; filename=file_name.ext");
    res.setHeader("Content-Type", "application/octet-stream");

    // Read the file and send it as a response
    const fileStream = fs.createReadStream(data?.filename);
    fileStream.pipe(res);
  } else {
    res.status(404).send("File not found");
  }
};

exports.getAll = getAll;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.Destroy = Destroy;
exports.download = download;
