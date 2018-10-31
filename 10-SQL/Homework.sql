-- Makes it so all of the following code will affect sakila --
USE sakila;

-- 1a. Display the first and last names of all actors from the table actor--
SELECT first_name, last_name FROM actor;

-- 1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name--
SELECT UPPER(CONCAT(first_name, ' ', last_name)) AS NAME FROM actor;

-- 2a Select Joe--
SELECT actor_id, first_name, last_name FROM actor
WHERE first_name = 'Joe';

-- 2b Find all actors whose last name contain the letters GEN--
SELECT * FROM actor
WHERE last_name LIKE '%GEN%';

--  2c Order actors--
SELECT * FROM actor
WHERE last_name LIKE '%LI%'
ORDER BY last_name, first_name;

-- 2d Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China--
SELECT country_id, country FROM country
WHERE country IN ('Afghanistan', 'Bangladesh', 'China');

--  3a Add a middle_name column to the table actor. Position it between first_name and last_name--
ALTER TABLE actor
ADD COLUMN middle_name VARCHAR(30) NULL AFTER first_name;

-- 3b Change the data type of the middle_name column to blobs--
ALTER TABLE actor
CHANGE COLUMN middle_name middle_name BLOB NULL;

-- 3c Delete the middle_name column--
ALTER TABLE actor
DROP COLUMN middle_name;

-- 4a List the last names of actors, as well as how many actors have that last name--
SELECT DISTINCT last_name, COUNT(last_name) AS 'name_count' 
FROM actor  
GROUP BY last_name;

-- 4b List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors--
SELECT DISTINCT last_name,
COUNT(last_name) AS 'name_count' 
FROM actor  
GROUP BY last_name HAVING name_count >=2;

-- 4c Write a query to fix the record--
UPDATE actor SET
first_name = 'HARPO'  WHERE first_name = 'GROUCHO' AND last_name = 'WILLIAMS';

-- 4d In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO. Otherwise, change the first name to MUCHO GROUCHO--
SELECT actor_id FROM actor WHERE first_name = 'HARPO' AND last_name = 'WILLIAMS';
UPDATE actor SET
first_name = CASE WHEN first_name = 'HARPO' THEN 'GROUVHO' ELSE 'MUCHO GROUVHO' END
WHERE actor_id = 172;

-- 5a  Locate the schema of the address table--
SHOW CREATE TABLE address;
SELECT * FROM address;

-- 6a Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:--
SELECT staff.staff_id, staff.first_name, staff.last_name, address.address
FROM staff 
INNER JOIN address ON staff.address_id=address.address_id;

-- 6b Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment--
SELECT staff.staff_id, staff.first_name, staff.last_name, SUM(payment.amount) AS total_amount
FROM staff
INNER JOIN payment ON staff.staff_id=payment.staff_id
WHERE payment.payment_date LIKE '2005-08-%' GROUP BY payment.staff_id;

-- 6c List each film and the number of actors who are listed for that film. Use tables film_actor and film--
SELECT film.title, COUNT(film_actor.actor_id) AS number_actor
FROM film
INNER JOIN film_actor ON film.film_id=film_actor.film_id GROUP BY film.title;

-- 6d- Disply the copies of the film Hunchback Impossible exist in the inventory system-
SELECT title, COUNT(inventory_id) AS number_copy 
FROM film
INNER JOIN inventory ON film.film_id=inventory.film_id
WHERE title = 'Hunchback Impossible';

-- 6e list the total paid by each customer. List the customers alphabetically by last name--
SELECT first_name, last_name, SUM(payment.amount ) AS total_pay
FROM customer
INNER JOIN payment ON customer.customer_id=payment.customer_id
GROUP BY payment.customer_id
ORDER BY last_name ASC;

-- 7a Display the titles of movies starting with the letters K and Q whose language is English.--
SELECT title 
FROM film
WHERE language_id In 
  (SELECT language_id
   FROM language
   WHERE name = 'English'
   )
AND (title LIKE 'K%') OR (title LIKE 'Q%')

-- 7b Use subqueries to display all actors who appear in the film Alone Trip--
SELECT first_name, last_name
FROM  actor
WHERE actor_id in
	(SELECT actor_id 
    FROM film_actor
    WHERE film_id in
		(SELECT film_id 
        FROM film
        WHERE title = 'Alone Trip'
        )
	);


-- 7c Use joins to retrieve the names and email addresses of all Canadian customers--
SELECT first_name, last_name, email
FROM customer
WHERE address_id in
	(SELECT address_id
    FROM address
    WHERE city_id in
		(SELECT city_id 
        FROM city
        WHERE country_id in
			(SELECT country_id
            FROM country
            WHERE country = 'Canada'
            )
		)
	);

-- 7d Identify all movies categorized as family films.--
SELECT title 
FROM film
WHERE film_id in
	(SELECT film_id
    FROM film_category
    WHERE category_id in
		(SELECT category_id 
        FROM category
        WHERE name = 'family'
        )
	);

-- 7e Display the most frequently rented movies in descending order--
SELECT film.title, COUNT(rental_id) AS 'rent_count'
FROM film, inventory, rental 
WHERE  film.film_id = inventory.film_id AND rental.inventory_id = inventory.inventory_id
GROUP BY inventory.film_id 
ORDER BY COUNT(rental_id) DESC;

-- 7f Write a query to display how much business, in dollars, each store brought in--
SELECT store.store_id, SUM(amount) AS total
FROM store 
INNER JOIN staff ON store.store_id = staff.store_id 
INNER JOIN payment ON payment.staff_id = staff.staff_id 
GROUP BY store.store_id;

-- 7g Write a query to display for each store its store ID, city, and country--
SELECT store.store_id, city.city, country.country
FROM store
INNER JOIN address ON store.address_id = address.address_id
INNER JOIN city ON city.city_id = address.city_id
INNER JOIN country ON country.country_id = city.country_id;

-- 7h List the top five genres in gross revenue in descending order--
SELECT name, SUM(payment.amount) AS gross_revenue 
FROM category
INNER JOIN film_category ON film_category.category_id = category.category_id
INNER JOIN inventory ON inventory.film_id = film_category.film_id
INNER JOIN rental ON rental.inventory_id = inventory.inventory_id
INNER JOIN payment ON payment.rental_id = rental.rental_id
GROUP BY name
ORDER BY gross_revenue DESC LIMIT 5;

-- 8a Use the solution from the problem above to create a view--
DROP VIEW IF EXISTS top_five_genres;
CREATE VIEW top_five_genres AS
SELECT name, SUM(payment.amount) AS gross_revenue 
FROM category
INNER JOIN film_category ON film_category.category_id = category.category_id
INNER JOIN inventory ON inventory.film_id = film_category.film_id
INNER JOIN rental ON rental.inventory_id = inventory.inventory_id
INNER JOIN payment ON payment.rental_id = rental.rental_id
GROUP BY name
ORDER BY gross_revenue DESC LIMIT 5;

-- 8b Display the view created--
SELECT * FROM top_five_genres;

-- 8c Delete the view created--
DROP VIEW top_five_genres;

