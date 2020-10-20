# Magic Potion #1

## Table of Contents
- [Magic Potion #1](#magic-potion-1)
  - [Table of Contents](#table-of-contents)
  - [How To Run The Site](#how-to-run-the-site)
  - [Data Schema](#data-schema)
  - [How This Could Scale](#how-this-could-scale)
  - [Front End Architecture](#front-end-architecture)
  - [API Architecture](#api-architecture)
  - [What I Would Do Differently](#what-i-would-do-differently)
  - [Improvements I Could Make](#improvements-i-could-make)

## How To Run The Site

I chose to develop this web application using Grails version 3.2.4, React profile. Thus, you could install this version of Grails and run the application using `grails` commands. However, the simplest thing to do is to start up the app using the Gradle tool that is included. 

To run the project using Gradle, navigate to the root directory of the project in your terminal and run `./gradlew bootRun -parallel`. (Use gradlew.bat for Windows environments.) This will start both the client and server projects in one command. You should be able to access the UI (client) at http://localhost:3000/. The API (server) should be accessible at http://localhost:8080/.

For more information about starting up the application, see https://grails-profiles.github.io/react/latest/guide/index.html#usage.

 If you wish to install Grails, you can follow the instructions [here](http://docs.grails.org/3.2.4/guide/gettingStarted.html#downloadingAndInstalling).

## Data Schema

Because this project will probably not be used in a production environment, I decided to use the default in-memory H2 database configuration that comes with Grails projects. When starting the project locally, the database will be recreated, and the tables will be empty. 

The schema of the project is made up of three tables:
* ADDRESS: Contains an ID, the order ID that the address belongs to, as well as the address information (line 1, line 2, city, state, and zip) used when the order was created. The magic_potion_order_id field is a foreign key that maps the ADDRESS record to a MAGIC_POTION_ORDER record. Thus, all deletions of MAGIC_POTION_ORDER records will cascade to the ADDRESS table.
* MAGIC_POTION_ORDER: Contains order-specific information such as the order created time, contact information of the person who created the order (email, first name, last name, phone number), and item/order information (quantity, total, fulfillment status).
* PAYMENT: Contains credit card number and expiration date for a particular order. The magic_potion_order_id field is a foreign key that maps the PAYMENT record to a MAGIC_POTION_ORDER record. Thus, all deletions of MAGIC_POTION_ORDER records will cascade to the PAYMENT table.

```
ADDRESS
-------
FIELD                   TYPE  	        NULLABLE
ID	                    BIGINT(19)	    NO	
VERSION	                BIGINT(19)	    NO
CITY	                VARCHAR(255)	NO
MAGIC_POTION_ORDER_ID	BIGINT(19)	    NO
STATE	                VARCHAR(255)	NO
STREET1	                VARCHAR(255)	NO
STREET2	                VARCHAR(255)	NO
ZIP	                    VARCHAR(255)	NO

MAGIC_POTION_ORDER
------------------
FIELD  	            TYPE  	        NULLABLE 
ID	                BIGINT(19)	    NO
VERSION	            BIGINT(19)	    NO
CREATED_DATETIME	TIMESTAMP(23)	NO
EMAIL	            VARCHAR(255)	NO
FIRST_NAME	        VARCHAR(255)	NO
FULFILLED	        BOOLEAN(1)	    NO
LAST_NAME	        VARCHAR(255)	NO
PHONE	            VARCHAR(255)	NO
QUANTITY	        INTEGER(10)	    NO
TOTAL	            VARCHAR(255)	NO

PAYMENT
-------
FIELD  	                TYPE  	        NULL
ID	                    BIGINT(19)	    NO
VERSION	                BIGINT(19)	    NO
CC_NUM	                VARCHAR(255)	NO
EXP	                    VARCHAR(255)	NO
MAGIC_POTION_ORDER_ID	BIGINT(19)	    NO
```

None of the fields are nullable, although I debated whether or not to make address line 2 nullable. Also, I decided to separate out the tables in case the payment or address information wanted to be shared across multiple types of orders (not just a Magic Potion order).

The schema can be built manually by running the SQL in ddl.sql, which has been included in the root directory of the project.

## How This Could Scale

One goal that I had in mind while working on this was to reduce the load on the server by handling as much of the validation as I could on the client side. This meant that I had to validate all of the fields in React code and prevent this code from calling out to the back end if there was an invalid field. This way, more and more users could access the UI without being able to hit the server on every Submit with invalid input data.

For the backend, I tried to write as few queries as possible so that the database is not overloaded and the ORM doesn't take up as much time. This way, more API users will receive responses quicker. In the future, we may want to add some rate-checking to limit the number of times an API user could hit the server in a small period of time.

## Front End Architecture

For the front end of the application, I used React JS. Since we only have one page for what is really just a test application, I decided to put all of the code for the single page into the file `client/src/App.js`. The code could be organized better by separating it out into its own     `MagicPotionPage` component however. The page is simply a styled form with a typical on submit function as well as an on change function on each input field. The state is updated whenever a user makes a change to an input field. All of the validation is handled on submit. When a field contains invalid text, an error for that field is added to a list in the state. For each error field name in the list, we display an error message beneath the corresponding input field so that the user can easily see which fields need to be updated. I decided to display a default browser alert after the submit function has been run. This tells the user if there was a success in creating their order or not. It also gives them a reason for why an order was not created if it wasn't created after submit.

## API Architecture

Most of the API code can be found in `server/grails-app/controllers/curologymagicpotionapp/MagicController.groovy`. URL mappings to this controller and the corresponding action can be found in `server/grails-app/controllers/curologymagicpotionapp/UrlMappings.groovy`. As can be seen in this file, we map all HTTP POST requests to `/api/magic` to the `create` action in `MagicController.groovy`. Any GET requests to `/api/magic/$uid` are mapped to `MagicController.retrieve`. Any PATCH requests to `/api/magic` are mapped to `MagicController.patch`. Any DELETE requests to `/api/magic/$id` are mapped to `MagicController.delete`. Each of these actions handles validation of input and then handles the data based on the criteria given for the particular action. As mentioned before, as few database calls were made as possible to keep the calls as quick as possible.

## What I Would Do Differently

I would do a few things differently next time. Firstly, I would organize the code better. I think that if there was a higher probability that this project would be worked on in the future than I would try to create smaller components for reuse. Secondly, I would add better, more specific validation. I didn't handle some valid cases (e.g. if a phone number is formatted with dashes or parenthesis), and I believe that could be made better. Thirdly, I would become more comfortable with using the latest version of Grails in order to take advantage of any improvements in newer versions. Finally, I would add some rate limiting to the project API so that API users would not be able to flood the server with calls.

## Improvements I Could Make

- Add rate limiting to API endpoints
- Clarify and add well-defined validation
- Add more validation for fields coming to back end
- Use Bootstrap CSS in the front end in order to build out columns instead of defining my own widths for `divs`
- Upgrade Grails version
- Have a better code organization
- Add unit tests for functions with 100% line coverage