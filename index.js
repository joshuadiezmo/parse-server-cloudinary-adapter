var cloudinary = require('cloudinary');
var streamBuffers = require('stream-buffers');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
'use strict';
// Cloudinary

function requiredOrFromEnvironment(options, key, env) {
    options = options || {};
    options[key] = options[key] || process.env[env];
    if (!options[key]) {
        throw `Cloudinary requires option '${key}' or env. variable ${env}`;
    }
    return options;
}

function fromEnvironmentOrDefault(options, key, env, defaultValue) {
    options = options || {};
    options[key] = options[key] || process.env[env] || defaultValue;
    return options;
}

function optionsFromArguments(args) {
    let options = args;
    options = requiredOrFromEnvironment(options, 'cloud_name', 'CLOUDINARY_CLOUD_NAME');
    options = requiredOrFromEnvironment(options, 'api_key', 'CLOUDINARY_API_KEY');
    options = requiredOrFromEnvironment(options, 'api_secret', 'CLOUDINARY_API_SECRET');
    options = fromEnvironmentOrDefault(options, 'development', 'IS_DEVELOPMENT', true);
    return options;
}

function Cloudinary(data) {
    var options = optionsFromArguments(data || {});
    this.cloudinary_config = options;
    this.TempFolder = 'temp';
    mkdirp(__dirname + path.sep + this.TempFolder, function(err) {
        console.log(err);
    });
    cloudinary.config({cloud_name: options.cloud_name, api_key: options.api_key, api_secret: options.api_secret});
}

Cloudinary.prototype.createFile = function(filename, data) {
    var options = {};

    var type = this.getResourceType(filename);
    var nameOnly = "";
    if (type == 'image') {
        nameOnly = filename.split('.');
        nameOnly.pop();
        nameOnly = nameOnly.join('.');
        options.public_id = nameOnly;
        options.resource_type = "image";
    } else if (type == 'video') {
        nameOnly = filename.split('.');
        nameOnly.pop();
        nameOnly = nameOnly.join('.');
        options.public_id = nameOnly;
        options.resource_type = "video";
    } else {
        options.public_id = filename;
        options.resource_type = "raw";
    }
    var self = this;
    return new Promise((resolve, reject) => {
            var fileTempPath = __dirname + path.sep + self.TempFolder + path.sep + filename.replace(/\//g, '~');
    fs.writeFile(fileTempPath, data, function(err) {
        if (err) {
            console.log("UPLOAD_ERROR", err);
            return reject(err);
        } else {
            try {
                console.log(options)
                cloudinary.uploader.upload(fileTempPath, function(result) {
                    fs.unlink(fileTempPath);
                    if (result.error) {
                        reject(result.error);
                    } else
                        resolve(data)
                }, options);
            } catch (e) {
                fs.unlink(fileTempPath);
                reject(e);
            }
        }
    });
});
}

Cloudinary.prototype.deleteFile = function(filename) {
    var folder = this.folder;
    return new Promise(function(resolve, reject) {
        ifWebp(folder, filename).then(function(_filename) {
            filename = _filename;
            fs.unlink(__dirname + path.sep + ".." + path.sep + folder + path.sep + filename, function(err) {
                    if (err) {
                        console.log('err', err);
                        reject(err)
                    } else
                        resolve();
                }
            )
        });
    });
}

Cloudinary.prototype.getFileData = function(filename) {
    var folder = this.folder;
    return new Promise(function(resolve, reject) {
        ifWebp(folder, filename).then(function(_filename) {
            filename = _filename;
            try {
                fs.readFile(__dirname + path.sep + ".." + path.sep + folder + path.sep + filename, null, function(err, data) {
                        if (err) {
                            console.log('err', err);
                            reject(err);
                        } else
                            resolve(data);
                    }
                );
            } catch (e) {
                console.log('err', e);
                reject(e);
            }
        });
    });
}

Cloudinary.prototype.getFileLocation = function(config, filename) {
    return ("https://res.cloudinary.com/" + this.cloudinary_config.cloud_name + "/" + this.getResourceType(filename) + "/upload/" + encodeURIComponent(filename));
}

Cloudinary.prototype.getResourceType = (filename) => {
    var ResourceType = 'raw';
    if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(filename)) {
        ResourceType = 'image'
    } else if ((/\.(mp4|3gp|3g2|mpeg|mpg|amv|wmv|mov|avi|ogg|flv|webm|mkv)$/i).test(filename)) {
        ResourceType = 'video'
    }
    return ResourceType;
}

module.exports = Cloudinary;
module.exports.default = Cloudinary;
