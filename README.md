# parse-server-cloudinary-adapter

parse-server adapter for cloudinary

# installation

`npm install --save parse-server-cloudinary-adapter`

# usage with parse-server

### using a config file

```

var CloudinaryAdapter = require('parse-server-cloudinary-adapter');

var api = new ParseServer({...
  filesAdapter: new CloudinaryAdapter({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'cloud_name',
    api_key: process.env.CLOUDINARY_API_KEY || 'api_key',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'api_secret'
  }),
  ...
});
```
