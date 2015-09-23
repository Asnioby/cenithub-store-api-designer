# API Designer

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/mulesoft/api-designer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/mulesoft/api-designer.png)](https://travis-ci.org/mulesoft/api-designer)
[![Dependency Status](https://david-dm.org/mulesoft/api-designer.png)](https://david-dm.org/mulesoft/api-designer#info=dependencies)
[![DevDependency Status](https://david-dm.org/mulesoft/api-designer/dev-status.png)](https://david-dm.org/mulesoft/api-designer#info=devDependencies)

**API Designer** is a standalone/embeddable editor for [RAML](http://raml.org) (RESTful API Modeling Language) written in JavaScript using Angular.JS. By default, the editor uses an in-browser filesystem stored in HTML5 Localstorage.

## CENITHub Store Confuguration

1. Create tenant in CenitSaaS [Sign Up](https://cenitsaas.com/users/sign_up) or [Sign In](https://cenitsaas.com/users/sign_in) 
2. Go to Cenithub
3. Pull Shared Collection RAMLStore
4. Configure Cenithub API Header ``` X-User-Access-Key ``` and ```X-User-Access-Token```
5. Define ```url```  Example: ```https://www.cenithub.com/api/v1/raml/file```
5. Run  ``` node bin/api-designer.js ``` Test URL:  ```http://localhost:3000```

## Running Locally

* npm install
* Run  ``` node bin/api-designer.js ``` Test URL:  ```http://localhost:3000```

This will start a local designer instance using Cenithub store filesystem.

## License

Copyright 2013 MuleSoft, Inc. Licensed under the Common Public Attribution License (CPAL), Version 1.0
