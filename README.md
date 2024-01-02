# Node Typescript BoilerPlate

updated boilerplate using tsoa Swagger specs and routes generation. `src/routes` is generated and should not be modified. Routes should be codded in `src/controllers` and will be compiled into Swagger/Express routes and api specs

## Commands

### Serve

`npm run serve`

serve the api and js docs

### Build

`npm run build`

build the api

## TSOA

in depth documentation on [tsoa](https://tsoa-community.github.io/docs/introduction.html)

## Fern

in depth documentation on [fern](https://docs.buildwithfern.com/)

### Initialize

`npm run sdk-init`

sdk-init will initialize the SDK in the `fern/` directory.

``` yaml
fern/
    openapi/
        - swagger.json #pulled from `src/routes/swagger.json`
    - fern.config.json
    - generators.yml
```

Set the SDK module name in the `fern.config.json` file

``` json
{
    "organization": "NodeBoilerplate", // results in `NodeBoilerplateApiClient`
    ...
}
```

### Build Local Package

`npm run sdk--build`

run `sdk-build` script to build local development sdk. this will create a `package.json` and install dependencies in the `generated/typescript/` directory and link the package.


### Updating and Publishing API SDK

when making changes to your implementation and swagger routes and specs, update the `swagger.json` in `fern/openapi/swagger.json` from `src/routes/swagger.json`.

---

Setup the output to publish directly to npm

`generators.yml`

``` yaml
generators:
  groups:
    public:
      - name: fernapi/fern-typescript-node-sdk
        version: 0.7.2
        output:
          location: npm
          package-name: name # replace with your package name
          token: ${NPM_TOKEN}
```
