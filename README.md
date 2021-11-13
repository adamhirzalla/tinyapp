# TinyApp Project

TinyApp is a full stack web application that I built in order to familiarize myself with Node and Express. TinyApp allows users to shorten long URLs and share them around (à la bit.ly).

## Features
- Shorten any long URL into a 6-char TinyURL to be shared with others
- View and manage all your URLs through your account's dashboard, from 'My URLs' page
- Easily Add/Edit/Delete any of your TinyURLs
- Hashed passwords and Encrypted Cookies to ensure safety of sensitive information
- Track the number of clicks/visits your TinyURL receives (NEW!)
- See stats of all visitors by viewing the time and date they viewed your TinyURL (NEW!)
- Track the number of UNIQUE visitors on your TinyURL (NEW!)

## Final Product

- Login Page (Main):
!["Login Page (Main)"](https://github.com/adamhirzalla/tinyapp/blob/master/docs/login_page.png)

- Registration Page:
!["Registration Page"](https://github.com/adamhirzalla/tinyapp/blob/master/docs/register_page.png)

- URLs list upon first logging in:
!["URLs list upon first logging in"](https://github.com/adamhirzalla/tinyapp/blob/master/docs/empty_urls.png)

- Populated URLs list:
!["Populated URLs list"](https://github.com/adamhirzalla/tinyapp/blob/master/docs/urls_page.png)

- Creating a new TinyURL:
!["Creating a new TinyURL"](https://github.com/adamhirzalla/tinyapp/blob/master/docs/create_page.png)

- Viewing/editing an existing TinyURL - example 1:
!["Editing/viewing an existing TinyURL"](https://github.com/adamhirzalla/tinyapp/blob/master/docs/edit_page.png)

- Viewing/editing an existing TinyURL - example 2:
!["Editing/viewing an existing TinyURL"](https://github.com/adamhirzalla/tinyapp/blob/master/docs/edit_page_2.png)

- Accessing URLs list without logging in:
!["Accessing URLs list without logging in"](https://github.com/adamhirzalla/tinyapp/blob/master/docs/urls_page_no_user.png)

- Error page - example 1:
!["Error page - example 1"](https://github.com/adamhirzalla/tinyapp/blob/master/docs/error_page_example.png)

- Error page - example 2:
!["Error page - example 2"](https://github.com/adamhirzalla/tinyapp/blob/master/docs/error_page_example_2.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser (unless using a newer/recent version of Express which has this built-in)
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node index.js` command.
- Navigate to http://localhost:8080/ to get started!