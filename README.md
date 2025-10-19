# InteractiveDataDashboard
This is a project for learning JQuery

## Technical Summary (Concise)

###  How to run locally
Open the index.html file directly in the browser. No server is required.

### What endpoints you call and which fields you use. 
Endpoints: /products, /categories

Fields Used: title, price, category, image

### Filters & Sorts  
Filters: I used the Array.prototype.filter() method to implement filters. This approach helps to reduce code verbosity and efficiently generates a new array containing only the elements that match the specified condition.  
for: Product Name, Category, Price (Min-Max).

Sorts: I used the Array.prototype.sort() method. For sorting text fields, I used localeCompare() to ensure correct character comparison across different locales  
for: Product Name, Price.

### Computed Metrics
- Average Price
Sum all the prices of the currently displayed products, then divide by the total number of products.
- Min-Price
Display the lowest price remaining after comparing the price of each product one by one during the process of generating the elements for screen display.
- Max-Price
Display the highest price remaining after comparing the price of each product one by one during the process of generating the elements for screen display.
### Known Limitations
Images: Unstable image URLs (load slowly or fail).

Data: API response data updates frequently, risking unexpected issues.