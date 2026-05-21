const { setWorldConstructor } = require('@cucumber/cucumber');

class CustomWorld {
  constructor() {
    this.user = null;
    this.token = null;
    this.response = null;
  }
}

setWorldConstructor(CustomWorld);
