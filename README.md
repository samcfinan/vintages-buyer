# Vintages Buyer

An automated script to quickly buy wine from the [LCBO Vintages Shop](http://www.vintagesshoponline.com) when new products are released. Driven by [Playwright](https://github.com/microsoft/playwright).

![Demo Video](https://storage.googleapis.com/assets-samcfinan/wine-buyer-demo.gif)

Steps:

1. Install dependencies `npm install`
2. Copy `config.example.yaml` to `config.yaml` and configure.
   - Note that by default, the script will not complete the purchase for you but will wait at the checkout page.
3. Run via `npm run start`
