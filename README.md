# parse-server-cloudinary-adapter

parse-server adapter for cloudinary

# installation

`npm install --save parse-server-cloudinary-adapter`

# usage with parse-server

### using a config file

```
{
  "appId": 'my_app_id',
  "masterKey": 'my_master_key',
  // other options
  "filesAdapter": {
    "module": "parse-server-cloudinary-adapter",
    "options": {
        cloud_name: 'cloud_name',
        api_key: 'api_key',
        api_secret: 'api_secret',
    }
  }
}
```

### using environment variables

Set your environment variables:

```
CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
```

And update your config / options

```
{
  "appId": 'my_app_id',
  "masterKey": 'my_master_key',
  // other options
  "filesAdapter": "parse-server-cloudinary-adapter"
}
```


### passing as an instance

```
var CloudinaryAdapter = require('parse-server-cloudinary-adapter');

var cloudinary_adapter = new CloudinaryAdapter({
        cloud_name: 'cloud_name',
        api_key: 'api_key',
        api_secret: 'api_secret',
    });

var api = new ParseServer({
	appId: 'my_app',
	masterKey: 'master_key',
	filesAdapter: cloudinary_adapter
})
```

or with an options hash

```
var CloudinaryAdapter = require('parse-server-cloudinary-adapter');

var cloudinaryOptions = {
        cloud_name: 'cloud_name',
        api_key: 'api_key',
        api_secret: 'api_secret',
    }

var cloudinary_adapter = new CloudinaryAdapter(cloudinaryOptions);

var api = new ParseServer({
  appId: 'my_app',
  masterKey: 'master_key',
  filesAdapter: cloudinary_adapter
})
```
