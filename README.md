# Node skeleton set-up

## Node version required
14.15.0

## Setup
Install all dependencies by running command ```npm i```

## Start server
Server can be started by running the command ```npm start```

## Usage
Using this boilerplate the code will be very ```decoupled```, writing test cases will be extremely easy, the same boilerplate can be used for micro-service architecture as well.

## Dependency Injection
Third party services like DB calls, cache server calls, third party API calls, cloud server calls can be kept in a registry for services. We are using [Dislocator](https://www.npmjs.com/package/dislocator) node module for managing the same.

Writing unit test cases become extremely easy as for each test case we can inject custom service registry object which contains stubbed/spied version of services that will be used in the respective test case thus writing test cases will be extremely easy.

For stubbing/spying services one can use [Sinon.js](https://sinonjs.org/) or any other similar library.

# Logger
Logger have been setup in a separate file which picks up configuration from a config file. Same logger can be used throughout the application so if at any place we need to use it we will be logging it using the same file. In future if logger needs to be changes we only have to update at one place.