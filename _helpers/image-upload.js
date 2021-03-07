

// module.exports = upload;
// const aws = require("aws-sdk");
// const s3 = new aws.S3();


// async function upload(req, res, next) {

//     aws.config.update({
//         accessKeyId: "AKIATLVUCBQDT6UBLOWL",
//         secretAccessKey: "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"
//     });
//     console.log(Buffer.from(req.files))

//     const fileContent = Buffer.from(req.files.data, 'binary');

//     const params = {
//         Bucket: 'webapp.wenhao.min',
//         Key: "folder/" + "_" + path.basename(filePath),
//         Body: fileContent
//     };
//     s3.upload(params, function (err, data) {
//         if (err) {
//             throw err;
//         }
//         res.send({
//             "response_code": 200,
//             "response_message": "Success",
//             "response_data": data
//         });
//     });
//     next();
// }
