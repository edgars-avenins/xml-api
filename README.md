# xml-api
Making my 1st api that returns sitemaps from your entered site or links from a specific sitemap

## The API
What it basically does is - you give it a url and it will return you the sitemap options (if there are any)
/auto will automatically open the sitemap link if there is only 1 and send back a list of links with category options

### Endpoints

#### https://robot-sitemap-api.herokuapp.com/api/v1/xml/
#### https://robot-sitemap-api.herokuapp.com/api/v1/xml/auto

Will require the same type of body attached to them e.g. ```{url: "google.com"}```
Will remove body from GET soon


#### https://robot-sitemap-api.herokuapp.com/api/v1/sitemap

Will require a body with e.g. ```{url: "https://www.google.com/sitemap.xml"}```
With the actual sitemap link
