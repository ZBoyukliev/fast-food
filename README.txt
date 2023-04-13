README 

fast-food app(Aladin) includes;

CREATE, EDIT AND DELETE are in "КОМЕНТАРИ И РЕВЮТА" where you can create, edit and delete reviews with name, photos and comments.
You can create comments only if you are loged in user. 


 - Login page
   -- There is 1 default registeret user 
      --- zarko@abv.bg with password - 123456

 - Register page
  --There is validation wich required minimum 6 digit password wich includes 1 lowercase and one uppercase letter.

 - Logout page

 - Home page

 - Details page
   -- If you click on button 'ДОБАВИ' you can check all the information about the product.
   

 - Offers page
   -- In this page there are the offers at the moment.

 - Menu(with submenus) page
    -- Here you can go through all types of food and check details 

  - Comments page
    if you are loged user:
     -- You can create your review with photo and comment.
     -- You can edit or delete your review.
     -- There are 3 default comments.
     -- Only the howner of the comment can see buttons edit and delete.

    if you are not loged user:
    --You can only see comments of others with no option to add yours.

  - Tolley
    -- In trolley you can add food products where you can see quantity, price and total price.
    -- ONLY loget users can complete the orders.

 - Create order page.
    -- Here you can commplete your order.
    -- ONLY loget users can complete the orders.
    -- If you are not loged user you can only see the items in the basket and final price to pay.
    -- There are 2 default discount codes.
      1. DISC10 - Which gives you 10% off your total price.
      2. DISC10 - Which gives you 20% off your total price.

 - Astandarts(static) page.
   --This is static page wich hold the basic information.

 - Whats(static) new 
   --This is static page wich hold the basic information.

 - SoftUni practice server which is in folder server.

    -- to start the server go to folder server and start with command 'node server.js'

